import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";
import express from "express";
import { getAnalyticsData } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAnalyticsData);

export default router;
