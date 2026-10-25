import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { sendSuccess } from '../utils/response';
import { ListProductsQuery, CheckStockQuery } from '../validators/product.validator';

export class ProductController {
  /**
   * GET /api/v1/products
   * List published jackets with optional filtering and pagination.
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as ListProductsQuery;
      const result = await productService.listProducts(query);

      sendSuccess(res, {
        statusCode: 200,
        message: 'Products retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/products/:slug
   * Retrieve full product details, photo gallery, and variants by slug.
   */
  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const product = await productService.getProductBySlug(slug);

      sendSuccess(res, {
        statusCode: 200,
        message: 'Product retrieved successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/products/:id/check-stock
   * Real-time stock verification for a product or its variants.
   */
  async checkStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const query = req.query as unknown as CheckStockQuery;
      const stock = await productService.checkStock(id, query);

      sendSuccess(res, {
        statusCode: 200,
        message: 'Stock status retrieved successfully',
        data: stock,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
