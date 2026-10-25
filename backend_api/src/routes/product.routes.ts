import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validateQuery, validateParams } from '../middleware/validate';
import {
  listProductsQuerySchema,
  productSlugParamSchema,
  checkStockParamSchema,
  checkStockQuerySchema,
} from '../validators/product.validator';

const router = Router();

// GET /api/v1/products - List published jackets with optional filtering & pagination
router.get('/', validateQuery(listProductsQuerySchema), productController.list);

// GET /api/v1/products/:id/check-stock - Real-time stock status check
router.get(
  '/:id/check-stock',
  validateParams(checkStockParamSchema),
  validateQuery(checkStockQuerySchema),
  productController.checkStock
);

// GET /api/v1/products/:slug - Full jacket details and photo gallery
router.get('/:slug', validateParams(productSlugParamSchema), productController.getBySlug);

export default router;
