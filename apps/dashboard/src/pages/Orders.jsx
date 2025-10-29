import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../api/orderService'
import { OrderTable } from '../components/OrderTable'
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

export function Orders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('-createdAt')

  const queryClient = useQueryClient()

  // Obtener pedidos
  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['orders', { 
      search: searchQuery, 
      status: statusFilter, 
      channel: channelFilter,
      dateRange,
      sort: sortBy 
    }],
    queryFn: () => orderService.getOrders({
      q: searchQuery,
      status: statusFilter === 'all' ? undefined : statusFilter,
      channel: channelFilter === 'all' ? undefined : channelFilter,
      dateRange: dateRange === 'all' ? undefined : dateRange,
      sort: sortBy,
      limit: 50
    }),
    refetchInterval: 30000, // Refrescar cada 30 segundos
  })

  // Mutación para actualizar estado
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      toast.success('Estado actualizado')
    },
    onError: () => {
      toast.error('Error al actualizar el estado')
    }
  })

  const handleStatusUpdate = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus })
  }

  const handleRefresh = () => {
    refetch()
    toast.success('Pedidos actualizados')
  }

  const handleExport = () => {
    // Implementar exportación de pedidos
    toast.success('Exportando pedidos...')
  }

  const getDateRangeOptions = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastMonth = new Date(today)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    return [
      { value: 'all', label: 'Todos los períodos' },
      { value: 'today', label: 'Hoy' },
      { value: 'yesterday', label: 'Ayer' },
      { value: 'last7days', label: 'Últimos 7 días' },
      { value: 'last30days', label: 'Últimos 30 días' },
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los pedidos de tu tienda
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* Estadísticas rápidas */}
      {ordersData?.stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Pedidos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {ordersData.stats.totalOrders || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {ordersData.stats.confirmedOrders || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-100">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {ordersData.stats.pendingOrders || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ingresos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${ordersData.stats.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filtro de estado */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos los estados</option>
              <option value="created">Creados</option>
              <option value="sent">Enviados</option>
              <option value="confirmed">Confirmados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>

          {/* Filtro de canal */}
          <div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos los canales</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="web">Web</option>
            </select>
          </div>

          {/* Filtro de fecha */}
          <div>
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
        </div>

        {/* Filtros adicionales */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto"
            >
              <option value="-createdAt">Más recientes</option>
              <option value="createdAt">Más antiguos</option>
              <option value="-totals.itemsTotal">Mayor valor</option>
              <option value="totals.itemsTotal">Menor valor</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {ordersData?.data?.length || 0} pedido{(ordersData?.data?.length || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <OrderTable
        orders={ordersData?.data || []}
        isLoading={isLoading}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={updateStatusMutation.isPending}
      />
    </div>
  )
}
