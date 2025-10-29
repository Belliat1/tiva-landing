import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { storeService } from '../api/storeService'
import { useAuthStore } from '../auth/useAuthStore'
import { useUploadImage } from '../hooks/useUploadImage'
import { 
  Store, 
  Phone, 
  Mail, 
  Globe, 
  Upload, 
  Save,
  Eye,
  Copy,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'

export function Settings() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    whatsappNumber: '',
    smsNumber: '',
    email: '',
    website: '',
    address: '',
    currency: 'COP',
    timezone: 'America/Bogota',
    language: 'es'
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [catalogUrl, setCatalogUrl] = useState('')

  const { store, updateStore } = useAuthStore()
  const { uploadImage, isUploading } = useUploadImage()
  const queryClient = useQueryClient()

  // Obtener datos de la tienda
  const { data: storeData, isLoading } = useQuery({
    queryKey: ['store'],
    queryFn: () => storeService.getStore(),
  })

  // Mutación para actualizar configuración
  const updateSettingsMutation = useMutation({
    mutationFn: (data) => storeService.updateSettings(data),
    onSuccess: (response) => {
      updateStore(response.data)
      queryClient.invalidateQueries(['store'])
      toast.success('Configuración actualizada')
    },
    onError: () => {
      toast.error('Error al actualizar la configuración')
    }
  })

  // Mutación para generar URL del catálogo
  const generateUrlMutation = useMutation({
    mutationFn: () => storeService.generateCatalogUrl(),
    onSuccess: (response) => {
      setCatalogUrl(response.data.catalogUrl)
      toast.success('URL del catálogo generada exitosamente')
    },
    onError: () => {
      toast.error('Error al generar la URL del catálogo')
    }
  })

  // Mutación para subir logo
  const uploadLogoMutation = useMutation({
    mutationFn: (file) => storeService.uploadLogo(file),
    onSuccess: (response) => {
      updateStore({ logo: response.data.logo })
      queryClient.invalidateQueries(['store'])
      toast.success('Logo actualizado')
    },
    onError: () => {
      toast.error('Error al subir el logo')
    }
  })

  // Cargar datos iniciales
  useEffect(() => {
    if (storeData) {
      setFormData({
        name: storeData.name || '',
        description: storeData.description || '',
        whatsappNumber: storeData.whatsappNumber || '',
        smsNumber: storeData.smsNumber || '',
        email: storeData.email || '',
        website: storeData.website || '',
        address: storeData.address || '',
        currency: storeData.settings?.currency || 'COP',
        timezone: storeData.settings?.timezone || 'America/Bogota',
        language: storeData.settings?.language || 'es'
      })
      setLogoPreview(storeData.logo || '')
    }
  }, [storeData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateCatalogUrl = () => {
    generateUrlMutation.mutate()
  }

  const handleLogoUpload = async () => {
    if (logoFile) {
      try {
        const logoUrl = await uploadImage(logoFile)
        uploadLogoMutation.mutate(logoFile)
        setLogoPreview(logoUrl)
      } catch (error) {
        console.error('Error uploading logo:', error)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateSettingsMutation.mutate(formData)
  }

  const handleCopyLink = () => {
    const storeUrl = `${window.location.origin}/tienda/${store?.slug || 'mi-tienda'}`
    navigator.clipboard.writeText(storeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Enlace copiado al portapapeles')
  }

  const getStoreUrl = () => {
    return `${window.location.origin}/tienda/${store?.slug || 'mi-tienda'}`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona la configuración de tu tienda
        </p>
      </div>

      {/* Vista previa de la tienda */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Vista Previa de la Tienda</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Ocultar' : 'Mostrar'} Vista Previa
            </button>
            <button
              onClick={handleCopyLink}
              className="btn-secondary flex items-center"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copiado' : 'Copiar Enlace'}
            </button>
          </div>
        </div>
        
        {showPreview && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">URL de tu tienda:</div>
              <div className="font-mono text-sm bg-white p-2 rounded border">
                {getStoreUrl()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formulario de configuración */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la tienda *
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Mi Tienda Online"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="input-field"
              >
                <option value="COP">Peso Colombiano (COP)</option>
                <option value="USD">Dólar Americano (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="MXN">Peso Mexicano (MXN)</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la tienda
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Describe tu tienda y lo que ofreces..."
            />
          </div>
        </div>

        {/* Logo */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Logo de la Tienda</h3>
          
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo de la tienda"
                  className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Store className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="btn-secondary cursor-pointer inline-flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {logoFile ? 'Cambiar Logo' : 'Subir Logo'}
              </label>
              
              {logoFile && (
                <button
                  type="button"
                  onClick={handleLogoUpload}
                  disabled={isUploading || uploadLogoMutation.isPending}
                  className="ml-3 btn-primary disabled:opacity-50"
                >
                  {isUploading || uploadLogoMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-800 mr-2"></div>
                      Subiendo...
                    </div>
                  ) : (
                    'Guardar Logo'
                  )}
                </button>
              )}
              
              <p className="mt-2 text-sm text-gray-500">
                PNG, JPG o WebP. Máximo 2MB. Recomendado: 200x200px
              </p>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS (opcional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="smsNumber"
                  value={formData.smsNumber}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="tienda@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sitio web
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="https://mitienda.com"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="input-field"
              placeholder="Dirección física de tu tienda..."
            />
          </div>
        </div>

        {/* Configuración regional */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración Regional</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona horaria
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="input-field"
              >
                <option value="America/Bogota">Bogotá (UTC-5)</option>
                <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                <option value="America/New_York">Nueva York (UTC-5)</option>
                <option value="America/Los_Angeles">Los Ángeles (UTC-8)</option>
                <option value="Europe/Madrid">Madrid (UTC+1)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="input-field"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catálogo público */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Catálogo Público</h3>
          <p className="text-sm text-gray-600 mb-4">
            Genera un enlace para que tus clientes puedan ver y comprar tus productos sin necesidad de registrarse.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlace del Catálogo
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={catalogUrl || 'Genera tu enlace...'}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  type="button"
                  onClick={generateCatalogUrl}
                  disabled={generateUrlMutation.isPending}
                  className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 disabled:opacity-50"
                >
                  {generateUrlMutation.isPending ? 'Generando...' : 'Generar Enlace'}
                </button>
              </div>
            </div>
            
            {catalogUrl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">
                    ¡Tu catálogo está listo! Comparte este enlace con tus clientes.
                  </span>
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(catalogUrl)
                      toast.success('Enlace copiado al portapapeles')
                    }}
                    className="text-sm text-green-600 hover:text-green-800 flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar enlace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="btn-primary disabled:opacity-50"
          >
            {updateSettingsMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-800 mr-2"></div>
                Guardando...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
