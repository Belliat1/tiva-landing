import Store from "../models/Store.js";
import User from "../models/User.js";

// Obtener información de la tienda del usuario autenticado
export const getStoreInfo = async (req, res) => {
  try {
    const storeId = req.storeId;
    const userId = req.userId;

    if (!storeId) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró una tienda asociada a este usuario'
      });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: store._id,
        name: store.name,
        description: store.description,
        logo: store.logo,
        whatsappNumber: store.whatsappNumber,
        smsNumber: store.smsNumber,
        currency: store.currency,
        language: store.language,
        settings: store.settings,
        catalogUrl: store.catalogUrl,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt
      }
    });

  } catch (error) {
    console.error('Error en getStoreInfo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar información de la tienda
export const updateStoreInfo = async (req, res) => {
  try {
    const storeId = req.storeId;
    const updateData = req.body;

    // Campos permitidos para actualizar
    const allowedFields = [
      'name', 'description', 'logo', 'whatsappNumber', 
      'smsNumber', 'currency', 'language', 'settings'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    const store = await Store.findByIdAndUpdate(
      storeId,
      { ...filteredData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tienda actualizada exitosamente',
      data: {
        _id: store._id,
        name: store.name,
        description: store.description,
        logo: store.logo,
        whatsappNumber: store.whatsappNumber,
        smsNumber: store.smsNumber,
        currency: store.currency,
        language: store.language,
        settings: store.settings,
        catalogUrl: store.catalogUrl,
        updatedAt: store.updatedAt
      }
    });

  } catch (error) {
    console.error('Error en updateStoreInfo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Generar URL del catálogo público
export const generateCatalogUrl = async (req, res) => {
  try {
    const storeId = req.storeId;
    
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada'
      });
    }

    // Generar URL única si no existe
    if (!store.catalogUrl) {
      const uniqueId = Math.random().toString(36).substring(2, 15);
      store.catalogUrl = `/catalog/${uniqueId}`;
      await store.save();
    }

    res.status(200).json({
      success: true,
      data: {
        catalogUrl: `${process.env.FRONTEND_URL || 'http://localhost:5175'}${store.catalogUrl}`,
        storeName: store.name
      }
    });

  } catch (error) {
    console.error('Error en generateCatalogUrl:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
