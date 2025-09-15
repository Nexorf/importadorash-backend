import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: Number,

    nombre: {type: String, required: [true, 'El nombre es obligatorio']},
    descripcion: String,
    descripcionDetallada: String,
    precio: {type: Number, required: [true, 'El precio es obligatorio']},
    subcategoria_id: Number,
    stock: {type: Number, default: 0},
    destacado: {type: Boolean, default: false},
    rating: Number,
    especificaciones: [String],
    marca: String,
    garantia: String,
    urlImagen: {
        type: String,
    },
    urlVideo: {
        type: String,
    },
    feature: Boolean,
    code: { type: String, unique: true, index: true, sparse: true },
    discount_pct: Number,
    cloudinaryId: { type: String }
}, {
    timestamps: true
});

// Middleware para asignar un ID automáticamente antes de guardar
productSchema.pre('save', async function (next) {
    if (!this.id) {
        const maxIdDoc = await this.constructor.findOne({}, {id: 1}, {sort: {id: -1}});
        this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);


export default Product;
