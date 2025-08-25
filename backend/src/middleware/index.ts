import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later.",
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Request logger middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

// CORS headers middleware (backup for cors package)
export const corsHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || "http://localhost:3000"
  ).split(",");
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
};

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
