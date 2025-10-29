import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../api/analyticsService'
import { AnalyticsCharts } from '../components/AnalyticsCharts'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { formatCurrency, formatNumber } from '../utils/formatters'
import toast from 'react-hot-toast'

export function Analytics() {
  const [dateRange, setDateRange] = useState('30days')
  const [chartType, setChartType] = useState('orders')

  // Obtener datos de analytics
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics', 'overview', dateRange],
    queryFn: () => analyticsService.getOverview({ 
      from: getDateFromRange(dateRange).from,
      to: getDateFromRange(dateRange).to 
    }),
  })

  const { data: topProducts, isLoading: topProductsLoading } = useQuery({
    queryKey: ['analytics', 'top-products', dateRange],
    queryFn: () => analyticsService.getTopProducts({ 
      from: getDateFromRange(dateRange).from,
      to: getDateFromRange(dateRange).to,
      limit: 10 
    }),
  })

  const { data: ordersByDay, isLoading: ordersByDayLoading } = useQuery({
    queryKey: ['analytics', 'orders-by-day', dateRange],
    queryFn: () => analyticsService.getOrdersByDay({ 
      from: getDateFromRange(dateRange).from,
      to: getDateFromRange(dateRange).to 
    }),
  })

  const { data: channelStats, isLoading: channelStatsLoading } = useQuery({
    queryKey: ['analytics', 'channel-stats', dateRange],
    queryFn: () => analyticsService.getChannelStats({ 
      from: getDateFromRange(dateRange).from,
      to: getDateFromRange(dateRange).to 
    }),
  })

  const getDateFromRange = (range) => {
    const today = new Date()
    const from = new Date(today)
    
    switch (range) {
      case '7days':
        from.setDate(from.getDate() - 7)
        break
      case '30days':
        from.setDate(from.getDate() - 30)
        break
      case '90days':
        from.setDate(from.getDate() - 90)
        break
      case '1year':
        from.setFullYear(from.getFullYear() - 1)
        break
      default:
        from.setDate(from.getDate() - 30)
    }
    
    return {
      from: from.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    }
  }

  const handleRefresh = () => {
    // Refrescar todas las consultas
    window.location.reload()
    toast.success('Datos actualizados')
  }

  const handleExport = () => {
    toast.success('Exportando datos de analytics...')
  }

  const getDateRangeOptions = () => [
    { value: '7days', label: 'Últimos 7 días' },
    { value: '30days', label: 'Últimos 30 días' },
    { value: '90days', label: 'Últimos 90 días' },
    { value: '1year', label: 'Último año' },
  ]

  const getChartTypeOptions = () => [
    { value: 'orders', label: 'Pedidos por día' },
    { value: 'revenue', label: 'Ingresos por día' },
    { value: 'products', label: 'Productos más vendidos' },
    { value: 'channels', label: 'Distribución por canal' },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Métricas y análisis de tu tienda
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              {getDateRangeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de gráfico
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="input-field"
            >
              {getChartTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Pedidos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(overview?.totalOrders || 0)}
              </p>
              <p className="text-sm text-green-600">
                +{overview?.ordersChange || 0}% vs período anterior
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(overview?.totalRevenue || 0)}
              </p>
              <p className="text-sm text-green-600">
                +{overview?.revenueChange || 0}% vs período anterior
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ticket Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(overview?.averageOrderValue || 0)}
              </p>
              <p className="text-sm text-green-600">
                +{overview?.aovChange || 0}% vs período anterior
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-100">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tasa de Conversión</p>
              <p className="text-2xl font-semibold text-gray-900">
                {overview?.conversionRate || 0}%
              </p>
              <p className="text-sm text-green-600">
                +{overview?.conversionChange || 0}% vs período anterior
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico principal */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {chartType === 'orders' && 'Pedidos por Día'}
              {chartType === 'revenue' && 'Ingresos por Día'}
              {chartType === 'products' && 'Productos Más Vendidos'}
              {chartType === 'channels' && 'Distribución por Canal'}
            </h3>
          </div>
          
          <AnalyticsCharts
            type={chartType}
            data={chartType === 'orders' ? ordersByDay : 
                  chartType === 'revenue' ? ordersByDay :
                  chartType === 'products' ? topProducts :
                  channelStats}
            isLoading={chartType === 'orders' ? ordersByDayLoading :
                      chartType === 'revenue' ? ordersByDayLoading :
                      chartType === 'products' ? topProductsLoading :
                      channelStatsLoading}
          />
        </div>

        {/* Productos más vendidos */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Productos Más Vendidos
          </h3>
          
          {topProductsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              ))}
            </div>
          ) : topProducts?.data?.length > 0 ? (
            <div className="space-y-4">
              {topProducts.data.slice(0, 5).map((product, index) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-lime-800">
                        {index + 1}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.totalQuantity} vendidos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay datos de productos
            </p>
          )}
        </div>
      </div>

      {/* Estadísticas de canales */}
      {channelStats?.data && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Distribución por Canal
          </h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {channelStats.data.map((channel) => (
              <div key={channel._id} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {channel.percentage}%
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {channel._id}
                </div>
                <div className="text-xs text-gray-400">
                  {channel.count} pedidos
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
