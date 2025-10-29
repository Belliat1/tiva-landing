import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware de autenticación
export const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido"
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeytiva');
    
    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Agregar información del usuario al request
    req.user = user;
    req.storeId = user.storeId;
    
    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token inválido"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expirado"
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// Middleware opcional de autenticación (no falla si no hay token)
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeytiva');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        req.user = user;
        req.storeId = user.storeId;
      }
    }
    
    next();
  } catch (error) {
    // En caso de error, continuar sin autenticación
    next();
  }
};
