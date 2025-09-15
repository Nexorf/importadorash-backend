import {Router} from "express";
import CategoryController from "../controllers/category.controller.js";
import verifyToken from "../middleware/auth.js";
import checkRole from "../middleware/roles.js";

const router = Router();

router.get('/', CategoryController.getAllCategory)
router.get('/id/:id', CategoryController.getCategoryById)
router.get('/tree', CategoryController.getTreeCategoriesAndSubCategories)

router.post('/', verifyToken, checkRole(['admin']), CategoryController.createCategory);
router.delete('/:id', verifyToken, checkRole(['admin']), CategoryController.deleteCategory);

// router.get('/name/:name', CategoryController.getCategoryByName)
// router.get('/daughters/:id', CategoryController.getDaughtersCategoryById)
// router.get('/parent/:parentId', CategoryController.getSubCategories)

export default router;   // 👈 exportación por defecto