import api from "./axios";

// Servicio para subir imágenes
export const uploadService = {
  // Subir una imagen
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const { data } = await api.post("/uploads", formData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        },
      });
      
      return data.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Error al subir la imagen");
    }
  },

  // Subir múltiples imágenes
  uploadMultipleImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("images", file);
      });
      
      const { data } = await api.post("/uploads/multiple", formData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        },
      });
      
      return data.data.uploaded.map(img => img.secure_url);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Error al subir las imágenes");
    }
  },

  // Eliminar imagen
  deleteImage: async (publicId) => {
    try {
      const { data } = await api.delete(`/uploads/${publicId}`);
      return data;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error("Error al eliminar la imagen");
    }
  },

  // Obtener información de imagen
  getImageInfo: async (publicId) => {
    try {
      const { data } = await api.get(`/uploads/${publicId}`);
      return data;
    } catch (error) {
      console.error("Error getting image info:", error);
      throw new Error("Error al obtener información de la imagen");
    }
  },

  // Listar imágenes
  listImages: async (params = {}) => {
    try {
      const { data } = await api.get("/uploads", { params });
      return data;
    } catch (error) {
      console.error("Error listing images:", error);
      throw new Error("Error al listar las imágenes");
    }
  }
};

// Función de conveniencia para subir una imagen
export const uploadImage = async (file) => {
  return await uploadService.uploadImage(file);
};

// Función de conveniencia para subir múltiples imágenes
export const uploadMultipleImages = async (files) => {
  return await uploadService.uploadMultipleImages(files);
};
