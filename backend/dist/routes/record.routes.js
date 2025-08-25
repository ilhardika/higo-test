"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordRoutes = void 0;
const express_1 = require("express");
const record_controller_1 = require("../controllers/record.controller");
const router = (0, express_1.Router)();
exports.recordRoutes = router;
// Record routes
router.get("/records", record_controller_1.listRecords);
// Statistics routes
router.get("/stats/gender", record_controller_1.getGenderStats);
router.get("/stats/location", record_controller_1.getLocationStats);
router.get("/stats/interest", record_controller_1.getInterestStats);
router.get("/stats/dashboard", record_controller_1.getDashboardStats);
//# sourceMappingURL=record.routes.js.map