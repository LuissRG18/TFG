const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede superar los 50 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no tiene un formato válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    rol: {
      type: String,
      enum: ['usuario', 'admin'],
      default: 'usuario',
    },
    areasInteres: {
      type: [String],
      default: [],
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash de contraseña antes de guardar
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Métodoo para comparar contraseñas
userSchema.methods.compararPassword = async function (passwordIntroducida) {
  return await bcrypt.compare(passwordIntroducida, this.password);
};

module.exports = mongoose.model('User', userSchema);

