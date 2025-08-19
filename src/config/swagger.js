import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Productos",
      version: "1.0.0",
      description: "Documentación de la API con Swagger por nexorf",
    },
  },
  apis: ["./src/routes/*.js"], // donde tienes tus rutas documentadas
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
