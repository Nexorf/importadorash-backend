import express from "express";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";

const app = express();

app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📖 Swagger listo en http://localhost:${PORT}/api-docs`);
});
