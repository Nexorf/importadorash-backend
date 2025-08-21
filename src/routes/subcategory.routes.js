import {Router} from "express";
import SubCategoryController from "../controllers/subcategory.controller.js";
import verifyToken from "../middleware/auth.js";
import checkRole from "../middleware/roles.js";

const router = Router();


router.get('/', SubCategoryController.getSubCategory);
router.get('/id/:id', SubCategoryController.getSubCategoryById);
router.get('/bycategory', SubCategoryController.getSubCategoryByCategory);
router.post('/', verifyToken, checkRole(['admin']), SubCategoryController.createSubCategory)
router.delete('/:id', verifyToken, checkRole(['admin']), SubCategoryController.deleteSubCategory);


// router.get('/daughters/:id', SubCategoryController.getDaughtersProductsById);
// router.get('/bynamecategory/:name', SubCategoryController.getSubCategoriesByNameCategory);


export default router;