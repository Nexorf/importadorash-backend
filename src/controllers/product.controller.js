import Producto from "../models/product.model.js"
import SubCategory from "../models/subcategory.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

const ProductController = {
    getProducts: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                sort = 'id',
                order = 'asc',
                nombre,
                marca,
                code,
                precio,
                subcategoria_id,
                stock,
                discount_pct,
                search
            } = req.query;

            const filtros = {};

            // Filtro por nombre (búsqueda parcial)
            if (nombre) {
                filtros.nombre = {$regex: nombre, $options: 'i'};
            }
            if (marca) {
                filtros.marca = {$regex: marca, $options: 'i'};
            }
            if (code) {
                filtros.code = {$regex: code, $options: 'i'};
            }
            if (precio) {
                filtros.precio = {$gte: Number(precio)};
            }
            if (subcategoria_id) {
                filtros.subcategoria_id = {$gte: Number(subcategoria_id)};
            }
            if (stock) {
                filtros.stock = {$gte: Number(stock)};
            }
            if (discount_pct) {
                filtros.discount_pct = {$gte: Number(discount_pct)};
            }

            if (search) {
                filtros.$or = [
                    {nombre: {$regex: search, $options: 'i'}},
                    {marca: {$regex: search, $options: 'i'}},
                    {code: {$regex: search, $options: 'i'}},
                ];
            }
            // Configurar ordenamiento
            const sortOrder = order.toLowerCase() === 'desc' ? -1 : 1;
            const sortOptions = {[sort]: sortOrder};

            // Calcular paginación
            const skip = (page - 1) * limit;
            const total = await Product.countDocuments(filtros);

            const products = await Producto.find(filtros)
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit))
                .select('-__v -_id');

            const pagination = {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            };

            res.response.success(
                res, 'PRODUCTOS',
                {
                    products,
                    pagination,
                    filtros: Object.keys(filtros).length > 0 ? filtros : undefined
                },
                {
                    total: products.length,
                    user: req.user ? {id: req.user.id, role: req.user.role} : null
                }
            );
        } catch (error) {
            res.response.serverError(res, 'Error al obtener productos', error);
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

    getProductBySubCategory: async (req, res) => {
        try {

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

            const subCategory = await SubCategory.findOne(filtros);

            if (subCategory) {
                const products = await Product.find({
                    subcategoria_id: subCategory.id
                })

                res.response.success(res, subCategory.name, products);
            } else {
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
                    res.response.success(res, 'PRODUCTO ACTUALIZADO', updatedProducto);
                } else {
                    // Crear nuevo producto
                    const newProducto = new Producto(producto);
                    await newProducto.save();
                    res.response.success(res, 'PRODUCTO CREADO', newProducto);
                }
            }
        } catch (error) {
            res.response.serverError(res, 'Error al guardar productos', error);
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const result = await Producto.findOneAndDelete({id: parseInt(req.params.id)});
            if (result) {
                res.response.success(res, 'PRODUCTO ELIMINADO', null);
            } else {
                res.response.notFound(res, 'Producto no encontrado', null);
            }
        } catch (error) {
            res.response.serverError(res, 'Error al eliminar producto', error);
        }
    },


};
export default ProductController;