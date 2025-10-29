import express from "express";
import {
  getOverviewAnalytics,
  getTopProductsAnalytics,
  getOrdersByDayAnalytics,
  getChannelStatsAnalytics
} from "../controllers/analyticsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de analytics
router.get("/overview", getOverviewAnalytics);
router.get("/top-products", getTopProductsAnalytics);
router.get("/orders-by-day", getOrdersByDayAnalytics);
router.get("/channel-stats", getChannelStatsAnalytics);

export default router;
