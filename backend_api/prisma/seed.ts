import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SampleProduct {
  title: string;
  slug: string;
  category: 'bomber' | 'field' | 'parka' | 'overcoat';
  tag: string;
  description: string;
  materialsAndCare: string;
  basePrice: number;
  compareAtPrice: number | null;
  isPublished: boolean;
  images: {
    imageUrl: string;
    altText: string;
    displayOrder: number;
    isPrimary: boolean;
  }[];
  variants: {
    sku: string;
    size: string;
    colorName: string;
    colorHex: string;
    stockQuantity: number;
    priceOverride?: number | null;
  }[];
}

const sampleProducts: SampleProduct[] = [
  {
    title: 'Minimal Bomber Jacket',
    slug: 'minimal-bomber-jacket',
    tag: 'Water-resistant Twill',
    category: 'bomber',
    description: 'A disciplined silhouette engineered for transitional weather. Tailored from high-density Japanese cotton twill with an eco-certified DWR water-resistant finish, rib-knit collar, and custom gunmetal hardware.',
    materialsAndCare: 'Shell: 65% Recycled Cotton, 35% Polyamide with DWR finish. Lining: 100% Cupro. Dry clean only or spot clean with cold water.',
    basePrice: 499900, // ₹4,999 in paise
    compareAtPrice: 599900, // ₹5,999 in paise
    isPublished: true,
    images: [
      {
        imageUrl: '/images/products/minimal-bomber.jpg',
        altText: 'Minimal Bomber Jacket in Matte Onyx Black',
        displayOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      { sku: 'LO-JKT-BOMB-BLK-S', size: 'S', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 6 },
      { sku: 'LO-JKT-BOMB-BLK-M', size: 'M', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 3 },
      { sku: 'LO-JKT-BOMB-BLK-L', size: 'L', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 8 },
      { sku: 'LO-JKT-BOMB-BLK-XL', size: 'XL', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 4 },
      { sku: 'LO-JKT-BOMB-BLK-XXL', size: 'XXL', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 2 },
      { sku: 'LO-JKT-BOMB-SLT-M', size: 'M', colorName: 'Muted Slate', colorHex: '#4A5568', stockQuantity: 5 },
      { sku: 'LO-JKT-BOMB-SLT-L', size: 'L', colorName: 'Muted Slate', colorHex: '#4A5568', stockQuantity: 4 },
      { sku: 'LO-JKT-BOMB-NVY-M', size: 'M', colorName: 'Deep Navy', colorHex: '#1A2844', stockQuantity: 6 },
    ],
  },
  {
    title: 'Heritage Field Jacket',
    slug: 'heritage-field-jacket',
    tag: 'Reinforced Utility',
    category: 'field',
    description: 'Inspired by military foul-weather gear, refined with sharp architectural lines. Features four expandable gusseted bellows pockets, internal drawstring waist cinch, and reinforced elbow patches.',
    materialsAndCare: '100% Heavyweight Cotton Canvas (380 GSM) with water-repellent paraffin coating. Unlined for breathable layering. Wipe clean with damp cloth.',
    basePrice: 649900, // ₹6,499 in paise
    compareAtPrice: null,
    isPublished: true,
    images: [
      {
        imageUrl: '/images/products/heritage-field.jpg',
        altText: 'Heritage Field Jacket in Olive Drab',
        displayOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      { sku: 'LO-JKT-FIELD-OLV-S', size: 'S', colorName: 'Olive Drab', colorHex: '#3D4A39', stockQuantity: 4 },
      { sku: 'LO-JKT-FIELD-OLV-M', size: 'M', colorName: 'Olive Drab', colorHex: '#3D4A39', stockQuantity: 5 },
      { sku: 'LO-JKT-FIELD-OLV-L', size: 'L', colorName: 'Olive Drab', colorHex: '#3D4A39', stockQuantity: 7 },
      { sku: 'LO-JKT-FIELD-OLV-XL', size: 'XL', colorName: 'Olive Drab', colorHex: '#3D4A39', stockQuantity: 3 },
      { sku: 'LO-JKT-FIELD-BRN-M', size: 'M', colorName: 'Espresso Brown', colorHex: '#2E1E14', stockQuantity: 4 },
      { sku: 'LO-JKT-FIELD-BLK-M', size: 'M', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 6 },
    ],
  },
  {
    title: 'Obsidian Technical Parka',
    slug: 'obsidian-technical-parka',
    tag: '100% Weatherproof',
    category: 'parka',
    description: 'Engineered for relentless downpours and cold winds. Fully taped seams, a 3-panel articulated storm hood, waterproof polyurethane-coated zips, and micro-fleece lined hand warmer pockets.',
    materialsAndCare: '3-Layer laminated breathable membrane shell (10,000mm waterproof / 10,000g breathability). Machine wash cold on gentle cycle.',
    basePrice: 799900, // ₹7,999 in paise
    compareAtPrice: 949900, // ₹9,499 in paise
    isPublished: true,
    images: [
      {
        imageUrl: '/images/products/obsidian-parka.jpg',
        altText: 'Obsidian Technical Parka in Stealth Black',
        displayOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      { sku: 'LO-JKT-PARKA-BLK-S', size: 'S', colorName: 'Obsidian Black', colorHex: '#0F1115', stockQuantity: 5 },
      { sku: 'LO-JKT-PARKA-BLK-M', size: 'M', colorName: 'Obsidian Black', colorHex: '#0F1115', stockQuantity: 2 },
      { sku: 'LO-JKT-PARKA-BLK-L', size: 'L', colorName: 'Obsidian Black', colorHex: '#0F1115', stockQuantity: 6 },
      { sku: 'LO-JKT-PARKA-BLK-XL', size: 'XL', colorName: 'Obsidian Black', colorHex: '#0F1115', stockQuantity: 4 },
      { sku: 'LO-JKT-PARKA-CHR-M', size: 'M', colorName: 'Charcoal Gray', colorHex: '#282C34', stockQuantity: 3 },
    ],
  },
  {
    title: 'Heritage Wool Overcoat',
    slug: 'heritage-wool-overcoat',
    tag: 'Melton Wool Blend',
    category: 'overcoat',
    description: 'Impeccable tailored drape meeting uncompromising winter insulation. Features structured natural shoulders, notched lapels, horn buttons, and a smooth viscose inner lining for frictionless layering.',
    materialsAndCare: '80% Virgin Wool, 20% Polyamide (520 GSM Melton Wool). Dry clean only. Use cedar hangers.',
    basePrice: 699900, // ₹6,999 in paise
    compareAtPrice: null,
    isPublished: true,
    images: [
      {
        imageUrl: '/images/products/wool-overcoat.jpg',
        altText: 'Heritage Wool Overcoat in Midnight Navy',
        displayOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      { sku: 'LO-JKT-OVER-NVY-S', size: 'S', colorName: 'Midnight Navy', colorHex: '#1A2844', stockQuantity: 3 },
      { sku: 'LO-JKT-OVER-NVY-M', size: 'M', colorName: 'Midnight Navy', colorHex: '#1A2844', stockQuantity: 3 },
      { sku: 'LO-JKT-OVER-NVY-L', size: 'L', colorName: 'Midnight Navy', colorHex: '#1A2844', stockQuantity: 4 },
      { sku: 'LO-JKT-OVER-CHR-M', size: 'M', colorName: 'Charcoal Gray', colorHex: '#2D3748', stockQuantity: 4 },
      { sku: 'LO-JKT-OVER-ONX-M', size: 'M', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 2 },
    ],
  },
];

async function main() {
  console.log('[Prisma Seed] Starting idempotent database seed...');

  let productCount = 0;
  let variantCount = 0;
  let imageCount = 0;

  for (const item of sampleProducts) {
    // Upsert product by unique slug
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        category: item.category,
        tag: item.tag,
        description: item.description,
        materialsAndCare: item.materialsAndCare,
        basePrice: item.basePrice,
        compareAtPrice: item.compareAtPrice,
        isPublished: item.isPublished,
        rating: null, // Truthful empty rating: no artificial ratings
        reviewCount: 0, // Truthful empty review count
      },
      create: {
        title: item.title,
        slug: item.slug,
        category: item.category,
        tag: item.tag,
        description: item.description,
        materialsAndCare: item.materialsAndCare,
        basePrice: item.basePrice,
        compareAtPrice: item.compareAtPrice,
        isPublished: item.isPublished,
        rating: null,
        reviewCount: 0,
      },
    });

    productCount++;

    // Idempotent image synchronization
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    for (const img of item.images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: img.imageUrl,
          altText: img.altText,
          displayOrder: img.displayOrder,
          isPrimary: img.isPrimary,
        },
      });
      imageCount++;
    }

    // Upsert variants by unique SKU
    for (const v of item.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          stockQuantity: v.stockQuantity,
          priceOverride: v.priceOverride ?? null,
        },
        create: {
          productId: product.id,
          sku: v.sku,
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          stockQuantity: v.stockQuantity,
          priceOverride: v.priceOverride ?? null,
        },
      });
      variantCount++;
    }
  }

  // Optional: Seed admin user only if explicitly configured in environment
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
  const adminPasswordHash = process.env.ADMIN_INITIAL_PASSWORD_HASH;

  if (adminEmail && adminPasswordHash) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        role: 'admin',
        passwordHash: adminPasswordHash,
      },
      create: {
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: 'admin',
        firstName: 'Store',
        lastName: 'Admin',
      },
    });
    console.log(`[Prisma Seed] Admin user synchronized: ${adminEmail}`);
  } else {
    console.log('[Prisma Seed] Note: No ADMIN_INITIAL_EMAIL configured. Skipping admin user creation.');
  }

  console.log(`[Prisma Seed] Completed successfully.`);
  console.log(`[Prisma Seed] Products upserted: ${productCount}`);
  console.log(`[Prisma Seed] Variants upserted: ${variantCount}`);
  console.log(`[Prisma Seed] Images synchronized: ${imageCount}`);
}

main()
  .catch((e) => {
    console.error('[Prisma Seed Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
