import express from "express";
import { register, login, getMe, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

export default router;
