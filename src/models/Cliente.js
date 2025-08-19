import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  id: Number,
  nombre: { type: String, required: true },
  apellido: String, // Opcional para compatibilidad
  email: { type: String, required: true, unique: true },
  telefono: String,
  direccion: String,
  ciudad: String,
  codigoPostal: String,
  compras: Number, // Número de compras realizadas
  total: Number, // Total gastado (campo antiguo)
  totalGastado: Number, // Total gastado (campo nuevo)
  historialCompras: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venta' }], // Para futuras referencias
  fechaRegistro: { type: Date, default: Date.now }
});

// Middleware para asignar un ID automáticamente antes de guardar
clienteSchema.pre('save', async function(next) {
  if (!this.id) {
    const maxIdDoc = await this.constructor.findOne({}, { id: 1 }, { sort: { id: -1 } });
    this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
  }
  next();
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;