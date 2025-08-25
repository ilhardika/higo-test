import { IRecord } from "../models/Record.model";
import { ListRecordsQuery, StatsQuery, PaginatedResponse } from "../utils/pagination";
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
export declare class RecordService {
    listRecords(query: ListRecordsQuery): Promise<PaginatedResponse<IRecord>>;
    getGenderStats(query?: StatsQuery): Promise<GenderStats[]>;
    getLocationStats(query?: StatsQuery): Promise<LocationStats[]>;
    getInterestStats(query?: StatsQuery): Promise<InterestStats[]>;
    getDashboardStats(query?: StatsQuery): Promise<DashboardStats>;
}
//# sourceMappingURL=record.service.d.ts.map