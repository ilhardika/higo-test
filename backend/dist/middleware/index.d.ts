import { Request, Response, NextFunction } from "express";
export declare const rateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const corsHeaders: (req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=index.d.ts.map