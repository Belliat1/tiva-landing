import { useState } from 'react'
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '../utils/formatters'

export function ProductTable({ products, onEdit, onDelete, isLoading }) {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showActions, setShowActions] = useState(null)

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products.map(p => p._id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  const handleBulkAction = (action) => {
    // Implementar acciones masivas
    console.log('Bulk action:', action, selectedProducts)
    setSelectedProducts([])
  }

  return (
    <div className="card">
      {/* Header con acciones masivas */}
      {selectedProducts.length > 0 && (
        <div className="mb-4 p-3 bg-lime-50 border border-lime-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-lime-800">
              {selectedProducts.length} producto{selectedProducts.length > 1 ? 's' : ''} seleccionado{selectedProducts.length > 1 ? 's' : ''}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('archive')}
                className="text-sm text-lime-600 hover:text-lime-700 font-medium"
              >
                Archivar
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
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
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={(e) => handleSelectProduct(product._id, e.target.checked)}
                    className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {product.imageUrls?.[0] ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.imageUrls[0]}
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description || 'Sin descripción'}
                      </div>
                      {product.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{product.tags.length - 2} más
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      product.stock === 0 
                        ? 'text-red-600' 
                        : product.stock < 10 
                        ? 'text-yellow-600' 
                        : 'text-gray-900'
                    }`}>
                      {product.stock}
                    </span>
                    {product.stock === 0 && (
                      <span className="ml-2 text-xs text-red-600 font-medium">
                        Sin stock
                      </span>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                      <span className="ml-2 text-xs text-yellow-600 font-medium">
                        Bajo stock
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                    {product.status === 'active' ? 'Activo' : 'Archivado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(product.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-lime-600 hover:text-lime-900 p-1"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(`/tienda/${product.slug}`, '_blank')}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Ver en tienda"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === product._id ? null : product._id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {showActions === product._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onDelete(product)
                                setShowActions(null)
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {product.status === 'active' ? 'Archivar' : 'Eliminar'}
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

      {/* Paginación simple */}
      {products.length === 0 && (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando tu primer producto.
          </p>
        </div>
      )}
    </div>
  )
}
