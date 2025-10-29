import axios from 'axios'
import toast from 'react-hot-toast'

// URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Exportar también como default para compatibilidad
// export default api (comentado para evitar duplicación)

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('token')
          localStorage.removeItem('storeId')
          localStorage.removeItem('user')
          window.location.href = '/login'
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
          break
        case 403:
          toast.error('No tienes permisos para realizar esta acción.')
          break
        case 404:
          toast.error('Recurso no encontrado.')
          break
        case 422:
          // Errores de validación
          const errors = response.data?.errors || response.data?.message
          if (Array.isArray(errors)) {
            errors.forEach(error => toast.error(error))
          } else {
            toast.error(errors || 'Error de validación.')
          }
          break
        case 500:
          toast.error('Error interno del servidor. Inténtalo más tarde.')
          break
        default:
          toast.error(response.data?.message || 'Error inesperado.')
      }
    } else if (error.request) {
      // Error de red
      toast.error('Error de conexión. Verifica tu internet.')
    } else {
      toast.error('Error inesperado.')
    }
    
    return Promise.reject(error)
  }
)

export default api
