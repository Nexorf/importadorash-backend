import {Router} from "express";
import ProductController from "../controllers/product.controller.js";
import verifyToken from "../middleware/auth.js";
import checkRole from "../middleware/roles.js";

const router = Router();

// Rutas Productos
router.get("/", ProductController.getProducts);
router.get("/id/:id", ProductController.getProductById);
router.get("/bysubcategory", ProductController.getProductBySubCategory);

router.post("/", verifyToken, checkRole(['admin']), ProductController.createProduct);
router.delete("/:id", verifyToken, checkRole(['admin']), ProductController.deleteProduct);

export default router;   // 👈 exportación por defecto
