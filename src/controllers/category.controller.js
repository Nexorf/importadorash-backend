import Category from '../models/category.model.js';
import SubCategory from "../models/subcategory.model.js";
import Producto from "../models/product.model.js";
import Product from "../models/product.model.js";

const CategoryController = {

    getAllCategory: async (req, res) => {
        try {
            const category = await Category.find().sort({id: 1});
            res.json(category);
        } catch (err) {
            res.status(500).json({error: 'Error al obtener categorias'});
        }
    },

    createCategory: async (req, res) => {
        try {
            if (Array.isArray(req.body)) {
                await Category.deleteMany({});
                const category = await Category.insertMany(req.body);
                res.json(category);
            } else {
                const category = req.body;
                const categories = await Category.findOne({
                    name: category.name
                })
                if (!categories) {
                    if (category.id) {
                        const updatedCategory = await Category.findOneAndUpdate(
                            {id: category.id},
                            category,
                            {new: true, upsert: true}
                        );
                        res.json({success: true, category: updatedCategory});
                    } else {
                        if (!categories) {
                            console.error('Categoria no existe');
                            const newCategory = new Category(category);
                            await newCategory.save();
                            res.json({success: true, category: newCategory});

                        } else {
                            res.json({error: 'EL nombre de la categoria ya existe'});
                        }
                    }
                } else {
                    res.json({error: 'EL nombre de la categoria ya existe'});
                }

            }
        } catch (err) {
            res.status(500).json({error: 'Error al obtener categorias'});
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({
                id: parseInt(req.params.id)
            })
            if (category) {
                res.json(category);
            } else {
                res.status(404).json({error: 'categoria no encontrada'});
            }
        } catch (error) {
            console.error('Error al obtener categoria:', error);
            res.status(500).json({error: 'Error al obtener categoria'});
        }
    },
    getCategoryByName: async (req, res) => {
        try {
            const category = await Category.findOne({
                name: req.params.name
            })
            if (category) {
                res.json(category);
            } else {
                res.status(404).json({error: 'categoria no encontrada'});
            }
        } catch (error) {
            console.error('Error al obtener categoria:', error);
            res.status(500).json({error: 'Error al obtener categoria'});
        }
    },
    getDaughtersCategoryById: async (req, res) => {
        try {
            const subCategory = await SubCategory.find({
                category_id: parseInt(req.params.id)
            })
            if (subCategory) {
                res.json(subCategory);
            } else {
                res.status(404).json({error: 'Subcategoria no encontrada'});
            }
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({error: 'Error al obtener producto'});
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const result = await Category.findOneAndDelete({
                id: parseInt(req.params.id)
            })
            if (result) {
                res.json({success: true});
            } else {
                res.status(404).json({error: 'categoria no encontrada'});
            }
        } catch (error) {
            console.error('Error al eliminar categoria:', error);
            res.status(500).json({error: 'Error al eliminar categoria'});
        }
    },

    getTreeCategories: async (req, res) => {
        try {
            const categories = await Category.find().sort({id: 1});

            const completeTree = await Promise.all(
                categories.map(async (category) => {
                    // Obtener subcategorías de esta categoría
                    const subCategories = await SubCategory.find({
                        category_id: category.id
                    }).select('name id');


                    console.log(subCategories)

                    // Obtener productos para cada subcategoría
                    const subCategoriesWithProducts = await Promise.all(
                        subCategories.map(async (subCategory) => {
                            const products = await Product.find({
                                subcategoria_id: subCategory.id
                            }).select('id nombre precio ');



                            return {
                                id: subCategory.id,
                                name: subCategory.name,
                                products: products.map(
                                    product => ({
                                        id:product.id,
                                        name: product.nombre,
                                        precio: product.precio,
                                    })
                                )
                            };


                        }))


                    return {
                        id: category.id,
                        name: category.name,
                        sub_categories: subCategoriesWithProducts
                    };
                })

                //
                //

                //

                //
                //             })
                //         );
            );

            res.json({
                success: true,
                message: 'Árbol completo obtenido exitosamente',
                data: completeTree
            });

        } catch (error) {
            console.error('Error al obtener árbol completo:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener el árbol completo'
            });
        }
    }
}


export default CategoryController;
/*
            // Obtener subcategorías para cada categoría
            const categoriesWithSubs = await Promise.all(
                categories.map(async (category) => {
                    const subCategories = await SubCategory.find({
                        category: category._id
                    }).select('name id'); // Solo los campos necesarios

                    return {
                        id: category.id,
                        name: category.name,
                        sub_categories: subCategories.map(sub => ({
                            id: sub.id,
                            name: sub.name
                        }))
                    };
                })
            );

            res.json({
                success: true,
                message: 'Árbol de categorías obtenido exitosamente',
                count: categoriesWithSubs.length,
                data: categoriesWithSubs
            });

        } catch (error) {
            console.error('Error al obtener árbol de categorías:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener el árbol de categorías'
            });
        }
    }*/

/*
getTreeCategories: async (req, res) => {
    try {
        const category = await Category.find().sort({id: 1});

        const subCategory = await SubCategory.find({category_id: category.id})

        const transformedData = category.map(category => ({
            id: category.id,
            name: category.name,
            sub_category: [{}],
        }));

        res.json({
            status: 'success',
            results: transformedData.length,
            data: {
                categorias: transformedData
            },
            metadata: {
                version: '1.0',
                requestId: req.requestId || Math.random().toString(36).substr(2, 9)
            }
        });


        // res.json({
        //     success: true,
        //     message: 'Categorías obtenidas exitosamente',
        //     count: category.length,
        //     timestamp: new Date().toISOString(),
        //     data: category
        // });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({error: 'Error al obtener productos'});
    }
}*/


