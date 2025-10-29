import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  archiveProduct,
  deleteProduct
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de productos
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.patch("/:id/archive", archiveProduct);
router.delete("/:id", deleteProduct);

export default router;
