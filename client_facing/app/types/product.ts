export type JacketSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: JacketSize;
  colorName: string;
  colorHex: string;
  stockQuantity: number;
  priceOverride?: number | null; // in paise
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  tag: string;
  category: 'bomber' | 'field' | 'parka' | 'overcoat';
  description: string;
  materialsAndCare: string;
  basePrice: number; // in paise (e.g. 499900 = ₹4,999)
  compareAtPrice?: number | null; // in paise (e.g. 599900 = ₹5,999)
  isPublished: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
}

/**
 * Format an integer paise value into Indian Rupee currency format (e.g., 499900 -> ₹4,999)
 */
export function formatPrice(paise: number): string {
  const rupees = Math.round(paise / 100);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}
