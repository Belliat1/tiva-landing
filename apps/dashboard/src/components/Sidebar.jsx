import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Store,
  X
} from 'lucide-react'
import { useAuthStore } from '../auth/useAuthStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Pedidos', href: '/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar({ onClose }) {
  const { store, logout } = useAuthStore()

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-primary-800" />
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">Tiva Store</h1>
            {store && (
              <p className="text-sm text-gray-500 truncate max-w-32">
                {store.name}
              </p>
            )}
          </div>
        </div>
        
        {/* Botón cerrar para móvil */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-item ${
                isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full sidebar-item sidebar-item-inactive text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Settings className="h-5 w-5 mr-3" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
