import { Request, Response } from "express";
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
export declare const listRecords: (req: Request, res: Response, next: import("express").NextFunction) => void;
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
export declare const getGenderStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
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
export declare const getLocationStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
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
export declare const getInterestStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
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
export declare const getDashboardStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=record.controller.d.ts.map