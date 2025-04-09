import express from 'express';
import { validate, verifyJWTProduct } from "@src/middleware";
import * as Validation from './validation';
import * as Handler from './product.handler';

const router = express.Router();

router.get('/categories', Handler.getAllCategoryHandler);
router.get('/query', validate(Validation.getManyProductDatasByIdSchema), Handler.getManyProductDatasByIdHandler);

export default router;