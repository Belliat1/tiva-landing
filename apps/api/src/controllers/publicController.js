import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Obtener información de la tienda por URL del catálogo
export const getStoreByCatalogUrl = async (req, res) => {
  try {
    const { catalogId } = req.params;

    const store = await Store.findOne({ catalogId: catalogId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Catálogo no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: store._id,
        name: store.name,
        description: store.description,
        logo: store.logo,
        whatsappNumber: store.whatsappNumber,
        smsNumber: store.smsNumber,
        currency: store.currency,
        language: store.language
      }
    });

  } catch (error) {
    console.error('Error en getStoreByCatalogUrl:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener productos de la tienda (público)
export const getStoreProducts = async (req, res) => {
  try {
    const { catalogId } = req.params;
    const { page = 1, limit = 20, search, category } = req.query;

    // Buscar la tienda
    const store = await Store.findOne({ catalogId: catalogId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Catálogo no encontrado'
      });
    }

    // Construir filtros
    const filters = { 
      storeId: store._id, 
      status: 'active' 
    };

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filters.category = category;
    }

    // Obtener productos con paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filters)
      .select('name description price image category stock status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error en getStoreProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear pedido público (sin autenticación)
export const createPublicOrder = async (req, res) => {
  try {
    const { catalogId } = req.params;
    const { customer, items, channel = 'whatsapp' } = req.body;

    // Validar datos básicos
    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y teléfono del cliente son requeridos'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe incluir al menos un producto'
      });
    }

    // Buscar la tienda
    const store = await Store.findOne({ catalogId: catalogId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Catálogo no encontrado'
      });
    }

    // Validar productos y calcular totales
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ 
        _id: item.productId, 
        storeId: store._id,
        status: 'active'
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Producto ${item.productId} no encontrado o no disponible`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Crear el pedido
    const order = {
      storeId: store._id,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || null
      },
      items: orderItems,
      totals: {
        subtotal: totalAmount,
        tax: 0, // Por ahora sin impuestos
        total: totalAmount
      },
      channel: channel,
      status: 'pending',
      notes: customer.notes || null
    };

    // Guardar en la base de datos
    const newOrder = await Order.create(order);

    // Generar enlaces de contacto
    const contactLinks = generateContactLinks(store, newOrder, orderItems);

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: {
        orderId: newOrder._id,
        total: totalAmount,
        contactLinks
      }
    });

  } catch (error) {
    console.error('Error en createPublicOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función auxiliar para generar enlaces de contacto
function generateContactLinks(store, order, items) {
  const links = {};

  // Generar mensaje para WhatsApp
  if (store.whatsappNumber) {
    const whatsappMessage = generateWhatsAppMessage(store, order, items);
    const whatsappNumber = store.whatsappNumber.replace(/\D/g, ''); // Solo números
    links.whatsapp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  }

  // Generar mensaje para SMS
  if (store.smsNumber) {
    const smsMessage = generateSMSMessage(store, order, items);
    links.sms = `sms:${store.smsNumber}?body=${encodeURIComponent(smsMessage)}`;
  }

  return links;
}

// Generar mensaje para WhatsApp
function generateWhatsAppMessage(store, order, items) {
  let message = `🛒 *Pedido para ${store.name}*\n\n`;
  message += `👤 *Cliente:* ${order.customer.name}\n`;
  message += `📞 *Teléfono:* ${order.customer.phone}\n\n`;
  message += `📋 *Productos:*\n`;
  
  items.forEach(item => {
    message += `• ${item.productName} x${item.quantity} - $${item.total}\n`;
  });
  
  message += `\n💰 *Total: $${order.totals.total}*\n`;
  
  if (order.notes) {
    message += `\n📝 *Notas:* ${order.notes}\n`;
  }
  
  message += `\n🆔 *ID del Pedido:* ${order._id}`;
  
  return message;
}

// Generar mensaje para SMS
function generateSMSMessage(store, order, items) {
  let message = `Pedido para ${store.name}\n`;
  message += `Cliente: ${order.customer.name} (${order.customer.phone})\n`;
  message += `Productos: `;
  
  const productList = items.map(item => 
    `${item.productName} x${item.quantity}`
  ).join(', ');
  
  message += productList;
  message += `\nTotal: $${order.totals.total}`;
  
  if (order.notes) {
    message += `\nNotas: ${order.notes}`;
  }
  
  message += `\nID: ${order._id}`;
  
  return message;
}
