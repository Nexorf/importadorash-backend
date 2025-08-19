import Category from '../models/category.model.js';
import mongoose from 'mongoose';

const CategoryController = {

    getAllCategory: async (req, res) => {
        try {
            const category = await Category.find().sort({id: 1});
            res.json(category);
        } catch (err) {
            res.status(500).json({error: 'Error al obtener categorias'});
        }
    },

    getSubCategories: async (req, res) => {
        try {
            const { category_father_id } = req.params;

            // 1. Validar parámetro
            if (category_father_id === undefined) {
                return res.status(400).json({ error: 'Se requiere category_father_id' });
            }

            // 2. Crear filtro
            let filter;
            if (category_father_id === 'null' || category_father_id === '0') {
                filter = { category_father_id: null }; // Categorías raíz
            } else {
                // Validar que el ID sea un ObjectId válido
                if (!mongoose.Types.ObjectId.isValid(category_father_id)) {
                    return res.status(400).json({ error: 'ID de categoría inválido' });
                }
                filter = { category_father_id: new mongoose.Types.ObjectId(category_father_id) };
            }

            // 3. Buscar subcategorías (con populate opcional)
            const subCategories = await Category.find(filter)
                .populate({
                    path: 'category_father_id',
                    select: 'name' // Solo trae el nombre del padre
                });

            // 4. Verificar resultados
            if (!subCategories.length) {
                return res.status(200).json([]); // Array vacío si no hay coincidencias
            }

            res.status(200).json(subCategories);

        } catch (err) {
            console.error('Error en getSubCategories:', err);
            res.status(500).json({
                error: 'Error al obtener subcategorías',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    },


    createCategory: async (req, res) => {
        try{
            if(Array.isArray(req.body)) {
                await Category.deleteMany({});
                const category = await Category.insertMany(req.body);
                res.json(category);
            }else{
                const category = req.body;
                if(category.id) {
                    const updatedCategory = await Category.findOneAndUpdate(
                        {id: category.id},
                        category,
                        {new: true, upsert: true}
                    );
                    res.json({success: true, category: updatedCategory});
                }else{
                    const newCategory = new Category(category);
                    await newCategory.save();
                    res.json({success: true, category: newCategory});
                }
            }
        }catch(err){
            res.status(500).json({error: 'Error al obtener categorias'});
        }
    },

    /*

                // Si es un objeto, crear o actualizar un producto
                const producto = req.body;
                if (producto.id) {
                    // Actualizar producto existente
                    const updatedProducto = await Producto.findOneAndUpdate(
                        {id: producto.id},
                        producto,
                        {new: true, upsert: true}
                    );
                    res.json({success: true, producto: updatedProducto});
                } else {
                    // Crear nuevo producto
                    const newProducto = new Producto(producto);
                    await newProducto.save();
                    res.json({success: true, producto: newProducto});
                }
            }
        } catch (error) {
            console.error('Error al guardar productos:', error);
            res.status(500).json({error: 'Error al guardar productos'});
        }
     */

}

export default CategoryController;