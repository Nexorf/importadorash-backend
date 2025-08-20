import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: [true, 'Please enter a name'],
        trim: true,
    },
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para asignar un ID automáticamente antes de guardar
categorySchema.pre('save', async function (next) {
    if (!this.id) {
        const maxIdDoc = await this.constructor.findOne({}, { id: 1 }, { sort: { id: -1 } });
        this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
    }
    next();
});

// Modelos
const Category = mongoose.model('Category ', categorySchema);

export default Category;
