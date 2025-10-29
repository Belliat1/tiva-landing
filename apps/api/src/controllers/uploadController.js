import { uploadImageFromBuffer, deleteImage as deleteCloudinaryImage, getImageInfo as getCloudinaryImageInfo } from "../config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

// Subida de imagen única
export const uploadImage = async (req, res) => {
  try {
    // Verificar que se recibió un archivo
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No se recibió ningún archivo." 
      });
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: "Formato de imagen no permitido. Solo se permiten JPG, PNG y WebP." 
      });
    }

    // Validar tamaño del archivo (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        success: false, 
        message: "El archivo es demasiado grande. Máximo 5MB." 
      });
    }

    // Opciones de subida personalizadas
    const uploadOptions = {
      folder: `tiva_uploads/${req.storeId || 'general'}`,
      public_id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      transformation: [
        { width: 800, crop: "limit", quality: "auto" },
        { format: "auto" }
      ]
    };

    // Subir imagen a Cloudinary
    const result = await uploadImageFromBuffer(req.file.buffer, uploadOptions);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at
      },
      message: "Imagen subida exitosamente"
    });

  } catch (error) {
    console.error("Error en uploadImage:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor al subir la imagen." 
    });
  }
};

// Subida múltiple de imágenes
export const uploadMultipleImages = async (req, res) => {
  try {
    // Verificar que se recibieron archivos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No se recibieron archivos." 
      });
    }

    // Validar cantidad de archivos (máximo 10)
    if (req.files.length > 10) {
      return res.status(400).json({ 
        success: false, 
        message: "Máximo 10 imágenes por subida." 
      });
    }

    const results = [];
    const errors = [];

    // Procesar cada archivo
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      try {
        // Validar tipo de archivo
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
          errors.push({
            file: file.originalname,
            error: "Formato no permitido"
          });
          continue;
        }

        // Validar tamaño
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          errors.push({
            file: file.originalname,
            error: "Archivo demasiado grande"
          });
          continue;
        }

        // Subir imagen
        const uploadOptions = {
          folder: `tiva_uploads/${req.storeId || 'general'}`,
          public_id: `${Date.now()}_${i}_${Math.random().toString(36).substring(2, 15)}`,
          transformation: [
            { width: 800, crop: "limit", quality: "auto" },
            { format: "auto" }
          ]
        };

        const result = await uploadImageFromBuffer(file.buffer, uploadOptions);
        
        results.push({
          originalname: file.originalname,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height
        });

      } catch (error) {
        console.error(`Error procesando archivo ${file.originalname}:`, error);
        errors.push({
          file: file.originalname,
          error: "Error al procesar archivo"
        });
      }
    }

    // Respuesta
    res.status(200).json({
      success: true,
      data: {
        uploaded: results,
        errors: errors,
        total_uploaded: results.length,
        total_errors: errors.length
      },
      message: `${results.length} imagen(es) subida(s) exitosamente`
    });

  } catch (error) {
    console.error("Error en uploadMultipleImages:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor al subir las imágenes." 
    });
  }
};

// Eliminar imagen
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ 
        success: false, 
        message: "ID público de la imagen requerido." 
      });
    }

    // Eliminar imagen de Cloudinary
    const result = await deleteCloudinaryImage(publicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: "Imagen eliminada exitosamente",
        data: result
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Imagen no encontrada o ya eliminada"
      });
    }

  } catch (error) {
    console.error("Error en deleteImage:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor al eliminar la imagen." 
    });
  }
};

// Obtener información de imagen
export const getImageInfo = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ 
        success: false, 
        message: "ID público de la imagen requerido." 
      });
    }

    // Obtener información de Cloudinary
    const result = await getCloudinaryImageInfo(publicId);

    res.status(200).json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
        tags: result.tags || []
      }
    });

  } catch (error) {
    console.error("Error en getImageInfo:", error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: "Imagen no encontrada"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor al obtener información de la imagen." 
    });
  }
};

// Listar imágenes del usuario/tienda
export const listImages = async (req, res) => {
  try {
    const { folder = `tiva_uploads/${req.storeId || 'general'}` } = req.query;
    const { max_results = 50 } = req.query;

    // Listar recursos de Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: parseInt(max_results),
      resource_type: 'image'
    });

    const images = result.resources.map(resource => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      bytes: resource.bytes,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
      folder: resource.folder
    }));

    res.status(200).json({
      success: true,
      data: {
        images,
        total: result.total_count,
        next_cursor: result.next_cursor
      }
    });

  } catch (error) {
    console.error("Error en listImages:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor al listar imágenes." 
    });
  }
};
