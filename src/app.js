import express from "express";
import connectDB from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subcategory.routes.js";
import authRoutes from "./routes/auth.routes.js";
import {responseMiddleware} from "./utils/responsehandler.js";


const app = express();

app.use(express.json());

app.use(responseMiddleware)

// Conexión a MongoDB
connectDB();

// Rutas
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/subcategory", subCategoryRoutes);
app.use("/api/v1/auth", authRoutes);

// Swagger
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📖 Swagger listo en http://localhost:${PORT}/api-docs`);
});
