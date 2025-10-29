import api from './axios'

export const storeService = {
  // Obtener información de la tienda
  getStoreInfo: async () => {
    const response = await api.get('/store/me')
    return response.data
  },

  // Actualizar información de la tienda
  updateStoreInfo: async (storeData) => {
    const response = await api.put('/store/me', storeData)
    return response.data
  },

  // Generar URL del catálogo
  generateCatalogUrl: async () => {
    const response = await api.get('/store/catalog-url')
    return response.data
  }
}