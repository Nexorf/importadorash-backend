import {Router} from "express";
import CategoryController from "../controllers/category.controller.js";

const router = Router();

router.get('/', CategoryController.getAllCategory)
router.get('/id/:id', CategoryController.getCategoryById)
router.get('/name/:name', CategoryController.getCategoryByName)
router.get('/daughters/:id', CategoryController.getDaughtersCategoryById)
router.get('/tree', CategoryController.getTreeCategories)


router.post('/', CategoryController.createCategory);
router.delete('/:id', CategoryController.deleteCategory);

// router.get('/parent/:parentId', CategoryController.getSubCategories)

export default router;   // 👈 exportación por defecto

/**
 * @openapi
 * tags:
 *   name: Category
 *   description: API para gestionar categorias
 *
 * /api/category:
 *  get:
 *     summary: Obtener todos las categorias
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *
 *  post:
 *    summary: Crear Categoria
 *    tags: [Category]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *       201:
 *         description: category creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de entrada inválidos
 *
 * /api/category/parent/{parentId}:
 *   get:
 *     summary: Obtener subcategorías por ID de categoría padre
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: parentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría padre
 *     responses:
 *       200:
 *         description: Lista de subcategorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       404:
 *         description: No se encontraron subcategorías
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Electronica"
 */

