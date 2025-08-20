import {Router} from "express";
import ProductController from "../controllers/product.controller.js";
import verifyToken from "../middleware/auth.js";
import checkRole from "../middleware/roles.js";

const router = Router();

// Rutas CORREGIDAS
router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", ProductController.createProduct);
// router.put("/:id", ProductController.updateProduct);
router.delete("/:id", verifyToken, checkRole(['admin']), ProductController.deleteProduct);

export default router;   // 👈 exportación por defecto
