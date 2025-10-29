import express from "express";
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
  changePassword
} from "../controllers/passwordController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.get("/verify/:token", verifyResetToken);

// Rutas protegidas (requieren autenticación)
router.post("/change", authMiddleware, changePassword);

export default router;
