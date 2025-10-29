import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { passwordService } from '../api/passwordService'
import { Store, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenValid, setTokenValid] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  // Verificar token al cargar
  useEffect(() => {
    if (token) {
      verifyToken()
    }
  }, [token])

  const verifyTokenMutation = useMutation({
    mutationFn: (token) => passwordService.verifyResetToken(token),
    onSuccess: (response) => {
      if (response.success) {
        setTokenValid(true)
        setUserInfo(response.data)
      } else {
        setTokenValid(false)
      }
    },
    onError: () => {
      setTokenValid(false)
    }
  })

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, newPassword }) => passwordService.resetPassword(token, newPassword),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Contraseña restablecida exitosamente')
        navigate('/login')
      }
    },
    onError: (error) => {
      console.error('Error:', error)
      toast.error('Error al restablecer la contraseña. Intenta de nuevo.')
    }
  })

  const verifyToken = () => {
    verifyTokenMutation.mutate(token)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    resetPasswordMutation.mutate({
      token,
      newPassword: formData.password
    })
  }

  // Token inválido o expirado
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Enlace Inválido
            </h2>
            <p className="text-gray-600 mb-6">
              Este enlace de recuperación no es válido o ha expirado.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Posibles causas:</strong>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>El enlace ya fue usado</li>
                  <li>El enlace expiró (válido por 1 hora)</li>
                  <li>El enlace es incorrecto</li>
                </ul>
              </p>
            </div>
            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="w-full flex justify-center items-center px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
              >
                Solicitar Nuevo Enlace
              </Link>
              <Link
                to="/login"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cargando verificación del token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    )
  }

  // Token válido, mostrar formulario
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
            <Store className="h-6 w-6 text-lime-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Restablecer Contraseña
          </h2>
          <p className="text-gray-600 mb-2">
            Hola <strong>{userInfo?.name}</strong>
          </p>
          <p className="text-gray-600 mb-8">
            Ingresa tu nueva contraseña para completar el proceso.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Repite la contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full bg-lime-500 text-white py-3 px-4 rounded-lg hover:bg-lime-600 focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resetPasswordMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Restableciendo...
              </div>
            ) : (
              'Restablecer Contraseña'
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Volver al Login
            </Link>
          </div>
        </form>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Consejo:</strong> Usa una contraseña segura con al menos 6 caracteres.
          </p>
        </div>
      </div>
    </div>
  )
}
