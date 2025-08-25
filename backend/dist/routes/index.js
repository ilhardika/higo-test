"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const record_routes_1 = require("./record.routes");
const router = (0, express_1.Router)();
exports.apiRoutes = router;
// Health check
router.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});
// API routes
router.use("/v1", record_routes_1.recordRoutes);
//# sourceMappingURL=index.js.map