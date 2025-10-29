import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del producto es requerido"],
    trim: true,
    maxlength: [200, "El nombre no puede exceder 200 caracteres"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "La descripción no puede exceder 1000 caracteres"]
  },
  price: {
    type: Number,
    required: [true, "El precio es requerido"],
    min: [0, "El precio debe ser mayor o igual a 0"]
  },
  stock: {
    type: Number,
    required: [true, "El stock es requerido"],
    min: [0, "El stock debe ser mayor o igual a 0"],
    default: 0
  },
  imageUrls: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: "URL de imagen inválida"
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, "Cada etiqueta no puede exceder 50 caracteres"]
  }],
  status: {
    type: String,
    enum: ["active", "archived", "draft"],
    default: "active"
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
  },
  isActive: {
    type: Boolean,
    default: true
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
productSchema.index({ storeId: 1, status: 1 });
productSchema.index({ storeId: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Middleware pre-save para validaciones adicionales
productSchema.pre("save", function(next) {
  // Convertir tags a minúsculas y eliminar duplicados
  if (this.tags && this.tags.length > 0) {
    this.tags = [...new Set(this.tags.map(tag => tag.toLowerCase().trim()))];
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
