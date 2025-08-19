import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
  descripcion: String,
  descripcionDetallada: String,
  precio: { type: Number, required: [true, 'El precio es obligatorio'] },
  subcategoria_id: Number,
  imagen: String,
  stock: { type: Number, default: 0 },
  destacado: { type: Boolean, default: false },
  rating: Number,
  especificaciones: [String],
  marca: String,
  garantia: String,
  images: [{
    type: String,
    validate: {
      validator: function(url) {
        return /^https?:\/\/.+\..+$/.test(url);
      },
      message: 'URL de imagen inválida'
    }
  }]
}, {
  timestamps: true
});

// Middleware para asignar un ID automáticamente antes de guardar
productSchema.pre('save', async function(next) {
  if (!this.id) {
    const maxIdDoc = await this.constructor.findOne({}, { id: 1 }, { sort: { id: -1 } });
    this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);


export default Product;
