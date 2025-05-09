import dotenv from "dotenv";
dotenv.config();

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";

import productRoutes from './product/product.routes'
import productRoutesV2 from './product/product.routes.v2'

import express_prom_bundle from "express-prom-bundle";
import pino from "pino";

const app: Express = express();

// Prometheus metrics middleware
const metricsMiddleware = express_prom_bundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  buckets: [0.001, 0.01, 0.1, 1, 2, 5, 10],
  customLabels: { project_name: 'marketplace-products' },
  promClient: {
    collectDefaultMetrics: {}
  }
});

// Asynchronous logging
const fs = require('fs');
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}
const logger = pino({
  formatters: {
    level: (label) => {
      return {
        level: label
      }
    }
  },
  transport: {
    target: 'pino/file',
    options: { destination: './logs/app.log' }
  }
});

// Middleware
app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/product", productRoutes);
app.use("/api/v2/products", productRoutesV2);

// Swagger UI
if (process.env.NODE_ENV == 'development') {
  const swaggerUI = require('swagger-ui-express');
  const swaggerDoc = require('./docs/swagger.json')
  app.use('/api-docs/', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
}

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Root endpoint
app.get('/', (_, res) => {
  res.status(200).json({
    message: 'Marketplace API',
    version: '1.0.0'
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Not Found',
    path: req.path
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

export default app;