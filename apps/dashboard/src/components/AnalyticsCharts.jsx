import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { formatCurrency, formatNumber } from '../utils/formatters'

const COLORS = ['#A2D729', '#26C7C1', '#1E3A8A', '#F59E0B', '#EF4444']

export function AnalyticsCharts({ type, data, isLoading }) {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
      </div>
    )
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No hay datos disponibles para este período</p>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'orders':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-CO')}
                formatter={(value) => [value, 'Pedidos']}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#A2D729" 
                strokeWidth={2}
                dot={{ fill: '#A2D729', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${formatNumber(value)}`}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-CO')}
                formatter={(value) => [formatCurrency(value), 'Ingresos']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#26C7C1" 
                strokeWidth={2}
                dot={{ fill: '#26C7C1', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'products':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.data.slice(0, 8)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                width={120}
              />
              <Tooltip 
                formatter={(value) => [value, 'Cantidad vendida']}
              />
              <Bar dataKey="totalQuantity" fill="#A2D729" />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'channels':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, 'Pedidos']}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>Tipo de gráfico no soportado</p>
          </div>
        )
    }
  }

  return (
    <div className="w-full">
      {renderChart()}
    </div>
  )
}
