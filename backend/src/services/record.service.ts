import { RecordModel, IRecord } from "../models/Record.model";
import {
  ListRecordsQuery,
  StatsQuery,
  getPagination,
  createPaginatedResponse,
  PaginatedResponse,
} from "../utils/pagination";

export interface GenderStats {
  _id: string;
  count: number;
  percentage: number;
}

export interface LocationStats {
  _id: string;
  count: number;
}

export interface InterestStats {
  _id: string;
  count: number;
}

export interface DashboardStats {
  totalRecords: number;
  genderDistribution: GenderStats[];
  locationDistribution: LocationStats[];
  interestDistribution: InterestStats[];
  avgAge: number;
}

export class RecordService {
  async listRecords(
    query: ListRecordsQuery
  ): Promise<PaginatedResponse<IRecord>> {
    const pagination = getPagination(query);

    // Build filter
    const filter: any = {};

    if (query.gender) {
      filter.gender = query.gender;
    }

    if (query.locationType) {
      filter.locationType = query.locationType;
    }

    if (query.digitalInterest) {
      filter.digitalInterest = query.digitalInterest;
    }

    if (query.brandDevice) {
      filter.brandDevice = query.brandDevice;
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    // Build sort
    const sort: any = {};
    sort[query.sortBy] = query.sortOrder === "asc" ? 1 : -1;

    // Execute queries in parallel
    const [records, total] = await Promise.all([
      RecordModel.find(filter)
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean()
        .exec(),
      RecordModel.countDocuments(filter).exec(),
    ]);

    return createPaginatedResponse(records, total, pagination);
  }

  async getGenderStats(query: StatsQuery = {}): Promise<GenderStats[]> {
    const matchStage: any = {};

    if (query.locationType) {
      matchStage.locationType = query.locationType;
    }

    if (query.digitalInterest) {
      matchStage.digitalInterest = query.digitalInterest;
    }

    if (query.dateFrom || query.dateTo) {
      matchStage.date = {};
      if (query.dateFrom) matchStage.date.$gte = query.dateFrom;
      if (query.dateTo) matchStage.date.$lte = query.dateTo;
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    const results = await RecordModel.aggregate(pipeline).exec();
    const total = results.reduce((sum, item) => sum + item.count, 0);

    return results.map((item) => ({
      _id: item._id,
      count: item.count,
      percentage: Math.round((item.count / total) * 100 * 100) / 100, // Round to 2 decimals
    }));
  }

  async getLocationStats(query: StatsQuery = {}): Promise<LocationStats[]> {
    const matchStage: any = {};

    if (query.gender) {
      matchStage.gender = query.gender;
    }

    if (query.digitalInterest) {
      matchStage.digitalInterest = query.digitalInterest;
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: "$locationType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    return await RecordModel.aggregate(pipeline).exec();
  }

  async getInterestStats(query: StatsQuery = {}): Promise<InterestStats[]> {
    const matchStage: any = {};

    if (query.gender) {
      matchStage.gender = query.gender;
    }

    if (query.locationType) {
      matchStage.locationType = query.locationType;
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: "$digitalInterest",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    return await RecordModel.aggregate(pipeline).exec();
  }

  async getDashboardStats(query: StatsQuery = {}): Promise<DashboardStats> {
    const matchStage: any = {};

    if (query.gender) {
      matchStage.gender = query.gender;
    }

    if (query.locationType) {
      matchStage.locationType = query.locationType;
    }

    if (query.digitalInterest) {
      matchStage.digitalInterest = query.digitalInterest;
    }

    const [
      totalRecords,
      genderDistribution,
      locationDistribution,
      interestDistribution,
      avgAgeResult,
    ] = await Promise.all([
      RecordModel.countDocuments(matchStage).exec(),
      this.getGenderStats(query),
      this.getLocationStats(query),
      this.getInterestStats(query),
      RecordModel.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: null,
            avgAge: { $avg: "$age" },
          },
        },
      ]).exec(),
    ]);

    return {
      totalRecords,
      genderDistribution,
      locationDistribution,
      interestDistribution,
      avgAge: avgAgeResult[0]?.avgAge || 0,
    };
  }
}
