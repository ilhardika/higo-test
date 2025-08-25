"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordService = void 0;
const Record_model_1 = require("../models/Record.model");
const pagination_1 = require("../utils/pagination");
class RecordService {
    async listRecords(query) {
        const pagination = (0, pagination_1.getPagination)(query);
        // Build filter
        const filter = {};
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
        const sort = {};
        sort[query.sortBy] = query.sortOrder === "asc" ? 1 : -1;
        // Execute queries in parallel
        const [records, total] = await Promise.all([
            Record_model_1.RecordModel.find(filter)
                .sort(sort)
                .skip(pagination.skip)
                .limit(pagination.limit)
                .lean()
                .exec(),
            Record_model_1.RecordModel.countDocuments(filter).exec(),
        ]);
        return (0, pagination_1.createPaginatedResponse)(records, total, pagination);
    }
    async getGenderStats(query = {}) {
        const matchStage = {};
        if (query.locationType) {
            matchStage.locationType = query.locationType;
        }
        if (query.digitalInterest) {
            matchStage.digitalInterest = query.digitalInterest;
        }
        if (query.dateFrom || query.dateTo) {
            matchStage.date = {};
            if (query.dateFrom)
                matchStage.date.$gte = query.dateFrom;
            if (query.dateTo)
                matchStage.date.$lte = query.dateTo;
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
        const results = await Record_model_1.RecordModel.aggregate(pipeline).exec();
        const total = results.reduce((sum, item) => sum + item.count, 0);
        return results.map((item) => ({
            _id: item._id,
            count: item.count,
            percentage: Math.round((item.count / total) * 100 * 100) / 100, // Round to 2 decimals
        }));
    }
    async getLocationStats(query = {}) {
        const matchStage = {};
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
        return await Record_model_1.RecordModel.aggregate(pipeline).exec();
    }
    async getInterestStats(query = {}) {
        const matchStage = {};
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
        return await Record_model_1.RecordModel.aggregate(pipeline).exec();
    }
    async getDashboardStats(query = {}) {
        const matchStage = {};
        if (query.gender) {
            matchStage.gender = query.gender;
        }
        if (query.locationType) {
            matchStage.locationType = query.locationType;
        }
        if (query.digitalInterest) {
            matchStage.digitalInterest = query.digitalInterest;
        }
        const [totalRecords, genderDistribution, locationDistribution, interestDistribution, avgAgeResult, topLocationsByName, uniqueDeviceCount,] = await Promise.all([
            Record_model_1.RecordModel.countDocuments(matchStage).exec(),
            this.getGenderStats(query),
            this.getLocationStats(query),
            this.getInterestStats(query),
            Record_model_1.RecordModel.aggregate([
                ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
                {
                    $group: {
                        _id: null,
                        avgAge: { $avg: "$age" },
                    },
                },
            ]).exec(),
            // Top locations by name (not locationType)
            Record_model_1.RecordModel.aggregate([
                ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
                {
                    $group: {
                        _id: "$locationName",
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { count: -1 },
                },
                { $limit: 6 },
            ]).exec(),
            // Unique device brands count
            Record_model_1.RecordModel.aggregate([
                ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
                {
                    $group: {
                        _id: "$brandDevice",
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]).exec(),
        ]);
        return {
            totalRecords,
            genderDistribution,
            locationDistribution,
            interestDistribution,
            avgAge: Math.round(avgAgeResult[0]?.avgAge || 0),
            topLocationsByName: topLocationsByName,
            uniqueDeviceCount: uniqueDeviceCount[0]?.count || 0,
        };
    }
}
exports.RecordService = RecordService;
//# sourceMappingURL=record.service.js.map