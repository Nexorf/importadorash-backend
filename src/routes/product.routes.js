import {Router} from "express";
import ProductController from "../controllers/product.controller.js";


const router = Router();
/**
 * @openapi
 * tags:
 *   name: Products
 *   description: API para gestionar productos
 *
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de entrada inválidos
 *
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Laptop Pro"
 *         descripcion:
 *           type: string
 *           example: "Una laptop potente"
 *         precio:
 *           type: number
 *           example: 1200
 *         categoria:
 *           type: string
 *           example: "Electrónicos"
 *         stock:
 *           type: number
 *           example: 10
 *         destacado:
 *           type: boolean
 *           example: true
 *         rating:
 *           type: number
 *           example: 4.5
 *         especificaciones:
 *           type: array
 *           items:
 *             type: string
 *           example: ["8GB RAM", "SSD 256GB"]
 *         marca:
 *           type: string
 *           example: "TechBrand"
 *         garantia:
 *           type: string
 *           example: "2 años"
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 */

// Rutas CORREGIDAS
router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", ProductController.createProduct);  // Cambiado a router.post
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);


// Definición del esquema Product (debería estar en otra parte de tu doc OpenAPI)
/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Laptop Pro"
 *         descripcion:
 *           type: string
 *           example: "Una laptop potente"
 *         precio:
 *           type: number
 *           example: 1200
 *         stock:
 *           type: number
 *           example: 10
 *         destacado:
 *           type: boolean
 *           example: true
 */

export default router;   // 👈 exportación por defecto


//const express = require("express");
//const { getProducts, createProduct } = require("../controllers/product.controller");
//const validateProduct = require("../middlewares/validateProduct");
//
//const router = express.Router();
//

//router.get("/", getProducts);
//router.post("/", validateProduct, createProduct); // 👈 Middleware antes del controlador
//
//module.exports = router;
