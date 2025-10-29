import { useState } from 'react'
import { 
  ExternalLink, 
  MessageCircle, 
  Phone, 
  CheckCircle, 
  XCircle,
  Clock,
  MoreVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from 'lucide-react'
import { formatCurrency, formatDateTime, formatOrderStatus, formatOrderChannel, getStatusColor } from '../utils/formatters'

export function OrderTable({ orders, isLoading, onStatusUpdate, isUpdating }) {
  const [showActions, setShowActions] = useState(null)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <Clock className="h-4 w-4" />
      case 'sent':
        return <MessageCircle className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />
      case 'sms':
        return <Phone className="h-4 w-4" />
      case 'web':
        return <ExternalLink className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'whatsapp':
        return 'text-green-600'
      case 'sms':
        return 'text-blue-600'
      case 'web':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const handleWhatsAppClick = (order) => {
    if (order.whatsappLink) {
      window.open(order.whatsappLink, '_blank')
    }
  }

  const handleSMSClick = (order) => {
    if (order.smsLink) {
      window.open(order.smsLink, '_blank')
    }
  }

  const handleStatusChange = (orderId, newStatus) => {
    onStatusUpdate(orderId, newStatus)
    setShowActions(null)
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Canal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${getChannelColor(order.channel)}`}>
                      {getChannelIcon(order.channel)}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">
                        {formatOrderChannel(order.channel)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items.slice(0, 2).map(item => item.nameSnapshot).join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2} más`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.totals.itemsTotal)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${getStatusColor(order.status).split(' ')[0]}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {formatOrderStatus(order.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Botones de canal */}
                    {order.whatsappLink && (
                      <button
                        onClick={() => handleWhatsAppClick(order)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Abrir WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    )}
                    
                    {order.smsLink && (
                      <button
                        onClick={() => handleSMSClick(order)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Enviar SMS"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                    )}

                    {/* Menú de acciones */}
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === order._id ? null : order._id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {showActions === order._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            {order.status === 'created' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'sent')}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                disabled={isUpdating}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Marcar como Enviado
                              </button>
                            )}
                            
                            {order.status === 'sent' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'confirmed')}
                                className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                disabled={isUpdating}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar como Confirmado
                              </button>
                            )}
                            
                            {(order.status === 'created' || order.status === 'sent') && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'cancelled')}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                disabled={isUpdating}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar Pedido
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                // Implementar vista de detalles
                                console.log('Ver detalles del pedido:', order._id)
                                setShowActions(null)
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estado vacío */}
      {orders.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Los pedidos aparecerán aquí cuando los clientes realicen compras.
          </p>
        </div>
      )}
    </div>
  )
}
