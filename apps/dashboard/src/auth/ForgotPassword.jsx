import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { passwordService } from '../api/passwordService'
import { Store, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const forgotPasswordMutation = useMutation({
    mutationFn: (email) => passwordService.forgotPassword(email),
    onSuccess: (response) => {
      if (response.success) {
        setEmailSent(true)
        toast.success('Si el email existe, recibirás un enlace para restablecer tu contraseña')
      }
    },
    onError: (error) => {
      console.error('Error:', error)
      toast.error('Error al enviar el email. Intenta de nuevo.')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Por favor ingresa tu email')
      return
    }

    forgotPasswordMutation.mutate(email)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Email Enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              Si el email <strong>{email}</strong> existe en nuestro sistema, 
              recibirás un enlace para restablecer tu contraseña.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>💡 Consejo:</strong> Revisa tu carpeta de spam si no encuentras el email.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Login
              </Link>
              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                }}
                className="w-full text-sm text-lime-600 hover:text-lime-800"
              >
                Intentar con otro email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
            <Store className="h-6 w-6 text-lime-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="text-gray-600 mb-8">
            No te preocupes, te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            className="w-full bg-lime-500 text-white py-3 px-4 rounded-lg hover:bg-lime-600 focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {forgotPasswordMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : (
              'Enviar Enlace de Recuperación'
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al Login
            </Link>
          </div>
        </form>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Importante:</strong> El enlace de recuperación expira en 1 hora y solo puede usarse una vez.
          </p>
        </div>
      </div>
    </div>
  )
}
