const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Flower E-Commerce API Documentation",
      version: "1.0.0",
      description: "Tài liệu API hệ thống Backend Thương mại Điện tử Hoa tươi (NodeJS-Core)",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Server phát triển cục bộ (Local Development)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./swagger/*.yaml", "./routes/*.js", "./modules/**/*.js"],
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = {
  swaggerUIServe: swaggerUi.serve,
  swaggerUISetup: swaggerUi.setup(openapiSpecification),
};