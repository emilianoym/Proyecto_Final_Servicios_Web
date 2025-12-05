const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación de la API",
      version: "1.0.0",
      description: "Documentación con Swagger",
    },
    servers: [
      {
        url: "https://proyectofinalserviciosweb-production.up.railway.app",
        description: "Producción",
      },
      {
        url: "http://localhost:4000",
        description: "Local",
      }
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
