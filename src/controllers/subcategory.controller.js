import SubCategory from '../models/subcategory.model.js';
import Product from '../models/product.model.js';
import Category from "../models/category.model.js";


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
    }
}
/*
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
export default SubcategoryController;