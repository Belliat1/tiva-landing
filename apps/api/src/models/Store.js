import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  catalogId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  catalogUrl: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    theme: {
      primaryColor: {
        type: String,
        default: "#3B82F6"
      },
      secondaryColor: {
        type: String,
        default: "#10B981"
      },
      logo: {
        type: String,
        default: ""
      }
    },
    contact: {
      phone: {
        type: String,
        default: ""
      },
      email: {
        type: String,
        default: ""
      },
      address: {
        type: String,
        default: ""
      }
    },
    social: {
      whatsapp: {
        type: String,
        default: ""
      },
      instagram: {
        type: String,
        default: ""
      },
      facebook: {
        type: String,
        default: ""
      }
    }
  },
  analytics: {
    totalViews: {
      type: Number,
      default: 0
    },
    totalProducts: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
storeSchema.index({ owner: 1 });
storeSchema.index({ catalogId: 1 });
storeSchema.index({ catalogUrl: 1 });
storeSchema.index({ isActive: 1 });

// Middleware para generar catalogId y catalogUrl automáticamente
storeSchema.pre('save', function(next) {
  if (this.isNew && !this.catalogId) {
    // Generar catalogId basado en el nombre de la tienda
    const baseId = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    this.catalogId = baseId;
    this.catalogUrl = `https://tiva.store/${baseId}`;
  }
  next();
});

// Método para obtener estadísticas de la tienda
storeSchema.methods.getStats = function() {
  return {
    totalViews: this.analytics.totalViews,
    totalProducts: this.analytics.totalProducts,
    isActive: this.isActive,
    createdAt: this.createdAt,
    lastUpdated: this.analytics.lastUpdated
  };
};

// Método para actualizar analytics
storeSchema.methods.updateAnalytics = function(views = 0, products = 0) {
  this.analytics.totalViews += views;
  this.analytics.totalProducts = products;
  this.analytics.lastUpdated = new Date();
  return this.save();
};

const Store = mongoose.model("Store", storeSchema);

export default Store;
