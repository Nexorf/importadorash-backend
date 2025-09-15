import {Router} from "express";
import ProductController from "../controllers/product.controller.js";
import verifyToken from "../middleware/auth.js";
import checkRole from "../middleware/roles.js";
import {uploadSingleImage} from "../middleware/upload.js";

const router = Router();

// Rutas Productos
router.get("/", ProductController.getProducts);
router.get("/id/:id", ProductController.getProductById);
router.get("/bysubcategory", ProductController.getProductBySubCategory);

router.post(
    "/",
    verifyToken,
    checkRole(["admin"]),
    uploadSingleImage,
    ProductController.createProduct
);

router.put(
    "/:id",
    verifyToken,
    checkRole(["admin"]),
    uploadSingleImage,          // <- para soportar multipart/form-data con imagen
    ProductController.updateProduct
);
router.delete("/:id", verifyToken, checkRole(['admin']), ProductController.deleteProduct);

export default router;   // 👈 exportación por defecto
