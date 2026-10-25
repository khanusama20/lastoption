import { Prisma, Product, ProductImage, ProductVariant } from '@prisma/client';
import { prisma } from '../config/prisma';
import { HttpError } from '../utils/errors';
import { ListProductsQuery, CheckStockQuery } from '../validators/product.validator';
import {
  ProductSummaryResponse,
  ProductDetailResponse,
  ProductImageResponse,
  ProductVariantResponse,
  ListProductsResponse,
  ProductStockResponse,
  VariantStockStatus,
} from '../types/product.types';

type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
};

function formatImage(img: ProductImage): ProductImageResponse {
  return {
    id: img.id,
    imageUrl: img.imageUrl,
    altText: img.altText,
    displayOrder: img.displayOrder,
    isPrimary: img.isPrimary,
  };
}

function formatVariant(v: ProductVariant): ProductVariantResponse {
  return {
    id: v.id,
    sku: v.sku,
    size: v.size,
    colorName: v.colorName,
    colorHex: v.colorHex,
    priceOverride: v.priceOverride,
    stockQuantity: v.stockQuantity,
    inStock: v.stockQuantity > 0,
    isLowStock: v.stockQuantity > 0 && v.stockQuantity <= 3,
  };
}

function formatVariantStock(v: ProductVariant): VariantStockStatus {
  return {
    variantId: v.id,
    sku: v.sku,
    size: v.size,
    colorName: v.colorName,
    colorHex: v.colorHex,
    stockQuantity: v.stockQuantity,
    inStock: v.stockQuantity > 0,
    isLowStock: v.stockQuantity > 0 && v.stockQuantity <= 3,
  };
}

function formatProductSummary(product: ProductWithRelations): ProductSummaryResponse {
  const images = product.images.map(formatImage);
  const variants = product.variants.map(formatVariant);
  const primaryImage = images.find((img) => img.isPrimary) || images[0] || null;
  const inStock = variants.some((v) => v.inStock);

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    category: product.category,
    tag: product.tag,
    description: product.description,
    basePrice: product.basePrice,
    compareAtPrice: product.compareAtPrice,
    isPublished: product.isPublished,
    rating: product.rating !== null ? Number(product.rating) : null,
    reviewCount: product.reviewCount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    images,
    variants,
    primaryImage,
    inStock,
  };
}

function formatProductDetail(product: ProductWithRelations): ProductDetailResponse {
  const summary = formatProductSummary(product);
  return {
    ...summary,
    materialsAndCare: product.materialsAndCare,
  };
}

export class ProductService {
  /**
   * List published jackets with optional filtering, sorting, and pagination.
   */
  async listProducts(query: ListProductsQuery): Promise<ListProductsResponse> {
    const { page, limit, category, size, color, sort, inStock } = query;

    const where: Prisma.ProductWhereInput = {
      isPublished: true,
    };

    if (category) {
      where.category = category;
    }

    const variantConditions: Prisma.ProductVariantWhereInput[] = [];

    if (size) {
      variantConditions.push({ size });
    }

    if (color) {
      variantConditions.push({
        colorName: {
          contains: color,
          mode: 'insensitive',
        },
      });
    }

    if (inStock === true) {
      variantConditions.push({
        stockQuantity: {
          gt: 0,
        },
      });
    } else if (inStock === false && (size || color)) {
      variantConditions.push({
        stockQuantity: {
          lte: 0,
        },
      });
    }

    if (variantConditions.length > 0) {
      where.variants = {
        some: {
          AND: variantConditions,
        },
      };
    } else if (inStock === false) {
      where.variants = {
        none: {
          stockQuantity: {
            gt: 0,
          },
        },
      };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: 'desc' }, { id: 'asc' }];

    if (sort === 'price_asc' || sort === 'price-low-to-high') {
      orderBy = [{ basePrice: 'asc' }, { id: 'asc' }];
    } else if (sort === 'price_desc' || sort === 'price-high-to-low') {
      orderBy = [{ basePrice: 'desc' }, { id: 'asc' }];
    } else if (sort === 'newest' || sort === 'featured') {
      orderBy = [{ createdAt: 'desc' }, { id: 'asc' }];
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
          variants: {
            orderBy: [{ colorName: 'asc' }, { size: 'asc' }],
          },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      products: products.map(formatProductSummary),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Retrieve full jacket details, photo gallery, and variants by slug.
   * Throws 404 if product not found or unpublished.
   */
  async getProductBySlug(slug: string): Promise<ProductDetailResponse> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        variants: {
          orderBy: [{ colorName: 'asc' }, { size: 'asc' }],
        },
      },
    });

    if (!product || !product.isPublished) {
      throw new HttpError(404, 'Product not found');
    }

    return formatProductDetail(product);
  }

  /**
   * Real-time stock status check for a product or its variants.
   * Throws 404 if product not found, unpublished, or specified variant not found.
   */
  async checkStock(productId: string, query: CheckStockQuery): Promise<ProductStockResponse> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          orderBy: [{ colorName: 'asc' }, { size: 'asc' }],
        },
      },
    });

    if (!product || !product.isPublished) {
      throw new HttpError(404, 'Product not found');
    }

    // 1. Direct variantId lookup
    if (query.variantId) {
      const variant = product.variants.find((v) => v.id === query.variantId);
      if (!variant) {
        throw new HttpError(404, 'Product variant not found');
      }

      return {
        productId: product.id,
        inStock: variant.stockQuantity > 0,
        variant: formatVariantStock(variant),
      };
    }

    // 2. Direct SKU lookup
    if (query.sku) {
      const variant = product.variants.find((v) => v.sku.toLowerCase() === query.sku!.toLowerCase());
      if (!variant) {
        throw new HttpError(404, `Variant with SKU '${query.sku}' not found`);
      }

      return {
        productId: product.id,
        inStock: variant.stockQuantity > 0,
        variant: formatVariantStock(variant),
      };
    }

    // 3. Size and/or Color filter lookup
    if (query.size || query.color) {
      let matching = product.variants;

      if (query.size) {
        matching = matching.filter((v) => v.size.toLowerCase() === query.size!.toLowerCase());
      }

      if (query.color) {
        const colorLower = query.color.toLowerCase();
        matching = matching.filter((v) => v.colorName.toLowerCase().includes(colorLower));
      }

      if (matching.length === 0) {
        throw new HttpError(404, 'No matching variants found for the specified criteria');
      }

      if (matching.length === 1) {
        const single = matching[0];
        return {
          productId: product.id,
          inStock: single.stockQuantity > 0,
          variant: formatVariantStock(single),
        };
      }

      const totalStock = matching.reduce((sum, v) => sum + v.stockQuantity, 0);
      return {
        productId: product.id,
        inStock: totalStock > 0,
        totalStock,
        variants: matching.map(formatVariantStock),
      };
    }

    // 4. General stock check across all variants
    const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
    return {
      productId: product.id,
      inStock: totalStock > 0,
      totalStock,
      variants: product.variants.map(formatVariantStock),
    };
  }
}

export const productService = new ProductService();
