import mongoose from 'mongoose';

const inventarioSchema = new mongoose.Schema({
  id: Number,
  producto: { type: String, required: true },
  productoId: Number, // Para compatibilidad
  nombre: String, // Para compatibilidad
  movimiento: { type: String, enum: ['Entrada', 'Salida'] },
  tipo: String, // Campo alternativo para movimiento
  cantidad: { type: Number, required: true },
  fecha: { type: mongoose.Schema.Types.Mixed, default: Date.now }, // Permite tanto string como Date
  motivo: String,
  ubicacion: String,
  ultimaActualizacion: { type: Date },
  alertaStockBajo: Number,
  proveedor: String
});

// Middleware para asignar un ID automáticamente antes de guardar
inventarioSchema.pre('save', async function(next) {
  if (!this.id) {
    const maxIdDoc = await this.constructor.findOne({}, { id: 1 }, { sort: { id: -1 } });
    this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
  }
  next();
});

const Inventario = mongoose.model('Inventario', inventarioSchema);

export default Inventario;