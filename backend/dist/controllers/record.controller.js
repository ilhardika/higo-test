"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getInterestStats = exports.getLocationStats = exports.getGenderStats = exports.listRecords = void 0;
const record_service_1 = require("../services/record.service");
const pagination_1 = require("../utils/pagination");
const response_1 = require("../utils/response");
const recordService = new record_service_1.RecordService();
/**
 * @swagger
 * /api/v1/records:
 *   get:
 *     summary: Get paginated list of records
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 25
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female]
 *       - in: query
 *         name: locationType
 *         schema:
 *           type: string
 *       - in: query
 *         name: digitalInterest
 *         schema:
 *           type: string
 *       - in: query
 *         name: brandDevice
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, name, age, createdAt]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid query parameters
 */
exports.listRecords = (0, response_1.asyncHandler)(async (req, res) => {
    const query = pagination_1.ListRecordsQuerySchema.parse(req.query);
    const result = await recordService.listRecords(query);
    res.json((0, response_1.createResponse)(result, "Records retrieved successfully"));
});
/**
 * @swagger
 * /api/v1/stats/gender:
 *   get:
 *     summary: Get gender distribution statistics
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: locationType
 *         schema:
 *           type: string
 *       - in: query
 *         name: digitalInterest
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successful response
 */
exports.getGenderStats = (0, response_1.asyncHandler)(async (req, res) => {
    const query = pagination_1.StatsQuerySchema.parse(req.query);
    const stats = await recordService.getGenderStats(query);
    res.json((0, response_1.createResponse)(stats, "Gender statistics retrieved successfully"));
});
/**
 * @swagger
 * /api/v1/stats/location:
 *   get:
 *     summary: Get location distribution statistics
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female]
 *       - in: query
 *         name: digitalInterest
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
exports.getLocationStats = (0, response_1.asyncHandler)(async (req, res) => {
    const query = pagination_1.StatsQuerySchema.parse(req.query);
    const stats = await recordService.getLocationStats(query);
    res.json((0, response_1.createResponse)(stats, "Location statistics retrieved successfully"));
});
/**
 * @swagger
 * /api/v1/stats/interest:
 *   get:
 *     summary: Get digital interest distribution statistics
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female]
 *       - in: query
 *         name: locationType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
exports.getInterestStats = (0, response_1.asyncHandler)(async (req, res) => {
    const query = pagination_1.StatsQuerySchema.parse(req.query);
    const stats = await recordService.getInterestStats(query);
    res.json((0, response_1.createResponse)(stats, "Interest statistics retrieved successfully"));
});
/**
 * @swagger
 * /api/v1/stats/dashboard:
 *   get:
 *     summary: Get comprehensive dashboard statistics
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female]
 *       - in: query
 *         name: locationType
 *         schema:
 *           type: string
 *       - in: query
 *         name: digitalInterest
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
exports.getDashboardStats = (0, response_1.asyncHandler)(async (req, res) => {
    const query = pagination_1.StatsQuerySchema.parse(req.query);
    const stats = await recordService.getDashboardStats(query);
    res.json((0, response_1.createResponse)(stats, "Dashboard statistics retrieved successfully"));
});
//# sourceMappingURL=record.controller.js.map