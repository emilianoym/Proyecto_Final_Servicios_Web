const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Documentación de la API',
    version: '1.0.0',
    description: 'Documentación de la API con Swagger',
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Servidor de desarrollo',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Setup Swagger UI
function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
