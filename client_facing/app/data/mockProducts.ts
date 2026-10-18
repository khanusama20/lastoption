import type { Product } from '../types/product';

/**
 * Mock Jacket Catalog Data for Last Option Storefront (Phase 2.2)
 * Structured strictly to match the PostgreSQL schema and API contract.
 * Located in app/data/ to facilitate zero-rewrite transition to GET /api/v1/products.
 */
export const mockProducts: Product[] = [
  {
    id: 'prod_01_bomber',
    title: 'Minimal Bomber Jacket',
    slug: 'minimal-bomber-jacket',
    tag: 'Water-resistant Twill',
    category: 'bomber',
    description: 'A disciplined silhouette engineered for transitional weather. Tailored from high-density Japanese cotton twill with an eco-certified DWR water-resistant finish, rib-knit collar, and custom gunmetal hardware.',
    materialsAndCare: 'Shell: 65% Recycled Cotton, 35% Polyamide with DWR finish. Lining: 100% Cupro. Dry clean only or spot clean with cold water.',
    basePrice: 499900, // ₹4,999 in paise
    compareAtPrice: 599900, // ₹5,999 in paise
    isPublished: true,
    rating: 4.9,
    reviewCount: 38,
    images: [
      {
        id: 'img_bomb_01',
        imageUrl: '/images/products/minimal-bomber.jpg',
        altText: 'Minimal Bomber Jacket in Matte Onyx Black',
        displayOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var_bomb_blk_s', sku: 'LO-JKT-BOMB-BLK-S', size: 'S', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 6 },
      { id: 'var_bomb_blk_m', sku: 'LO-JKT-BOMB-BLK-M', size: 'M', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 3 },
      { id: 'var_bomb_blk_l', sku: 'LO-JKT-BOMB-BLK-L', size: 'L', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 8 },
      { id: 'var_bomb_blk_xl', sku: 'LO-JKT-BOMB-BLK-XL', size: 'XL', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 4 },
      { id: 'var_bomb_blk_xxl', sku: 'LO-JKT-BOMB-BLK-XXL', size: 'XXL', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 2 },
      { id: 'var_bomb_slt_m', sku: 'LO-JKT-BOMB-SLT-M', size: 'M', colorName: 'Muted Slate', colorHex: '#4A5568', stockQuantity: 5 },
      { id: 'var_bomb_slt_l', sku: 'LO-JKT-BOMB-SLT-L', size: 'L', colorName: 'Muted Slate', colorHex: '#4A5568', stockQuantity: 4 },
      { id: 'var_bomb_nvy_m', sku: 'LO-JKT-BOMB-NVY-M', size: 'M', colorName: 'Deep Navy', colorHex: '#1A2844', stockQuantity: 6 },
    ],
  },
  {
    id: 'prod_02_field',
    title: 'Heritage Field Jacket',
    slug: 'heritage-field-jacket',
    tag: 'Reinforced Utility',
    category: 'field',
    description: 'Inspired by military foul-weather gear, refined with sharp architectural lines. Features four expandable gusseted bellows pockets, internal drawstring waist cinch, and reinforced elbow patches.',
    materialsAndCare: '100% Heavyweight Cotton Canvas (380 GSM) with water-repellent paraffin coating. Unlined for breathable layering. Wipe clean with damp cloth.',
    basePrice: 649900, // ₹6,499 in paise
    compareAtPrice: null,
    isPublished: true,
    rating: 4.8,
    reviewCount: 29,
    images: [
      {
        id: 'img_field_01',
        imageUrl: '/images/products/heritage-field.jpg',
        altText: 'Heritage Field Jacket in Olive Drab',
        displayOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var_field_olv_s', sku: 'LO-JKT-FIELD-OLV-S', size: 'S', colorName: 'Olive Drab', colorHex: '#3D4A39', stockQuantity: 4 },
      { id: 'var_field_olv_m', sku: 'LO-JKT-FIELD-OLV-M', size: 'M', colorName: 'Olive Drab', colorHex: '#3D4A39', stockQuantity: 5 },
      { id: 'var_field_olv_l', sku: 'LO-JKT-FIELD-OLV-L', size: 'L', colorName: 'Olive Drab', colorHex: '#3D4A39', stockQuantity: 7 },
      { id: 'var_field_olv_xl', sku: 'LO-JKT-FIELD-OLV-XL', size: 'XL', colorName: 'Olive Drab', colorHex: '#3D4A39', stockQuantity: 3 },
      { id: 'var_field_brn_m', sku: 'LO-JKT-FIELD-BRN-M', size: 'M', colorName: 'Espresso Brown', colorHex: '#2E1E14', stockQuantity: 4 },
      { id: 'var_field_blk_m', sku: 'LO-JKT-FIELD-BLK-M', size: 'M', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 6 },
    ],
  },
  {
    id: 'prod_03_parka',
    title: 'Obsidian Technical Parka',
    slug: 'obsidian-technical-parka',
    tag: '100% Weatherproof',
    category: 'parka',
    description: 'Engineered for relentless downpours and cold winds. Fully taped seams, a 3-panel articulated storm hood, waterproof polyurethane-coated zips, and micro-fleece lined hand warmer pockets.',
    materialsAndCare: '3-Layer laminated breathable membrane shell (10,000mm waterproof / 10,000g breathability). Machine wash cold on gentle cycle.',
    basePrice: 799900, // ₹7,999 in paise
    compareAtPrice: 949900, // ₹9,499 in paise
    isPublished: true,
    rating: 5.0,
    reviewCount: 47,
    images: [
      {
        id: 'img_parka_01',
        imageUrl: '/images/products/obsidian-parka.jpg',
        altText: 'Obsidian Technical Parka in Stealth Black',
        displayOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var_parka_blk_s', sku: 'LO-JKT-PARKA-BLK-S', size: 'S', colorName: 'Obsidian Black', colorHex: '#0F1115', stockQuantity: 5 },
      { id: 'var_parka_blk_m', sku: 'LO-JKT-PARKA-BLK-M', size: 'M', colorName: 'Obsidian Black', colorHex: '#0F1115', stockQuantity: 2 }, // Low stock test
      { id: 'var_parka_blk_l', sku: 'LO-JKT-PARKA-BLK-L', size: 'L', colorName: 'Obsidian Black', colorHex: '#0F1115', stockQuantity: 6 },
      { id: 'var_parka_blk_xl', sku: 'LO-JKT-PARKA-BLK-XL', size: 'XL', colorName: 'Obsidian Black', colorHex: '#0F1115', stockQuantity: 4 },
      { id: 'var_parka_chr_m', sku: 'LO-JKT-PARKA-CHR-M', size: 'M', colorName: 'Charcoal Gray', colorHex: '#282C34', stockQuantity: 3 },
    ],
  },
  {
    id: 'prod_04_overcoat',
    title: 'Heritage Wool Overcoat',
    slug: 'heritage-wool-overcoat',
    tag: 'Melton Wool Blend',
    category: 'overcoat',
    description: 'Impeccable tailored drape meeting uncompromising winter insulation. Features structured natural shoulders, notched lapels, horn buttons, and a smooth viscose inner lining for frictionless layering.',
    materialsAndCare: '80% Virgin Wool, 20% Polyamide (520 GSM Melton Wool). Dry clean only. Use cedar hangers.',
    basePrice: 699900, // ₹6,999 in paise
    compareAtPrice: null,
    isPublished: true,
    rating: 4.9,
    reviewCount: 42,
    images: [
      {
        id: 'img_overcoat_01',
        imageUrl: '/images/products/wool-overcoat.jpg',
        altText: 'Heritage Wool Overcoat in Midnight Navy',
        displayOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var_over_nvy_s', sku: 'LO-JKT-OVER-NVY-S', size: 'S', colorName: 'Midnight Navy', colorHex: '#1A2844', stockQuantity: 3 },
      { id: 'var_over_nvy_m', sku: 'LO-JKT-OVER-NVY-M', size: 'M', colorName: 'Midnight Navy', colorHex: '#1A2844', stockQuantity: 3 },
      { id: 'var_over_nvy_l', sku: 'LO-JKT-OVER-NVY-L', size: 'L', colorName: 'Midnight Navy', colorHex: '#1A2844', stockQuantity: 4 },
      { id: 'var_over_chr_m', sku: 'LO-JKT-OVER-CHR-M', size: 'M', colorName: 'Charcoal Gray', colorHex: '#2D3748', stockQuantity: 4 },
      { id: 'var_over_onx_m', sku: 'LO-JKT-OVER-ONX-M', size: 'M', colorName: 'Onyx Black', colorHex: '#14181F', stockQuantity: 2 },
    ],
  },
];
