import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: [true, 'El nombre de la subcategoría es obligatorio'],
        trim: true,
    },
    category_id: Number,
}, {
    timestamps: true
});

subCategorySchema.index({ category: 1 });

// Middleware para asignar un ID automáticamente antes de guardar
subCategorySchema.pre('save', async function (next) {
    if (!this.id) {
        const maxIdDoc = await this.constructor.findOne({}, { id: 1 }, { sort: { id: -1 } });
        this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
    }
    next();
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;