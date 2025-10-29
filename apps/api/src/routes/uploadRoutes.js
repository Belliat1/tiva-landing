import express from "express";
import multer from "multer";
import { 
  uploadImage, 
  uploadMultipleImages, 
  deleteImage as deleteImageController, 
  getImageInfo,
  listImages 
} from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configuración de Multer para memoria temporal
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB máximo por archivo
    files: 10 // Máximo 10 archivos por request
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo permitidos
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato de archivo no permitido. Solo se permiten JPG, PNG y WebP."), false);
    }
  }
});

// Middleware para manejar errores de Multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: "El archivo es demasiado grande. Máximo 5MB."
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: "Demasiados archivos. Máximo 10 archivos por subida."
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: "Campo de archivo inesperado."
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// POST /api/uploads - Subir una imagen
router.post("/", upload.single("image"), handleMulterError, uploadImage);

// POST /api/uploads/multiple - Subir múltiples imágenes
router.post("/multiple", upload.array("images", 10), handleMulterError, uploadMultipleImages);

// GET /api/uploads - Listar imágenes del usuario/tienda
router.get("/", listImages);

// GET /api/uploads/:publicId - Obtener información de una imagen
router.get("/:publicId", getImageInfo);

// DELETE /api/uploads/:publicId - Eliminar una imagen
router.delete("/:publicId", deleteImageController);

export default router;
