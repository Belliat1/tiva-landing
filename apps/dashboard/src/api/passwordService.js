import api from './axios'

export const passwordService = {
  // Solicitar reset de contraseña
  forgotPassword: async (email) => {
    const response = await api.post('/password/forgot', { email })
    return response.data
  },

  // Resetear contraseña con token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/password/reset', { token, newPassword })
    return response.data
  },

  // Verificar si un token es válido
  verifyResetToken: async (token) => {
    const response = await api.get(`/password/verify/${token}`)
    return response.data
  },

  // Cambiar contraseña (usuario autenticado)
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/password/change', { currentPassword, newPassword })
    return response.data
  }
}
