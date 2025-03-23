import express from "express";
import { validate, verifyJWT } from "@src/middleware";
import * as Validation from './validation';
import * as Handler from './wishlist.handler';

const router = express.Router();

router.put('/:id', verifyJWT, validate(Validation.updateWishlistSchema), Handler.updateWishlistHandlerV2);
router.delete('/items', verifyJWT, validate(Validation.removeProductFromWishlistSchema), Handler.removeProductFromWishlistHandlerV2);
router.delete('/:id', verifyJWT, validate(Validation.deleteWishlistSchema), Handler.deleteWishlistHandlerV2);
router.post('/items', verifyJWT, validate(Validation.addProductToWishlistSchema), Handler.addProductToWishlistHandlerV2);

export default router;