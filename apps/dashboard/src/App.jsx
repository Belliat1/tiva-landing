import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from './auth/useAuthStore'
import { Login } from './auth/Login'
import { Register } from './auth/Register'
import { ForgotPassword } from './auth/ForgotPassword'
import { ResetPassword } from './auth/ResetPassword'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Products } from './pages/Products'
import { Orders } from './pages/Orders'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { PublicCatalog } from './pages/PublicCatalog'

function App() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const [showLoading, setShowLoading] = useState(true)

  // Timeout para evitar loading infinito
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 3000) // 3 segundos máximo

    return () => clearTimeout(timer)
  }, [])

  // Si no está cargando o ya pasó el timeout, no mostrar loading
  if (!isLoading || !showLoading) {
    return (
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
        />
        <Route 
          path="/reset-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword />} 
        />
        
        {/* Catálogo público */}
        <Route 
          path="/catalog/:catalogId" 
          element={<PublicCatalog />} 
        />
        
        {/* Rutas protegidas */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/products" 
          element={isAuthenticated ? <Layout><Products /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/orders" 
          element={isAuthenticated ? <Layout><Orders /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/analytics" 
          element={isAuthenticated ? <Layout><Analytics /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Layout><Settings /></Layout> : <Navigate to="/login" replace />} 
        />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    )
  }

  // Mostrar loading solo si está cargando y no ha pasado el timeout
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  )
}

export default App
