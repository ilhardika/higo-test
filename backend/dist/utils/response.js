"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.asyncHandler = exports.createErrorResponse = exports.createResponse = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const createResponse = (data, message, success = true) => ({
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
});
exports.createResponse = createResponse;
const createErrorResponse = (error, message) => ({
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
});
exports.createErrorResponse = createErrorResponse;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
const globalErrorHandler = (err, req, res, next) => {
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
            .map((val) => val.message)
            .join(", ");
        error = new AppError(message, 400);
    }
    res
        .status(error.statusCode || 500)
        .json((0, exports.createErrorResponse)(error.message || "Server Error", "An error occurred processing your request"));
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=response.js.map