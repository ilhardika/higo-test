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

export function getPagination(query: any): PaginationResult {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 25, 1), 100);
  const skip = (page - 1) * limit;
  const offset = skip;

  return { page, limit, skip, offset };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationResult
): PaginatedResponse<T> {
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
export const ListRecordsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
  gender: z.enum(["Male", "Female"]).optional(),
  locationType: z.string().optional(),
  digitalInterest: z.string().optional(),
  brandDevice: z.string().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["date", "name", "age", "createdAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type ListRecordsQuery = z.infer<typeof ListRecordsQuerySchema>;

export const StatsQuerySchema = z.object({
  gender: z.enum(["Male", "Female"]).optional(),
  locationType: z.string().optional(),
  digitalInterest: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export type StatsQuery = z.infer<typeof StatsQuerySchema>;
