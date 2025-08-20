import {Router} from "express";
import SubCategoryController from "../controllers/subcategory.controller.js";

const router = Router();


router.get('/', SubCategoryController.getAllSubCategory);
router.post('/', SubCategoryController.createSubCategory)
router.delete('/:id', SubCategoryController.deleteSubCategory);


export default router;