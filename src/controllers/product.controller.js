import Producto from "../models/product.model.js"
import Product from "../models/product.model.js"
import SubCategory from "../models/subcategory.model.js";
import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (buffer, folder = "productos") =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
        stream.end(buffer);
    });

const toNum = (v, d = undefined) =>
    v === "" || v === undefined || v === null ? d : Number(v);
const toBool = (v) => v === true || v === "true" || v === 1 || v === "1";

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
                    await Producto.deleteMany({});
                    const productos = await Producto.insertMany(req.body);
                    return res.json({ success: true, count: productos.length });
                }

                const raw = { ...req.body };


                console.log("CT:", req.headers["content-type"]);
                console.log("has file?", !!req.file, req.file?.originalname, req.file?.mimetype, req.file?.size);
                console.log("body keys:", Object.keys(req.body || {}));

                // 🛡️ Normalizador EN→ES. Prioriza ES si ya viene en ES.
                const producto = {
                    code: raw.code ?? raw.sku ?? undefined,

                    nombre: raw.nombre ?? raw.name ?? undefined,
                    descripcion: raw.descripcion ?? raw.description ?? "",
                    descripcionDetallada: raw.descripcionDetallada ?? raw.descriptionLong ?? undefined,

                    precio: raw.precio ?? raw.price,
                    stock: raw.stock,
                    discount_pct: raw.discount_pct ?? raw.discountPct,

                    subcategoria_id:
                        raw.subcategoria_id ?? raw.subcategoryId ?? raw.subCategoryId,
                    category_id:
                        raw.category_id ?? raw.categoryId ?? raw.categoria_id,

                    feature: raw.feature ?? raw.destacado ?? raw.featured,

                    urlImagen: raw.urlImagen ?? raw.imageUrl ?? "",
                    urlVideo: raw.urlVideo ?? raw.videoUrl ?? "",

                    marca: raw.marca ?? raw.brand,
                    garantia: raw.garantia ?? raw.warranty,
                    rating: raw.rating,
                    especificaciones: raw.especificaciones ?? raw.specs,
                };

                // 🔢 Coerciones
                producto.precio = toNum(producto.precio, undefined);
                producto.stock = toNum(producto.stock, 0);
                producto.discount_pct = toNum(producto.discount_pct, 0);
                if (producto.subcategoria_id !== undefined)
                    producto.subcategoria_id = toNum(producto.subcategoria_id, undefined);
                if (producto.category_id !== undefined)
                    producto.category_id = toNum(producto.category_id, undefined);
                producto.feature = toBool(producto.feature);

                // Limpieza de strings vacíos
                if (producto.urlImagen === "") delete producto.urlImagen;
                if (producto.urlVideo === "") delete producto.urlVideo;

                // 📤 Archivo (multer.memoryStorage)
                if (req.file?.buffer) {
                    const result = await uploadBufferToCloudinary(req.file.buffer, "productos");
                    producto.urlImagen = result.secure_url;
                    producto.cloudinaryId = result.public_id;
                }

                // 📦 Base64
                if (!producto.urlImagen && raw.imageBase64) {
                    let toUpload = raw.imageBase64;
                    if (!toUpload.startsWith("data:")) {
                        toUpload = `data:image/jpeg;base64,${toUpload}`;
                    }
                    const result = await cloudinary.uploader.upload(toUpload, {
                        folder: "productos",
                        resource_type: "image",
                    });
                    producto.urlImagen = result.secure_url;
                    producto.cloudinaryId = result.public_id;
                }

                // ✅ Validaciones mínimas (evita guardar basura)
                if (!producto.nombre)
                    return res.response.badRequest?.(res, "El nombre es obligatorio")
                        || res.status(400).json({ status: "error", message: "El nombre es obligatorio" });

                if (producto.precio === undefined || Number.isNaN(producto.precio))
                    return res.response.badRequest?.(res, "El precio es obligatorio")
                        || res.status(400).json({ status: "error", message: "El precio es obligatorio" });

                // 🚫 Evitar duplicados de SKU (code) de forma proactiva (además del índice único)
                if (producto.code) {
                    const exists = await Producto.findOne({ code: producto.code }).select({ _id: 1 }).lean();
                    if (exists) {
                        return res.response.badRequest?.(res, "El SKU ya existe")
                            || res.status(400).json({ status: "error", message: "El SKU ya existe" });
                    }
                }

                const nuevoProducto = new Producto(producto);
                await nuevoProducto.save();




                return res.response.success(res, "PRODUCTO CREADO", {
                    product: {
                        ...nuevoProducto.toObject(),
                        urlImagen: nuevoProducto.urlImagen,
                        cloudinaryId: nuevoProducto.cloudinaryId,
                    },
                });
            } catch (error) {
                console.error("CREATE_PRODUCT_ERROR:", {
                    message: error?.message,
                    name: error?.name,
                    code: error?.code,
                    keyPattern: error?.keyPattern,
                    errors: error?.errors,
                });

                // Duplicado por índice único
                if (error?.code === 11000 && (error?.keyPattern?.code || error?.keyValue?.code)) {
                    return res.response.badRequest?.(res, "El SKU ya existe")
                        || res.status(400).json({ status: "error", message: "El SKU ya existe" });
                }

                return res.response.serverError(res, "Error al guardar productos", error);
            }
        },

    updateProduct: async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (!id) return res.response.badRequest(res, "ID inválido");

            const existing = await Producto.findOne({ id });
            if (!existing) return res.response.notFound(res, "Producto no encontrado");

            const raw = { ...req.body };

            // Normalización EN/ES (solo setea lo que venga)
            const get = (a, b) => raw[a] ?? raw[b];

            const upd = {};
            if (get("code", "sku") !== undefined) upd.code = get("code", "sku");
            if (get("nombre", "name") !== undefined) upd.nombre = get("nombre", "name");
            if (get("descripcion", "description") !== undefined) upd.descripcion = get("descripcion", "description");
            if (get("descripcionDetallada", "descriptionLong") !== undefined) upd.descripcionDetallada = get("descripcionDetallada", "descriptionLong");
            if (get("precio", "price") !== undefined) upd.precio = toNum(get("precio", "price"), existing.precio);
            if (get("stock") !== undefined) upd.stock = toNum(get("stock"), existing.stock);
            if (get("discount_pct", "discountPct") !== undefined) upd.discount_pct = toNum(get("discount_pct", "discountPct"), existing.discount_pct);
            if (get("subcategoria_id", "subcategoryId") !== undefined) upd.subcategoria_id = toNum(get("subcategoria_id", "subcategoryId"), existing.subcategoria_id);
            if (get("category_id", "categoryId") !== undefined) upd.category_id = toNum(get("category_id", "categoryId"), existing.category_id);
            if (get("feature", "featured") !== undefined) upd.feature = toBool(get("feature", "featured"));
            if (get("marca", "brand") !== undefined) upd.marca = get("marca", "brand");
            if (get("garantia", "warranty") !== undefined) upd.garantia = get("garantia", "warranty");
            if (get("urlVideo", "videoUrl") !== undefined) upd.urlVideo = get("urlVideo", "videoUrl");
            if (get("urlImagen", "imageUrl") !== undefined) upd.urlImagen = get("urlImagen", "imageUrl");

            // Imagen nueva (multipart con multer)
            if (req.file?.buffer) {
                const result = await uploadBufferToCloudinary(req.file.buffer, "productos");
                upd.urlImagen = result.secure_url;
                upd.cloudinaryId = result.public_id;

                // Limpia la imagen anterior si existía
                if (existing.cloudinaryId) {
                    try { await cloudinary.uploader.destroy(existing.cloudinaryId); } catch {}
                }
            }

            // Unicidad de SKU si lo cambian
            if (upd.code && upd.code !== existing.code) {
                const dup = await Producto.findOne({ code: upd.code }).select({ _id: 1 }).lean();
                if (dup) return res.response.badRequest(res, "El SKU ya existe");
            }

            const updated = await Producto.findOneAndUpdate(
                { id },
                { $set: upd },
                { new: true }
            ).select('-__v -_id');

            return res.response.success(res, "PRODUCTO ACTUALIZADO", { product: updated });
        } catch (error) {
            return res.response.serverError(res, "Error al actualizar producto", error);
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const result = await Producto.findOneAndDelete({id: parseInt(req.params.id)});
            if (result) {
                if (result?.cloudinaryId) {
                    await cloudinary.uploader.destroy(result.cloudinaryId);
                }
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