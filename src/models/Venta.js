import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
  id: Number,
  cliente: { 
    type: mongoose.Schema.Types.Mixed, // Permite tanto string como objeto
    required: true
  },
  productos: {
    type: [{
      id: { type: Number, required: true },
      nombre: { type: String, required: true },
      cantidad: { type: Number, default: 1 },
      precioUnitario: { type: Number, required: true },
      precio: Number, // Para compatibilidad
      subtotal: Number // Opcional
    }],
    validate: {
      validator: function(productos) {
        return productos && productos.length > 0;
      },
      message: 'La venta debe tener al menos un producto'
    },
    required: true
  },
  total: { type: Number, required: true },
  fecha: { type: mongoose.Schema.Types.Mixed, default: Date.now }, // Permite tanto string como Date
  estado: { 
    type: String, 
    enum: ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado', 'Completada'], 
    default: 'Pendiente' 
  },
  numeroSeguimiento: { type: String, unique: true, sparse: true }, // sparse permite valores nulos/undefined
  direccionEnvio: String,
  metodoPago: String
});

// Middleware para asignar un ID y número de seguimiento automáticamente antes de guardar
ventaSchema.pre('save', async function(next) {
  try {
    // Asignar ID si no existe
    if (!this.id) {
      const maxIdDoc = await this.constructor.findOne({}, { id: 1 }, { sort: { id: -1 } });
      this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
    }
    
    // Asignar número de seguimiento si no existe
    if (!this.numeroSeguimiento) {
      const count = await this.constructor.countDocuments();
      this.numeroSeguimiento = `BM${100000 + count + 1}`;
    }
    
    // Asegurar que el campo total sea un número
    if (typeof this.total !== 'number') {
      this.total = parseFloat(this.total) || 0;
    }
    
    // Asegurar que los productos tengan los campos requeridos
    if (this.productos && Array.isArray(this.productos)) {
      this.productos = this.productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad || 1,
        precioUnitario: p.precioUnitario || p.precio || 0,
        precio: p.precio || p.precioUnitario || 0
      }));
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

const Venta = mongoose.model('Venta', ventaSchema);

export default Venta;