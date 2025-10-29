import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    trim: true,
    maxlength: [100, "El nombre no puede exceder 100 caracteres"]
  },
  email: {
    type: String,
    required: [true, "El email es requerido"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, "Número de teléfono inválido"]
  },
  role: {
    type: String,
    enum: ["owner", "staff"],
    default: "owner"
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: false // No requerido inicialmente, se puede crear después
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  avatar: {
    type: String, // URL de la imagen de perfil
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Índices para optimizar consultas
userSchema.index({ email: 1 });
userSchema.index({ storeId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Método para verificar contraseña (se implementará con bcrypt)
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Este método se implementará en el controlador de autenticación
  // usando bcrypt.compare()
  return true; // Placeholder
};

// Método para obtener información pública del usuario
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    storeId: this.storeId,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    avatar: this.avatar,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Middleware pre-save para validaciones adicionales
userSchema.pre("save", function(next) {
  // Aquí se pueden agregar validaciones adicionales antes de guardar
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
