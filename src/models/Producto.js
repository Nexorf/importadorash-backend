import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  id: Number,
  nombre: { type: String, required: true },
  descripcion: String,
  descripcionDetallada: String,
  precio: { type: Number, required: true },
  categoria: String,
  imagen: String,
  stock: { type: Number, default: 0 },
  destacado: { type: Boolean, default: false },
  rating: Number,
  especificaciones: [String],
  marca: String,
  garantia: String,
  fechaCreacion: { type: Date, default: Date.now }
});

// Middleware para asignar un ID automáticamente antes de guardar
productoSchema.pre('save', async function(next) {
  if (!this.id) {
    const maxIdDoc = await this.constructor.findOne({}, { id: 1 }, { sort: { id: -1 } });
    this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
  }
  next();
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;