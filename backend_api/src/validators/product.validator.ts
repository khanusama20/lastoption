import { z } from 'zod';

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(50, 'Limit cannot exceed 50').default(12),
  category: z
    .enum(['bomber', 'field', 'parka', 'overcoat'], {
      errorMap: () => ({ message: 'Category must be one of: bomber, field, parka, overcoat' }),
    })
    .optional(),
  size: z
    .enum(['S', 'M', 'L', 'XL', 'XXL'], {
      errorMap: () => ({ message: 'Size must be one of: S, M, L, XL, XXL' }),
    })
    .optional(),
  color: z.string().trim().max(50, 'Color filter cannot exceed 50 characters').optional(),
  sort: z
    .enum(['newest', 'featured', 'price_asc', 'price_desc', 'price-low-to-high', 'price-high-to-low'], {
      errorMap: () => ({ message: 'Invalid sort option' }),
    })
    .optional(),
  inStock: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        const lower = val.trim().toLowerCase();
        if (lower === 'true' || lower === '1') return true;
        if (lower === 'false' || lower === '0') return false;
      }
      return val;
    }, z.boolean({ invalid_type_error: 'inStock must be a boolean' }).optional())
    .optional(),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export const productSlugParamSchema = z.object({
  slug: z.string().trim().min(1, 'Product slug is required').max(255, 'Product slug is too long'),
});

export type ProductSlugParam = z.infer<typeof productSlugParamSchema>;

export const checkStockParamSchema = z.object({
  id: z.string().uuid('Invalid product ID format. Expected a valid UUID.'),
});

export type CheckStockParam = z.infer<typeof checkStockParamSchema>;

export const checkStockQuerySchema = z.object({
  variantId: z.string().uuid('Invalid variant ID format. Expected a valid UUID.').optional(),
  sku: z.string().trim().max(100).optional(),
  size: z
    .enum(['S', 'M', 'L', 'XL', 'XXL'], {
      errorMap: () => ({ message: 'Size must be one of: S, M, L, XL, XXL' }),
    })
    .optional(),
  color: z.string().trim().max(50).optional(),
});

export type CheckStockQuery = z.infer<typeof checkStockQuerySchema>;
