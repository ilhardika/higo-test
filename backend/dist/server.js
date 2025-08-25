"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./utils/database");
const swagger_1 = require("./utils/swagger");
const routes_1 = require("./routes");
const middleware_1 = require("./middleware");
const response_1 = require("./utils/response");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
// CORS configuration
const corsOptions = {
    origin: (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(","),
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
// Rate limiting
app.use(middleware_1.rateLimiter);
// Request parsing
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Custom middleware
app.use(middleware_1.requestLogger);
app.use(middleware_1.corsHeaders);
// Swagger documentation
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Higo API Documentation",
}));
// API routes
app.use("/api", routes_1.apiRoutes);
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
app.use(middleware_1.notFound);
app.use(response_1.globalErrorHandler);
// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, database_1.connectDB)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 Documentation available at http://localhost:${PORT}/docs`);
            console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err.message);
    process.exit(1);
});
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});
startServer();
//# sourceMappingURL=server.js.map