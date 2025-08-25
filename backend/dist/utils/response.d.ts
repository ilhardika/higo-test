import { Request, Response, NextFunction } from "express";
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp: string;
}
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare const createResponse: <T>(data?: T, message?: string, success?: boolean) => ApiResponse<T>;
export declare const createErrorResponse: (error: string, message?: string) => ApiResponse;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
export declare const globalErrorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=response.d.ts.map