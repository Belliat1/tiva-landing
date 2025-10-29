import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle,
  ArrowLeft,
  Package,
  Star,
  Heart
} from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import toast from 'react-hot-toast'

export function PublicCatalog() {
  const { catalogId } = useParams()
  const navigate = useNavigate()
  
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Cargar información de la tienda
  useEffect(() => {
    const loadStore = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/public/catalog/${catalogId}`)
        const data = await response.json()
        
        if (data.success) {
          setStore(data.data)
        } else {
          toast.error('Catálogo no encontrado')
          navigate('/')
        }
      } catch (error) {
        console.error('Error loading store:', error)
        toast.error('Error al cargar el catálogo')
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (catalogId) {
      loadStore()
    }
  }, [catalogId, navigate])

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          category: selectedCategory !== 'all' ? selectedCategory : ''
        })
        
        const response = await fetch(`http://localhost:3001/api/public/catalog/${catalogId}/products?${params}`)
        const data = await response.json()
        
        if (data.success) {
          setProducts(data.data.products)
        }
      } catch (error) {
        console.error('Error loading products:', error)
        toast.error('Error al cargar productos')
      }
    }

    if (catalogId) {
      loadProducts()
    }
  }, [catalogId, searchQuery, selectedCategory])

  // Agregar producto al carrito
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product._id)
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }])
    }
    
    toast.success(`${product.name} agregado al carrito`)
  }

  // Actualizar cantidad en carrito
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId))
    } else {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      ))
    }
  }

  // Calcular total del carrito
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  // Crear pedido
  const createOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Nombre y teléfono son requeridos')
      return
    }

    if (cart.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/public/catalog/${catalogId}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: customerInfo,
          items: cart,
          channel: 'whatsapp'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Abrir WhatsApp con el mensaje generado
        if (data.data.contactLinks.whatsapp) {
          window.open(data.data.contactLinks.whatsapp, '_blank')
        }
        
        toast.success('Pedido creado exitosamente')
        setCart([])
        setShowCart(false)
        setCustomerInfo({ name: '', phone: '', email: '', notes: '' })
      } else {
        toast.error(data.message || 'Error al crear el pedido')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Error al crear el pedido')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando catálogo...</p>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Catálogo no encontrado</h2>
          <p className="text-gray-600 mb-4">El catálogo que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {store.logo && (
                <img 
                  src={store.logo} 
                  alt={store.name}
                  className="h-8 w-8 rounded-full mr-3"
                />
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{store.name}</h1>
                {store.description && (
                  <p className="text-sm text-gray-600">{store.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrito ({cart.length})
                {cartTotal > 0 && (
                  <span className="ml-2 text-sm">
                    {formatCurrency(cartTotal, store.currency)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value="electronics">Electrónicos</option>
              <option value="clothing">Ropa</option>
              <option value="food">Comida</option>
              <option value="books">Libros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Productos */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron productos en este catálogo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="aspect-w-1 aspect-h-1">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-lime-600">
                      {formatCurrency(product.price, store.currency)}
                    </span>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 flex items-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Agregar
                    </button>
                  </div>
                  
                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-sm text-orange-600 mt-2">
                      ¡Solo quedan {product.stock} disponibles!
                    </p>
                  )}
                  
                  {product.stock === 0 && (
                    <p className="text-sm text-red-600 mt-2">
                      Agotado
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal del Carrito */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Carrito de Compras</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tu carrito está vacío</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.price, store.currency)} c/u
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-lime-600">
                    {formatCurrency(cartTotal, store.currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tu nombre *"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                  />
                  
                  <input
                    type="tel"
                    placeholder="Tu teléfono *"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                  />
                  
                  <input
                    type="email"
                    placeholder="Tu email (opcional)"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                  />
                  
                  <textarea
                    placeholder="Notas adicionales (opcional)"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                    rows={3}
                  />
                </div>
                
                <button
                  onClick={createOrder}
                  className="w-full bg-lime-500 text-white py-3 rounded-lg hover:bg-lime-600 flex items-center justify-center mt-4"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Enviar pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
