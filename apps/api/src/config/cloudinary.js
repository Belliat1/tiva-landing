import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "dbkpipizy",
  api_key: "376188943244162",
  api_secret: "lNcpMUKZllgbpuM7ZUZz82cxqWo",
  secure: true
});

// Función para verificar la conexión
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary conectado exitosamente:", result);
    return true;
  } catch (error) {
    console.error("❌ Error conectando con Cloudinary:", error);
    return false;
  }
};

// Función para subir imagen desde buffer
export const uploadImageFromBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "tiva_uploads",
        transformation: [
          { width: 800, crop: "limit", quality: "auto" },
          { format: "auto" }
        ],
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    uploadStream.end(buffer);
  });
};

// Función para eliminar imagen
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error eliminando imagen: ${error.message}`);
  }
};

// Función para obtener información de la imagen
export const getImageInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error obteniendo información de imagen: ${error.message}`);
  }
};

export default cloudinary;
