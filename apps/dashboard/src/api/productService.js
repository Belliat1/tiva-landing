import api from './axios'

// Servicios para productos
export const productService = {
  // Obtener todos los productos
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  // Obtener un producto por ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Crear nuevo producto
  createProduct: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },

  // Actualizar producto
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData)
    return response.data
  },

  // Eliminar producto (marcar como archivado)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  // Buscar productos
  searchProducts: async (query) => {
    const response = await api.get('/products', { 
      params: { q: query, limit: 50 } 
    })
    return response.data
  }
}
