import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: [true, "El nombre del cliente es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"]
    },
    phone: {
      type: String,
      required: [true, "El teléfono del cliente es requerido"],
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Número de teléfono inválido"]
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"]
    }
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "La cantidad debe ser al menos 1"]
    },
    price: {
      type: Number,
      required: true,
      min: [0, "El precio debe ser mayor o igual a 0"]
    },
    total: {
      type: Number,
      required: true,
      min: [0, "El total debe ser mayor o igual a 0"]
    }
  }],
  totals: {
    itemsTotal: {
      type: Number,
      required: true,
      min: [0, "El total de items debe ser mayor o igual a 0"]
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, "El envío debe ser mayor o igual a 0"]
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "El impuesto debe ser mayor o igual a 0"]
    },
    total: {
      type: Number,
      required: true,
      min: [0, "El total debe ser mayor o igual a 0"]
    },
    currency: {
      type: String,
      default: "COP",
      enum: ["COP", "USD", "EUR"]
    }
  },
  status: {
    type: String,
    enum: ["created", "sent", "confirmed", "cancelled", "completed"],
    default: "created"
  },
  channel: {
    type: String,
    enum: ["whatsapp", "sms", "web", "phone"],
    required: [true, "El canal es requerido"]
  },
  whatsappLink: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https:\/\/wa\.me\/\d+/.test(v);
      },
      message: "Link de WhatsApp inválido"
    }
  },
  smsLink: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^sms:\/\//.test(v);
      },
      message: "Link de SMS inválido"
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, "Las notas no pueden exceder 500 caracteres"]
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: [true, "ID de tienda requerido"]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "ID de usuario creador requerido"]
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para optimizar consultas
orderSchema.index({ storeId: 1, status: 1 });
orderSchema.index({ storeId: 1, channel: 1 });
orderSchema.index({ storeId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "customer.phone": 1 });

// Middleware pre-save para generar número de orden
orderSchema.pre("save", async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments({ storeId: this.storeId });
    this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
