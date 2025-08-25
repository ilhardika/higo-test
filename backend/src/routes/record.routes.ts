import { Router } from "express";
import {
  listRecords,
  getGenderStats,
  getLocationStats,
  getInterestStats,
  getDashboardStats,
} from "../controllers/record.controller";

const router = Router();

// Record routes
router.get("/records", listRecords);

// Statistics routes
router.get("/stats/gender", getGenderStats);
router.get("/stats/location", getLocationStats);
router.get("/stats/interest", getInterestStats);
router.get("/stats/dashboard", getDashboardStats);

export { router as recordRoutes };
