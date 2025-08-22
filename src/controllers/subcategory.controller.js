import SubCategory from '../models/subcategory.model.js';
import Category from "../models/category.model.js";


const SubcategoryController = {

    getSubCategory: async (req, res) => {
        try{
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
            const total = await SubCategory.countDocuments(filtros);

            const subCategory = await SubCategory.find(filtros)
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
                "SUB CATEGORIAS",
                {
                    subCategory,
                    pagination,
                    filtros: Object.keys(filtros).length > 0 ? filtros : undefined
                },
                {
                    total: subCategory.length,
                    user: req.user ? {id: req.user.id, role: req.user.role} : null
                }
            );

        }catch(err){
            res.response.serverError(res, 'Error al obtener sub categoria', err);
        }
    },

    getSubCategoryById: async (req, res) => {
        try{
            const subCategory = await SubCategory.findOne({
                id: parseInt(req.params.id)
            })
            if(subCategory){
                res.response.success(res, 'SUBCATEGORIA', subCategory);

            }else{
                res.response.notFound(res, 'Sub Categoria no encontrada', null);
            }

        }catch(err){
            res.response.serverError(res, 'Error al obtener sub categoria', err);
        }
    },

    getSubCategoryByCategory: async (req, res) => {
        try{
            const {
                name,
                id, search
            } = req.query;

            const filtros = {};

            if (name) {
                filtros.name = {$regex: name, $options: 'i'};
            }
            if (id) {
                filtros.id = {$gte: Number(id)};
            }

            if (search) {
                filtros.$or = [
                    {name: {$regex: search, $options: 'i'}},
                ];
            }

            const category = await Category.findOne(filtros);

            if(category){
                const subCategory = await SubCategory.find({
                    category_id: category.id
                })
                res.response.success(res, category.name, subCategory);

            }else{
                res.response.notFound(res, 'Categoria no encontrada', null);

            }
        }catch(err){
            res.response.serverError(res, 'Error al obtener sub categoria', err);
        }

    },

    createSubCategory: async (req, res) => {
        try{
            if (Array.isArray(req.body)) {
                await SubCategory.deleteMany({});
                const subcategory = await SubCategory.insertMany(req.body);
                res.json(subcategory);
            } else {
                const subCategory = req.body;
                if (subCategory.id) {
                    const updatesubCategory = await SubCategory.findOneAndUpdate(
                        {id: subCategory.id},
                        subCategory,
                        {new: true, upsert: true},
                    );

                    res.response.success(res, 'SUB CATEGORIA ACTUALIZADA', updatesubCategory);

                } else {
                    const newSubCategory = new SubCategory(subCategory);
                    await newSubCategory.save();
                    res.response.success(res, 'SUB CATEGORIA CREADA', newSubCategory);

                }
            }
        }catch(err){
            res.response.serverError(res, 'Error al crear sub categoria', err);
        }
    },

    deleteSubCategory: async (req, res) => {
        try{
            const result= await SubCategory.findOneAndDelete({
                id: parseInt(req.params.id)
            })
            if(result){
                res.response.success(res, 'SUB CATEGORIA ELIMINADA', null);
            }else{
                res.response.notFound(res, 'Subcategoria no encontrada', null);
            }
        }catch(err){
            res.response.serverError(res, 'Error al eliminar sub categoria', err);
        }
    },

}
export default SubcategoryController;
    /*
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

        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Error al obtener categorias'});
        }
    },

    deleteSubCategory: async (req, res) => {
        try{


        } catch (error) {
            console.error('Error al eliminar la subcategoria:', error);
            res.status(500).json({error: 'Error al eliminar la subcategoria'});
        }
    },

    getDaughtersProductsById : async (req, res) => {
        try {
            const products = await Product.find({
                subcategoria_id: parseInt(req.params.id)
            })
            if(products){
                res.response.success(res,"SUB CATEGORIA CON HIJOS", products);
            }else{
                res.response.notFound(res,"NO INFORMACION", null);
            }

        } catch (error) {
            res.response.serverError(res,null,null)
        }
    },

    getSubCategoriesByNameCategory : async (req, res) => {
        try{

            const category = await Category.findOne({
                name: req.params.name
            })
            if(category){
                const subCategory= await SubCategory.find({
                    category_id: category.id
                })
                res.response.success(res,category.name,subCategory );
            }


            // if(subCategory){
            //     res.json(subCategory);
            // }
            //Electronica
        } catch (error) {
            res.response.serverError(res, 'Error al obtener la Sub categorias', error);
        }
    },

    getDaughtersCategory: async (req, res) => {
        try {
            const {
                name,
                id, search
            } = req.query;

            if (name) {
                filtros.name = {$regex: name, $options: 'i'};
            }
            if (id) {
                filtros.id = {$gte: Number(id)};
            }

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

}

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

    },
 */
