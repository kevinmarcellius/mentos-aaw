import dotenv from "dotenv";
dotenv.config();

import swaggerAutogen from 'swagger-autogen';

const PORT = process.env.PORT || 8000;

const doc = {
  info: {
    title: 'Marketplace Wishlist API',
    description: 'AAW Marketplace Assignment API Docs.'
  },
  host: `localhost:${PORT}`,
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: "Enter JWT as: Bearer <generated_token>"
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = './swagger.json';
const routes = ['../server.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc).then(() => {
  require('../server.ts');
});