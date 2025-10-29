import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../api/analyticsService'
import { orderService } from '../api/orderService'
import { productService } from '../api/productService'
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp,
  Users,
  Eye
} from 'lucide-react'
import { formatCurrency, formatNumber } from '../utils/formatters'

export function Dashboard() {
  // Obtener datos de analytics
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: () => analyticsService.getOverview(),
    refetchInterval: 30000, // Refrescar cada 30 segundos
  })

  // Obtener pedidos recientes
  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: () => orderService.getOrders({ limit: 5, sort: '-createdAt' }),
  })

  // Obtener productos con bajo stock
  const { data: lowStockProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => productService.getProducts({ status: 'active', limit: 5 }),
  })

  const stats = [
    {
      name: 'Total Pedidos',
      value: overview?.totalOrders || 0,
      change: overview?.ordersChange || 0,
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Ingresos Estimados',
      value: formatCurrency(overview?.totalRevenue || 0),
      change: overview?.revenueChange || 0,
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Productos Activos',
      value: overview?.totalProducts || 0,
      change: overview?.productsChange || 0,
      changeType: 'increase',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Tasa de Conversión',
      value: `${overview?.conversionRate || 0}%`,
      change: overview?.conversionChange || 0,
      changeType: overview?.conversionChange >= 0 ? 'increase' : 'decrease',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  if (overviewLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen de tu tienda y métricas importantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                {stat.change !== 0 && (
                  <p className={`text-sm ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'increase' ? '+' : ''}{stat.change}%
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pedidos recientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Pedidos Recientes</h3>
            <a
              href="/orders"
              className="text-sm text-lime-600 hover:text-lime-500 font-medium"
            >
              Ver todos
            </a>
          </div>
          
          {ordersLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              ))}
            </div>
          ) : recentOrders?.data?.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.data.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.channel} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totals.itemsTotal)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {formatOrderStatus(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay pedidos recientes
            </p>
          )}
        </div>

        {/* Productos con bajo stock */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Bajo Stock</h3>
            <a
              href="/products"
              className="text-sm text-lime-600 hover:text-lime-500 font-medium"
            >
              Ver todos
            </a>
          </div>
          
          {productsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              ))}
            </div>
          ) : lowStockProducts?.data?.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.data
                .filter(product => product.stock < 10)
                .slice(0, 5)
                .map((product) => (
                <div key={product._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    {product.imageUrls?.[0] && (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {product.stock} unidades
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Todos los productos tienen stock suficiente
            </p>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/products/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="h-8 w-8 text-lime-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Agregar Producto</p>
              <p className="text-xs text-gray-500">Crear nuevo producto</p>
            </div>
          </a>
          
          <a
            href="/orders"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Ver Pedidos</p>
              <p className="text-xs text-gray-500">Gestionar pedidos</p>
            </div>
          </a>
          
          <a
            href="/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Ver Analytics</p>
              <p className="text-xs text-gray-500">Métricas detalladas</p>
            </div>
          </a>
          
          <a
            href="/settings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Vista Previa</p>
              <p className="text-xs text-gray-500">Ver tu tienda</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

// Función auxiliar para formatear estado de pedido
function formatOrderStatus(status) {
  const statusMap = {
    created: 'Creado',
    sent: 'Enviado',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado'
  }
  return statusMap[status] || status
}

// Función auxiliar para obtener color de estado
function getStatusColor(status) {
  const colorMap = {
    created: 'bg-blue-100 text-blue-800',
    sent: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}
