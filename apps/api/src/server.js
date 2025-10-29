import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import config from '../config.js';
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import "express-async-errors";
import pino from "pino";

// Importar rutas
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";

// Importar configuración
import { testCloudinaryConnection } from "./config/cloudinary.js";

// Cargar variables de entorno
dotenv.config();

// Configurar logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname"
    }
  }
});

const app = express();
const PORT = config.PORT;

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configurar CORS
app.use(cors({
  origin: function (origin, callback) {
    console.log(`CORS Origin check: ${origin}`);
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174", 
      "http://localhost:5175",
      "http://localhost:3000"
    ];
    
    // Permitir requests sin origin (como Postman) en desarrollo
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`CORS Origin allowed: ${origin}`);
      callback(null, true);
    } else {
      console.log(`CORS Origin blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Request-Method", "Access-Control-Request-Headers"],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Rate limiting (DESHABILITADO para desarrollo)
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minuto
//   max: 1000, // máximo 1000 requests por IP por minuto
//   message: {
//     success: false,
//     message: "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde."
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// app.use(limiter); // COMENTADO PARA DESARROLLO

// Rate limiting específico para subida de imágenes (DESHABILITADO para desarrollo)
// const uploadLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minuto
//   max: 100, // máximo 100 subidas por minuto
//   message: {
//     success: false,
//     message: "Demasiadas subidas de imágenes. Intenta de nuevo más tarde."
//   }
// });

// Middleware de logging para debug CORS
app.use((req, res, next) => {
  console.log(`=== REQUEST ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Origin: ${req.headers.origin}`);
  console.log(`Access-Control-Request-Method: ${req.headers['access-control-request-method']}`);
  console.log(`Access-Control-Request-Headers: ${req.headers['access-control-request-headers']}`);
  next();
});

// Middleware para parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent")
  }, "Request recibida");
  next();
});

// Rutas de salud
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Tiva Store funcionando correctamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bienvenido a la API de Tiva Store",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      uploads: "/api/uploads"
    }
  });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/uploads", uploadRoutes); // Rate limiting deshabilitado

// Rutas públicas (sin autenticación)
app.use("/api/public", publicRoutes);

// Middleware de manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    path: req.originalUrl
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  logger.error({
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  }, "Error no manejado");

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
});

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
        const mongoURI = config.MONGO_URI;
    
    await mongoose.connect(mongoURI, {
      maxPoolSize: 20,                    // Máximo 20 conexiones simultáneas
      minPoolSize: 5,                     // Mínimo 5 conexiones siempre activas
      serverSelectionTimeoutMS: 5000,     // Timeout de 5 segundos
      heartbeatFrequencyMS: 10000,         // Heartbeat cada 10 segundos
      retryWrites: true,                  // Reintentar escrituras fallidas
      w: "majority",                      // Confirmación de mayoría
      maxIdleTimeMS: 30000,               // Cerrar conexiones inactivas después de 30 segundos
      connectTimeoutMS: 10000,            // Timeout de conexión de 10 segundos
      socketTimeoutMS: 45000              // Timeout de socket de 45 segundos
    });

    logger.info("✅ Conectado a MongoDB exitosamente");
  } catch (error) {
    logger.error({ error: error.message }, "❌ Error conectando a MongoDB");
    process.exit(1);
  }
};

// Función para inicializar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Probar conexión con Cloudinary
    await testCloudinaryConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info({
        port: PORT,
        environment: process.env.NODE_ENV || "development"
      }, "🚀 Servidor iniciado exitosamente");
      
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🚀 TIVA STORE API                        ║
╠══════════════════════════════════════════════════════════════╣
║  Puerto: ${PORT}                                                ║
║  Entorno: ${process.env.NODE_ENV || "development"}                              ║
║  Health: http://localhost:${PORT}/health                        ║
║  Uploads: http://localhost:${PORT}/api/uploads                  ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });
    
  } catch (error) {
    logger.error({ error: error.message }, "❌ Error iniciando servidor");
    process.exit(1);
  }
};

// Manejo de señales de terminación
process.on("SIGTERM", () => {
  logger.info("SIGTERM recibido, cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT recibido, cerrando servidor...");
  process.exit(0);
});

// Iniciar servidor
startServer();
