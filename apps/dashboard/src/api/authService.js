import api from './axios'

// Servicios de autenticación
export const authService = {
  // Registrar nuevo usuario y tienda
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Cerrar sesión
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Refrescar token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    return response.data
  }
}
