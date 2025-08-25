import { Request, Response, NextFunction } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createResponse = <T>(
  data?: T,
  message?: string,
  success: boolean = true
): ApiResponse<T> => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (
  error: string,
  message?: string
): ApiResponse => ({
  success: false,
  error,
  message,
  timestamp: new Date().toISOString(),
});

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    error = new AppError(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json(
      createErrorResponse(
        error.message || "Server Error",
        "An error occurred processing your request"
      )
    );
};
