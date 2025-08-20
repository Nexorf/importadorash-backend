import Producto from "../models/product.model.js"
import SubCategory from "../models/subcategory.model.js";
import Product from "../models/product.model.js";

const ProductController = {
    getProducts: async (req, res) => {
        try {
            const productos = await Producto.find().sort({id: 1});
            res.response.success(res, 'PRODUCTOS', productos);
        } catch (error) {
            res.response.serverError(res, 'Error al obtener productos', error);
        }
    },

    getProductBySubCategoryName: async (req, res) => {
        try {
            const subCategory = await SubCategory.findOne({
                name: req.params.name
            })
            if(subCategory){
                const products = await Product.find({
                    subcategoria_id: subCategory.id
                })

                res.response.success(res, subCategory.name, products);
            }else{
                res.response.notFound(res, 'SubCategoria no encontrada', null);
            }

        } catch (error) {
            res.response.serverError(res, 'Error al obtener productos', error);
        }
    },

    createProduct: async (req, res) => {
        try {
            if (Array.isArray(req.body)) {
                // Si es un array, reemplazar todos los productos
                await Producto.deleteMany({});
                const productos = await Producto.insertMany(req.body);
                res.json({success: true, count: productos.length});
            } else {
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
    },

    getProductById: async (req, res) => {
        try {
            const producto = await Producto.findOne({id: parseInt(req.params.id)});
            if (producto) {
                res.response.success(res, "PRODUCTOS", producto);
            } else {
                res.response.notFound(res, 'Producto no encontrado', null);
            }
        } catch (error) {
            res.response.serverError(res, 'Error al obtener productos', error);
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const result = await Producto.findOneAndDelete({id: parseInt(req.params.id)});
            if (result) {
                res.json({success: true});
            } else {
                res.status(404).json({error: 'Producto no encontrado'});
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({error: 'Error al eliminar producto'});
        }
    },


};
export default ProductController;