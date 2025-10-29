import api from './axios'

// Servicios para pedidos
export const orderService = {
  // Obtener todos los pedidos
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  // Obtener un pedido por ID
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Crear nuevo pedido
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  // Actualizar estado del pedido
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },

  // Obtener estadísticas de pedidos
  getOrderStats: async (params = {}) => {
    const response = await api.get('/orders/stats', { params })
    return response.data
  }
}
