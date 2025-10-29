import { useState } from 'react'
import ProductForm from './ProductForm'
import { PlusCircle } from 'lucide-react'

// Componente de ejemplo para mostrar cómo usar ProductForm
export function ProductFormExample() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const handleSuccess = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
    // Aquí podrías actualizar la lista de productos
    console.log('Producto guardado exitosamente')
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-blue">
          Gestión de Productos
        </h1>
        <button
          onClick={() => {
            setEditingProduct(null)
            setIsFormOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Lista de productos (ejemplo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Producto de ejemplo */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">Sin imagen</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Producto de Ejemplo</h3>
          <p className="text-gray-600 text-sm mb-2">Descripción del producto...</p>
          <p className="text-primary-blue font-bold text-lg">$50,000</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleEdit({ 
                _id: '1', 
                name: 'Producto de Ejemplo', 
                description: 'Descripción del producto...',
                price: 50000,
                stock: 10,
                imageUrls: []
              })}
              className="btn-secondary text-sm"
            >
              Editar
            </button>
            <button className="btn-danger text-sm">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Modal del formulario */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsFormOpen(false)
            setEditingProduct(null)
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}

export default ProductFormExample
