"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsQuerySchema = exports.ListRecordsQuerySchema = void 0;
exports.getPagination = getPagination;
exports.createPaginatedResponse = createPaginatedResponse;
const zod_1 = require("zod");
function getPagination(query) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit) || 25, 1), 100);
    const skip = (page - 1) * limit;
    const offset = skip;
    return { page, limit, skip, offset };
}
function createPaginatedResponse(data, total, pagination) {
    const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
    return {
        data,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPages,
            hasNext: pagination.page < totalPages,
            hasPrev: pagination.page > 1,
        },
    };
}
// Validation schemas
exports.ListRecordsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(25),
    gender: zod_1.z.enum(["Male", "Female"]).optional(),
    locationType: zod_1.z.string().optional(),
    digitalInterest: zod_1.z.string().optional(),
    brandDevice: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum(["date", "name", "age", "createdAt"])
        .optional()
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
});
exports.StatsQuerySchema = zod_1.z.object({
    gender: zod_1.z.enum(["Male", "Female"]).optional(),
    locationType: zod_1.z.string().optional(),
    digitalInterest: zod_1.z.string().optional(),
    dateFrom: zod_1.z.coerce.date().optional(),
    dateTo: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=pagination.js.map