import Category from '../models/category.model.js';
import SubCategory from "../models/subcategory.model.js";
import Product from "../models/product.model.js";

const CategoryController = {

    getAllCategory: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                sort = 'id',
                order = 'asc',
                name,
                id,
                search
            } = req.query;


            // Construir objeto de filtros
            const filtros = {};

            // Filtro por nombre (búsqueda parcial)
            if (name) {
                filtros.name = {$regex: name, $options: 'i'}; // Case insensitive
            }

            if (id) {
                filtros.id = {$gte: Number(id)};
            }

            // Búsqueda general en múltiples campos
            if (search) {
                filtros.$or = [
                    {name: {$regex: search, $options: 'i'}},
                ];
            }

            // Configurar ordenamiento
            const sortOrder = order.toLowerCase() === 'desc' ? -1 : 1;
            const sortOptions = {[sort]: sortOrder};

            // Calcular paginación
            const skip = (page - 1) * limit;
            const total = await Category.countDocuments(filtros);


            const category = await Category.find(filtros)
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit))
                .select('-__v -_id');

            // Metadata de paginación
            const pagination = {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            };

            res.response.success(
                res,
                "PRODUCTOS",
                {
                    category,
                    pagination,
                    filtros: Object.keys(filtros).length > 0 ? filtros : undefined
                },
                {
                    total: category.length,
                    user: req.user ? {id: req.user.id, role: req.user.role} : null
                }
            );
        } catch (error) {
            res.response.serverError(res, 'Error al obtener categorias', error);
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({
                id: parseInt(req.params.id)
            })
            if (category) {
                res.response.success(res, 'CATEGORIA', category);
            } else {
                res.response.notFound(res, 'Categoria no encontrada', null);
            }
        } catch (error) {
            res.response.serverError(res, 'Error al obtener categorias', error);
        }
    },

    getTreeCategoriesAndSubCategories: async (req, res) => {
        try {
            const categories = await Category.find().sort({id: 1});

            const completeTree = await Promise.all(
                categories.map(async (category) => {

                    const subCategories = await SubCategory.find({
                        category_id: category.id
                    }).select('id name');

                    return {
                        _id: category._id,
                        id: category.id,
                        name: category.name,
                        sub_categories: subCategories
                    };
                })
            )


            res.response.success(res, 'ARBOL', completeTree);
        } catch (error) {
            res.response.serverError(res, 'Error al obtener arbol', error);
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
                        res.response.success(res, 'Categoria Creada', updatedCategory);
                    } else {
                        if (!categories) {
                            const newCategory = new Category(category);
                            await newCategory.save();
                            res.response.success(res, 'Categoria Creada', newCategory);

                        } else {
                            res.response.success(res, 'EL nombre de la categoria ya existe', null)
                        }
                    }
                } else {
                    res.response.success(res, 'EL nombre de la categoria ya existe', null)
                }

            }
        } catch (err) {
            res.response.serverError(res, 'Error al crear categorias', err);
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const catId = parseInt(req.params.id);
            const result = await Category.findOneAndDelete({id: catId})
            if (result) {
                const subs = await SubCategory.find({category_id: catId}).select('id');
                const subIds = subs.map(s => s.id);
                await SubCategory.deleteMany({category_id: catId});
                await Product.updateMany({subcategoria_id: {$in: subIds}}, {$set: {subcategoria_id: null}});
                res.response.success(res, 'Categoria eliminada', {
                    category: result,
                    removedSubcategories: subIds.length,
                })
            } else {
                res.response.notFound(res, 'Categoria no encontrada', null);
            }
        } catch (error) {
            res.response.serverError(res, 'Error al eliminar categoria', error);
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
                                        id: product.id,
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