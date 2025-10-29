import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../api/authService'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      store: null,
      token: null,
      isAuthenticated: false,
      isLoading: false, // Iniciar como false, se activará solo cuando sea necesario

      // Acciones
      login: async (credentials) => {
        set({ isLoading: true })
        
        // Timeout de seguridad para evitar loading infinito
        const timeoutId = setTimeout(() => {
          set({ isLoading: false })
          toast.error('Tiempo de espera agotado. Intenta de nuevo.')
        }, 10000) // 10 segundos
        
        try {
          const response = await authService.login(credentials)
          clearTimeout(timeoutId)
          
          const { user, store, token } = response.data
          
          set({
            user,
            store,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Guardar en localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('storeId', store._id)
          localStorage.setItem('user', JSON.stringify(user))
          
          toast.success('¡Bienvenido a Tiva Store!')
          return { success: true }
        } catch (error) {
          clearTimeout(timeoutId)
          set({ isLoading: false })
          console.error('Login error:', error)
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        
        // Timeout de seguridad para evitar loading infinito
        const timeoutId = setTimeout(() => {
          set({ isLoading: false })
          toast.error('Tiempo de espera agotado. Intenta de nuevo.')
        }, 10000) // 10 segundos
        
        try {
          const response = await authService.register(userData)
          clearTimeout(timeoutId)
          
          const { user, store, token } = response.data
          
          set({
            user,
            store,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Guardar en localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('storeId', store._id)
          localStorage.setItem('user', JSON.stringify(user))
          
          toast.success('¡Cuenta creada exitosamente!')
          return { success: true }
        } catch (error) {
          clearTimeout(timeoutId)
          set({ isLoading: false })
          console.error('Register error:', error)
          throw error
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          console.error('Error al cerrar sesión:', error)
        } finally {
          // Limpiar estado
          set({
            user: null,
            store: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          
          // Limpiar localStorage
          localStorage.removeItem('token')
          localStorage.removeItem('storeId')
          localStorage.removeItem('user')
          
          toast.success('Sesión cerrada')
        }
      },

      checkAuth: async () => {
        const { isLoading } = get()
        
        // Evitar múltiples requests simultáneos
        if (isLoading) {
          console.log('Auth check already in progress, skipping...')
          return
        }

        const token = localStorage.getItem('token')
        if (!token) {
          set({ isAuthenticated: false, isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          console.log('Checking auth...')
          const response = await authService.getProfile()
          const { user, store } = response.data
          
          set({
            user,
            store,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          console.log('Auth check successful')
        } catch (error) {
          console.log('Auth check failed:', error.message)
          // Token inválido
          set({
            user: null,
            store: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          
          localStorage.removeItem('token')
          localStorage.removeItem('storeId')
          localStorage.removeItem('user')
        }
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },

      updateStore: (storeData) => {
        set({ store: { ...get().store, ...storeData } })
      },

      // Inicialización automática
      initialize: () => {
        const { checkAuth, isLoading, token } = get()
        
        // Solo verificar si hay token y no está cargando
        if (token && !isLoading) {
          console.log('Initializing auth store with token...')
          checkAuth()
        } else {
          console.log('No token or already loading, skipping initialization')
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        store: state.store,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        // Solo verificar autenticación si hay token y no está cargando
        if (state && state.token && !state.isAuthenticated) {
          console.log('Rehydrating with token, checking auth...')
          state.checkAuth()
        } else {
          console.log('No token found, setting loading to false')
          state?.set({ isLoading: false })
        }
      }
    }
  )
)
