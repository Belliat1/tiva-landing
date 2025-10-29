import api from './axios'

// Servicios para analytics
export const analyticsService = {
  // Obtener resumen general
  getOverview: async (params = {}) => {
    const response = await api.get('/analytics/overview', { params })
    return response.data
  },

  // Obtener productos más vendidos
  getTopProducts: async (params = {}) => {
    const response = await api.get('/analytics/top-products', { params })
    return response.data
  },

  // Obtener pedidos por día
  getOrdersByDay: async (params = {}) => {
    const response = await api.get('/analytics/orders-by-day', { params })
    return response.data
  },

  // Obtener estadísticas de canales
  getChannelStats: async (params = {}) => {
    const response = await api.get('/analytics/channel-stats', { params })
    return response.data
  }
}
