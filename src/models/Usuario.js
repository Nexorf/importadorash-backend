import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  id: Number,
  usuario: { type: String, required: true, unique: true },
  password: { type: String },
  contraseña: { type: String },
  email: { type: String, required: true, unique: true },
  nombre: String,
  apellido: String,
  telefono: String,
  estado: String,
  ultimoAcceso: String,
  // Campos adicionales para usuarios con rol Cliente
  direccion: String,
  ciudad: String,
  codigoPostal: String,
  compras: Number, // Número de compras realizadas
  total: Number, // Total gastado (campo antiguo)
  totalGastado: Number, // Total gastado (campo nuevo)
  historialCompras: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venta' }], // Referencias a ventas
  rol: { type: String, enum: ['Admin', 'Administrador', 'Cliente'], default: 'Cliente' },
  fechaRegistro: { type: Date, default: Date.now }
});

// Middleware para asignar un ID automáticamente antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.id) {
    const maxIdDoc = await this.constructor.findOne({}, { id: 1 }, { sort: { id: -1 } });
    this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
  }
  next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;