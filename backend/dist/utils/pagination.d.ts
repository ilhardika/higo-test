import { z } from "zod";
export interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
    offset: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare function getPagination(query: any): PaginationResult;
export declare function createPaginatedResponse<T>(data: T[], total: number, pagination: PaginationResult): PaginatedResponse<T>;
export declare const ListRecordsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    gender: z.ZodOptional<z.ZodEnum<["Male", "Female"]>>;
    locationType: z.ZodOptional<z.ZodString>;
    digitalInterest: z.ZodOptional<z.ZodString>;
    brandDevice: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["date", "name", "age", "createdAt"]>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sortBy: "date" | "name" | "age" | "createdAt";
    sortOrder: "asc" | "desc";
    gender?: "Male" | "Female" | undefined;
    brandDevice?: string | undefined;
    digitalInterest?: string | undefined;
    locationType?: string | undefined;
    search?: string | undefined;
}, {
    gender?: "Male" | "Female" | undefined;
    brandDevice?: string | undefined;
    digitalInterest?: string | undefined;
    locationType?: string | undefined;
    search?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    sortBy?: "date" | "name" | "age" | "createdAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type ListRecordsQuery = z.infer<typeof ListRecordsQuerySchema>;
export declare const StatsQuerySchema: z.ZodObject<{
    gender: z.ZodOptional<z.ZodEnum<["Male", "Female"]>>;
    locationType: z.ZodOptional<z.ZodString>;
    digitalInterest: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    gender?: "Male" | "Female" | undefined;
    digitalInterest?: string | undefined;
    locationType?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    gender?: "Male" | "Female" | undefined;
    digitalInterest?: string | undefined;
    locationType?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}>;
export type StatsQuery = z.infer<typeof StatsQuerySchema>;
//# sourceMappingURL=pagination.d.ts.map