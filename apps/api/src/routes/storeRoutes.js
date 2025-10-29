import express from "express";
import {
  getStoreInfo,
  updateStoreInfo,
  generateCatalogUrl
} from "../controllers/storeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de store
router.get("/me", getStoreInfo);
router.put("/me", updateStoreInfo);
router.get("/catalog-url", generateCatalogUrl);

export default router;
