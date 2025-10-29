import express from "express";
import {
  getStoreByCatalogUrl,
  getStoreProducts,
  createPublicOrder
} from "../controllers/publicController.js";

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get("/catalog/:catalogId", getStoreByCatalogUrl);
router.get("/catalog/:catalogId/products", getStoreProducts);
router.post("/catalog/:catalogId/order", createPublicOrder);

export default router;
