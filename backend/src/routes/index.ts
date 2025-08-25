import { Router } from "express";
import { recordRoutes } from "./record.routes";

const router = Router();

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
router.use("/v1", recordRoutes);

export { router as apiRoutes };
