import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

import { connectDB } from "./utils/database";
import { swaggerSpec } from "./utils/swagger";
import { apiRoutes } from "./routes";
import {
  rateLimiter,
  requestLogger,
  corsHeaders,
  notFound,
} from "./middleware";
import { globalErrorHandler } from "./utils/response";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const corsOptions = {
  origin: (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(","),
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
app.use(rateLimiter);

// Request parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Custom middleware
app.use(requestLogger);
app.use(corsHeaders);

// Swagger documentation
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Higo API Documentation",
  })
);

// API routes
app.use("/api", apiRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "Higo Customer Analytics API",
    version: "1.0.0",
    description: "REST API for customer analytics dashboard",
    documentation: "/docs",
    health: "/api/health",
    endpoints: {
      records: "/api/v1/records",
      stats: {
        gender: "/api/v1/stats/gender",
        location: "/api/v1/stats/location",
        interest: "/api/v1/stats/interest",
        dashboard: "/api/v1/stats/dashboard",
      },
    },
  });
});

// Error handling
app.use(notFound);
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📚 Documentation available at http://localhost:${PORT}/docs`
      );
      console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

startServer();
