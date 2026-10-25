import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../config/prisma';

describe('Phase 2.3 — Product Catalog & Inventory APIs', () => {
  const timestamp = Date.now();
  const createdProductIds: string[] = [];

  let bomberId: string;
  let parkaId: string;
  let overcoatId: string;
  let unpublishedId: string;

  let bomberVariantLowStockId: string;
  let bomberVariantInStockId: string;
  let bomberVariantOutOfStockId: string;
  let bomberVariantSku: string;

  const bomberSlug = `test-bomber-${timestamp}`;
  const parkaSlug = `test-parka-${timestamp}`;
  const overcoatSlug = `test-overcoat-${timestamp}`;
  const unpublishedSlug = `test-draft-${timestamp}`;

  beforeAll(async () => {
    // 1. Published Bomber Jacket (In stock, multiple variants, ratings, images)
    const bomber = await prisma.product.create({
      data: {
        title: 'Test Apex Bomber Jacket',
        slug: bomberSlug,
        category: 'bomber',
        tag: 'Water-resistant Twill',
        description: 'Engineered minimalist bomber crafted from Japanese nylon twill.',
        materialsAndCare: '65% Recycled Cotton, 35% Polyamide. Dry clean only.',
        basePrice: 499900,
        compareAtPrice: 599900,
        isPublished: true,
        rating: 4.8,
        reviewCount: 15,
        images: {
          create: [
            {
              imageUrl: 'https://cdn.lastoption.in/images/apex-bomber-front.jpg',
              altText: 'Apex Bomber Front View',
              displayOrder: 1,
              isPrimary: true,
            },
            {
              imageUrl: 'https://cdn.lastoption.in/images/apex-bomber-back.jpg',
              altText: 'Apex Bomber Back View',
              displayOrder: 2,
              isPrimary: false,
            },
          ],
        },
        variants: {
          create: [
            {
              sku: `TEST-BOMB-BLK-S-${timestamp}`,
              size: 'S',
              colorName: 'Onyx Black',
              colorHex: '#14181F',
              stockQuantity: 2, // Low stock (1..3)
            },
            {
              sku: `TEST-BOMB-BLK-M-${timestamp}`,
              size: 'M',
              colorName: 'Onyx Black',
              colorHex: '#14181F',
              stockQuantity: 10, // In stock
            },
            {
              sku: `TEST-BOMB-SLT-L-${timestamp}`,
              size: 'L',
              colorName: 'Muted Slate',
              colorHex: '#4A5568',
              stockQuantity: 0, // Out of stock
            },
          ],
        },
      },
      include: {
        variants: true,
      },
    });

    bomberId = bomber.id;
    createdProductIds.push(bomberId);

    const vLow = bomber.variants.find((v) => v.size === 'S')!;
    const vIn = bomber.variants.find((v) => v.size === 'M')!;
    const vOut = bomber.variants.find((v) => v.size === 'L')!;
    bomberVariantLowStockId = vLow.id;
    bomberVariantInStockId = vIn.id;
    bomberVariantOutOfStockId = vOut.id;
    bomberVariantSku = vIn.sku;

    // 2. Published Technical Parka (Higher base price)
    const parka = await prisma.product.create({
      data: {
        title: 'Test Storm Technical Parka',
        slug: parkaSlug,
        category: 'parka',
        tag: '3-Layer Weatherproof',
        description: 'Extreme weather parka with taped seams.',
        materialsAndCare: '100% Technical Nylon.',
        basePrice: 799900,
        compareAtPrice: 949900,
        isPublished: true,
        rating: null,
        reviewCount: 0,
        images: {
          create: [
            {
              imageUrl: 'https://cdn.lastoption.in/images/storm-parka.jpg',
              altText: 'Storm Parka Primary',
              displayOrder: 1,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              sku: `TEST-PARKA-NVY-M-${timestamp}`,
              size: 'M',
              colorName: 'Deep Navy',
              colorHex: '#1A2844',
              stockQuantity: 4,
            },
          ],
        },
      },
    });

    parkaId = parka.id;
    createdProductIds.push(parkaId);

    // 3. Published Overcoat (Completely out of stock)
    const overcoat = await prisma.product.create({
      data: {
        title: 'Test Tailored Overcoat',
        slug: overcoatSlug,
        category: 'overcoat',
        tag: 'Merino Wool Blend',
        description: 'Architectural silhouette overcoat.',
        basePrice: 999900,
        isPublished: true,
        variants: {
          create: [
            {
              sku: `TEST-OVER-CML-XL-${timestamp}`,
              size: 'XL',
              colorName: 'Camel Tan',
              colorHex: '#C19A6B',
              stockQuantity: 0,
            },
          ],
        },
      },
    });

    overcoatId = overcoat.id;
    createdProductIds.push(overcoatId);

    // 4. Draft Unpublished Product (Must NEVER appear in public endpoints)
    const draft = await prisma.product.create({
      data: {
        title: 'Test Draft Field Jacket',
        slug: unpublishedSlug,
        category: 'field',
        tag: 'Sample Prototype',
        description: 'Prototype jacket not yet approved for release.',
        basePrice: 599900,
        isPublished: false,
        variants: {
          create: [
            {
              sku: `TEST-FIELD-OLV-M-${timestamp}`,
              size: 'M',
              colorName: 'Olive Drab',
              colorHex: '#3D4A39',
              stockQuantity: 20,
            },
          ],
        },
      },
    });

    unpublishedId = draft.id;
    createdProductIds.push(unpublishedId);
  });

  afterAll(async () => {
    if (createdProductIds.length > 0) {
      await prisma.product.deleteMany({
        where: {
          id: {
            in: createdProductIds,
          },
        },
      });
    }
  });

  describe('1. Catalog Listing (GET /api/v1/products)', () => {
    it('returns 200 with standardized envelope and pagination metadata', async () => {
      const res = await request(app).get('/api/v1/products');

      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).toBeDefined();
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Products retrieved successfully');
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(12);
      expect(typeof res.body.data.pagination.total).toBe('number');
    });

    it('never returns unpublished products in public listing', async () => {
      const res = await request(app).get('/api/v1/products');

      expect(res.status).toBe(200);
      const productSlugs = res.body.data.products.map((p: { slug: string }) => p.slug);
      expect(productSlugs).not.toContain(unpublishedSlug);
      expect(productSlugs).toContain(bomberSlug);
    });

    it('serializes Decimal ratings cleanly as number or null', async () => {
      const res = await request(app).get('/api/v1/products');

      expect(res.status).toBe(200);
      const bomber = res.body.data.products.find((p: { slug: string }) => p.slug === bomberSlug);
      expect(bomber).toBeDefined();
      expect(typeof bomber.rating).toBe('number');
      expect(bomber.rating).toBe(4.8);

      const parka = res.body.data.products.find((p: { slug: string }) => p.slug === parkaSlug);
      expect(parka).toBeDefined();
      expect(parka.rating).toBeNull();
    });

    it('correctly orders images and identifies primaryImage', async () => {
      const res = await request(app).get('/api/v1/products');

      const bomber = res.body.data.products.find((p: { slug: string }) => p.slug === bomberSlug);
      expect(bomber.images).toHaveLength(2);
      expect(bomber.images[0].displayOrder).toBe(1);
      expect(bomber.images[0].isPrimary).toBe(true);
      expect(bomber.primaryImage.imageUrl).toBe('https://cdn.lastoption.in/images/apex-bomber-front.jpg');
    });

    it('filters products by category', async () => {
      const res = await request(app).get('/api/v1/products?category=bomber');

      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThanOrEqual(1);
      const allBombers = res.body.data.products.every((p: { category: string }) => p.category === 'bomber');
      expect(allBombers).toBe(true);
      const slugs = res.body.data.products.map((p: { slug: string }) => p.slug);
      expect(slugs).toContain(bomberSlug);
      expect(slugs).not.toContain(parkaSlug);
    });

    it('filters products by variant size', async () => {
      const res = await request(app).get('/api/v1/products?size=S');

      expect(res.status).toBe(200);
      const slugs = res.body.data.products.map((p: { slug: string }) => p.slug);
      expect(slugs).toContain(bomberSlug); // Bomber has S variant
      expect(slugs).not.toContain(parkaSlug); // Parka only has M variant
    });

    it('filters products by variant color (case-insensitive substring)', async () => {
      const res = await request(app).get('/api/v1/products?color=onyx');

      expect(res.status).toBe(200);
      const slugs = res.body.data.products.map((p: { slug: string }) => p.slug);
      expect(slugs).toContain(bomberSlug);
      expect(slugs).not.toContain(parkaSlug);
    });

    it('parses inStock=true as boolean true and inStock=false as boolean false without coercing string false to true', async () => {
      // 1. inStock=true returns in-stock products and excludes completely sold-out products
      const resTrue = await request(app).get('/api/v1/products?inStock=true');
      expect(resTrue.status).toBe(200);
      const trueSlugs = resTrue.body.data.products.map((p: { slug: string }) => p.slug);
      expect(trueSlugs).toContain(bomberSlug);
      expect(trueSlugs).toContain(parkaSlug);
      expect(trueSlugs).not.toContain(overcoatSlug);

      // 2. inStock=false returns completely sold-out products and excludes in-stock products
      // Under native z.coerce.boolean(), string 'false' would incorrectly coerce to true!
      const resFalse = await request(app).get('/api/v1/products?inStock=false');
      expect(resFalse.status).toBe(200);
      const falseSlugs = resFalse.body.data.products.map((p: { slug: string }) => p.slug);
      expect(falseSlugs).toContain(overcoatSlug);
      expect(falseSlugs).not.toContain(bomberSlug);
      expect(falseSlugs).not.toContain(parkaSlug);

      // 3. inStock=1 and inStock=0 behave identically to true and false
      const resOne = await request(app).get('/api/v1/products?inStock=1');
      expect(resOne.status).toBe(200);
      expect(resOne.body.data.products.map((p: { slug: string }) => p.slug)).toContain(bomberSlug);

      const resZero = await request(app).get('/api/v1/products?inStock=0');
      expect(resZero.status).toBe(200);
      expect(resZero.body.data.products.map((p: { slug: string }) => p.slug)).toContain(overcoatSlug);

      // 4. inStock=invalid returns 400 Bad Request with field-level error detail
      const resInvalid = await request(app).get('/api/v1/products?inStock=notaboolean');
      expect(resInvalid.status).toBe(400);
      expect(resInvalid.body.success).toBe(false);
      expect(resInvalid.body.error.message).toBe('Validation failed');
      expect(resInvalid.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'inStock',
            message: 'inStock must be a boolean',
          }),
        ])
      );
    });

    it('combines size filter with inStock=false to find products with out-of-stock sizes', async () => {
      // Bomber has size L with stock 0; Parka does not have size L with stock 0
      const res = await request(app).get('/api/v1/products?size=L&inStock=false');

      expect(res.status).toBe(200);
      const slugs = res.body.data.products.map((p: { slug: string }) => p.slug);
      expect(slugs).toContain(bomberSlug);
      expect(slugs).not.toContain(parkaSlug);
    });

    it('handles all accepted sort values and aliases correctly (price_asc, price-low-to-high, price_desc, price-high-to-low, newest, featured)', async () => {
      // 1. price_asc
      const resAsc = await request(app).get('/api/v1/products?sort=price_asc');
      expect(resAsc.status).toBe(200);
      const pricesAsc = resAsc.body.data.products.map((p: { basePrice: number }) => p.basePrice);
      for (let i = 0; i < pricesAsc.length - 1; i++) {
        expect(pricesAsc[i]).toBeLessThanOrEqual(pricesAsc[i + 1]);
      }

      // 2. price-low-to-high (alias)
      const resLowToHigh = await request(app).get('/api/v1/products?sort=price-low-to-high');
      expect(resLowToHigh.status).toBe(200);
      const pricesLowToHigh = resLowToHigh.body.data.products.map((p: { basePrice: number }) => p.basePrice);
      expect(pricesLowToHigh).toEqual(pricesAsc);

      // 3. price_desc
      const resDesc = await request(app).get('/api/v1/products?sort=price_desc');
      expect(resDesc.status).toBe(200);
      const pricesDesc = resDesc.body.data.products.map((p: { basePrice: number }) => p.basePrice);
      for (let i = 0; i < pricesDesc.length - 1; i++) {
        expect(pricesDesc[i]).toBeGreaterThanOrEqual(pricesDesc[i + 1]);
      }

      // 4. price-high-to-low (alias)
      const resHighToLow = await request(app).get('/api/v1/products?sort=price-high-to-low');
      expect(resHighToLow.status).toBe(200);
      const pricesHighToLow = resHighToLow.body.data.products.map((p: { basePrice: number }) => p.basePrice);
      expect(pricesHighToLow).toEqual(pricesDesc);

      // 5. newest
      const resNewest = await request(app).get('/api/v1/products?sort=newest');
      expect(resNewest.status).toBe(200);
      expect(resNewest.body.data.products.length).toBeGreaterThan(0);

      // 6. featured
      const resFeatured = await request(app).get('/api/v1/products?sort=featured');
      expect(resFeatured.status).toBe(200);
      expect(resFeatured.body.data.products.length).toBeGreaterThan(0);

      // 7. Unsupported sort value returns 400 Bad Request
      const resBadSort = await request(app).get('/api/v1/products?sort=random_sort_value');
      expect(resBadSort.status).toBe(400);
      expect(resBadSort.body.success).toBe(false);
      expect(resBadSort.body.error.message).toBe('Validation failed');
      expect(resBadSort.body.error.details.some((d: { field: string }) => d.field === 'sort')).toBe(true);
    });

    it('confirms coerced query values reach the controller as typed primitives (numbers and booleans)', async () => {
      const res = await request(app).get('/api/v1/products?page=2&limit=1');

      expect(res.status).toBe(200);
      expect(typeof res.body.data.pagination.page).toBe('number');
      expect(res.body.data.pagination.page).toBe(2);
      expect(typeof res.body.data.pagination.limit).toBe('number');
      expect(res.body.data.pagination.limit).toBe(1);
    });

    it('paginates results accurately', async () => {
      const resPage1 = await request(app).get('/api/v1/products?limit=1&page=1');

      expect(resPage1.status).toBe(200);
      expect(resPage1.body.data.products).toHaveLength(1);
      expect(resPage1.body.data.pagination.page).toBe(1);
      expect(resPage1.body.data.pagination.limit).toBe(1);
      expect(resPage1.body.data.pagination.hasNextPage).toBe(true);
      expect(resPage1.body.data.pagination.hasPrevPage).toBe(false);

      const resPage2 = await request(app).get('/api/v1/products?limit=1&page=2');
      expect(resPage2.status).toBe(200);
      expect(resPage2.body.data.products).toHaveLength(1);
      expect(resPage2.body.data.pagination.page).toBe(2);
      expect(resPage2.body.data.pagination.hasPrevPage).toBe(true);

      // Verify page 1 and page 2 returned different items
      expect(resPage1.body.data.products[0].id).not.toBe(resPage2.body.data.products[0].id);
    });

    it('returns 400 Bad Request when category is invalid', async () => {
      const res = await request(app).get('/api/v1/products?category=unsupported_category');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Validation failed');
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'category')).toBe(true);
    });

    it('returns 400 Bad Request when limit exceeds maximum of 50', async () => {
      const res = await request(app).get('/api/v1/products?limit=100');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'limit')).toBe(true);
    });
  });

  describe('2. Product Detail Page (GET /api/v1/products/:slug)', () => {
    it('returns 200 with full details, materials, images, and variants', async () => {
      const res = await request(app).get(`/api/v1/products/${bomberSlug}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.product).toBeDefined();

      const product = res.body.data.product;
      expect(product.id).toBe(bomberId);
      expect(product.slug).toBe(bomberSlug);
      expect(product.materialsAndCare).toBe('65% Recycled Cotton, 35% Polyamide. Dry clean only.');
      expect(product.images).toHaveLength(2);
      expect(product.variants).toHaveLength(3);
      expect(product.inStock).toBe(true);

      // Variant stock calculation
      const variantS = product.variants.find((v: { size: string }) => v.size === 'S');
      expect(variantS.stockQuantity).toBe(2);
      expect(variantS.inStock).toBe(true);
      expect(variantS.isLowStock).toBe(true);

      const variantL = product.variants.find((v: { size: string }) => v.size === 'L');
      expect(variantL.stockQuantity).toBe(0);
      expect(variantL.inStock).toBe(false);
      expect(variantL.isLowStock).toBe(false);
    });

    it('returns 404 when slug does not exist', async () => {
      const res = await request(app).get('/api/v1/products/non-existent-product-slug');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Product not found');
    });

    it('returns 404 when requested product is unpublished', async () => {
      const res = await request(app).get(`/api/v1/products/${unpublishedSlug}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Product not found');
    });
  });

  describe('3. Real-Time Stock Status (GET /api/v1/products/:id/check-stock)', () => {
    it('returns 200 with overall product stock summary when no variant filters given', async () => {
      const res = await request(app).get(`/api/v1/products/${bomberId}/check-stock`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.productId).toBe(bomberId);
      expect(res.body.data.inStock).toBe(true);
      expect(res.body.data.totalStock).toBe(12); // 2 + 10 + 0 = 12
      expect(res.body.data.variants).toHaveLength(3);
    });

    it('returns 200 with specific variant stock by variantId', async () => {
      const res = await request(app).get(
        `/api/v1/products/${bomberId}/check-stock?variantId=${bomberVariantLowStockId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.productId).toBe(bomberId);
      expect(res.body.data.inStock).toBe(true);
      expect(res.body.data.variant).toBeDefined();
      expect(res.body.data.variant.variantId).toBe(bomberVariantLowStockId);
      expect(res.body.data.variant.size).toBe('S');
      expect(res.body.data.variant.stockQuantity).toBe(2);
      expect(res.body.data.variant.isLowStock).toBe(true);
    });

    it('returns 200 with specific variant stock by SKU', async () => {
      const res = await request(app).get(
        `/api/v1/products/${bomberId}/check-stock?sku=${bomberVariantSku}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.variant).toBeDefined();
      expect(res.body.data.variant.sku).toBe(bomberVariantSku);
      expect(res.body.data.variant.stockQuantity).toBe(10);
      expect(res.body.data.variant.inStock).toBe(true);
      expect(res.body.data.variant.isLowStock).toBe(false);
    });

    it('returns 200 when filtering by size and color', async () => {
      const res = await request(app).get(
        `/api/v1/products/${bomberId}/check-stock?size=S&color=Onyx`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.variant).toBeDefined();
      expect(res.body.data.variant.size).toBe('S');
      expect(res.body.data.variant.colorName).toBe('Onyx Black');
      expect(res.body.data.variant.stockQuantity).toBe(2);
    });

    it('returns 404 when size and color filter yields no match', async () => {
      const res = await request(app).get(
        `/api/v1/products/${bomberId}/check-stock?size=XXL&color=Onyx`
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('No matching variants found for the specified criteria');
    });

    it('returns 404 when variantId belongs to another product or does not exist', async () => {
      const dummyVariantId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app).get(
        `/api/v1/products/${bomberId}/check-stock?variantId=${dummyVariantId}`
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Product variant not found');
    });

    it('returns 400 Bad Request when product ID is not a valid UUID', async () => {
      const res = await request(app).get('/api/v1/products/invalid-id/check-stock');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Validation failed');
      expect(res.body.error.details.some((d: { field: string }) => d.field === 'id')).toBe(true);
    });

    it('returns 404 when product ID is valid UUID but product does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app).get(`/api/v1/products/${nonExistentId}/check-stock`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Product not found');
    });

    it('returns 404 when checking stock of an unpublished product', async () => {
      const res = await request(app).get(`/api/v1/products/${unpublishedId}/check-stock`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Product not found');
    });
  });
});
