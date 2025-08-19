import SubCategory from '../models/subcategory.model.js';


const SubcategoryController = {

    getAllSubCategory: async (req, res) => {
        try {
            const subcategory = await SubCategory.find().sort({id: 1});
            res.json(subcategory);

        } catch (err) {
            res.status(500).json({error: 'Error al obtener categorias'});
        }
    },

    createSubCategory: async (req, res) => {
        try {
            if (Array.isArray(req.body)) {
                await SubCategory.deleteMany({});
                const subcategory = await SubCategory.insertMany(req.body);
                res.json(subcategory);
            } else {
                const subCategory = req.body;
                // const subCategories = await SubCategory.findOne({
                //     name: subCategory.name
                // })
                if (subCategory.id) {
                    const updatesubCategory = await SubCategory.findOneAndUpdate(
                        {id: subCategory.id},
                        subCategory,
                        {new: true, upsert: true},
                    );
                    res.json({success: true, subCategory: updatesubCategory});
                } else {
                    const newSubCategory = new SubCategory(subCategory);
                    await newSubCategory.save();
                    res.json({success: true, SubCategory: newSubCategory});
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Error al obtener categorias'});
        }
    },

    deleteSubCategory: async (req, res) => {
        try{
            const result= await SubCategory.findOneAndDelete({
                id: parseInt(req.params.id)
            })
            if(result){
                res.json({success: true})
            }else{
                res.status(404).json({error: 'subcategoria no encontrada'});
            }

        } catch (error) {
            console.error('Error al eliminar la subcategoria:', error);
            res.status(500).json({error: 'Error al eliminar la subcategoria'});
        }
    },


    /*
        getAllSubCategories: async function (req, res) {
            try {
                const subcategories = await SubCategory.find();
                res.status(200).json(subcategories);

            } catch (err) {
                res.status(500).json({error: 'Error al obtener subcategory'});
            }
        },

        createSubCategories: async function (req, res) {
            try {
                const {name, category} = req.body;

                // Validaciones básicas
                if (!name || !category) {
                    return res.status(400).json({
                        error: 'Nombre y categoría son obligatorios'
                    });
                }

                // Verificar que la categoría exista
                const categoryExists = await Category.findById(category);
                if (!categoryExists) {

                    return res.status(404).json({
                        error: 'La categoría especificada no existe'
                    });
                }

                // Verificar si ya existe la subcategoría en esta categoría
                const existingSubCategory = await SubCategory.findOne({
                    name: name.trim(),
                    category: category
                });

                if (existingSubCategory) {
                    return res.status(409).json({
                        error: 'Ya existe una subcategoría con este nombre en la categoría especificada'
                    });
                }

                // Crear nueva subcategoría
                const newSubCategory = new SubCategory({
                    name: name.trim(),
                    category: category
                });

                await newSubCategory.save();

                // Populate para devolver datos completos
                await newSubCategory.populate('category', 'name');

                res.status(201).json({
                    success: true,
                    message: 'Subcategoría creada exitosamente',
                    data: newSubCategory
                });

            } catch (err) {
                console.error('Error en createSubCategory:', err);

                if (err.name === 'ValidationError') {
                    const errors = Object.values(err.errors).map(e => e.message);
                    return res.status(400).json({errors});
                }

                res.status(500).json({
                    error: 'Error interno del servidor al crear subcategoría',
                    details: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }
        }
    */
}

export default SubcategoryController;