// Formatear moneda
export const formatCurrency = (amount, currency = 'COP') => {
  if (typeof amount !== 'number') return '$0'
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Formatear fecha
export const formatDate = (date, options = {}) => {
  if (!date) return ''
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat('es-CO', defaultOptions).format(new Date(date))
}

// Formatear fecha y hora
export const formatDateTime = (date) => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear número con separadores de miles
export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0'
  return new Intl.NumberFormat('es-CO').format(number)
}

// Truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Capitalizar primera letra
export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Generar slug
export const generateSlug = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Formatear estado de pedido
export const formatOrderStatus = (status) => {
  const statusMap = {
    created: 'Creado',
    sent: 'Enviado',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado'
  }
  return statusMap[status] || capitalize(status)
}

// Formatear canal de pedido
export const formatOrderChannel = (channel) => {
  const channelMap = {
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    web: 'Web'
  }
  return channelMap[channel] || capitalize(channel)
}

// Obtener color según estado
export const getStatusColor = (status) => {
  const colorMap = {
    created: 'bg-blue-100 text-blue-800',
    sent: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}
