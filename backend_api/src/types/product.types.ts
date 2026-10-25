export interface ProductImageResponse {
  id: string;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariantResponse {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  priceOverride: number | null;
  stockQuantity: number;
  inStock: boolean;
  isLowStock: boolean;
}

export interface ProductSummaryResponse {
  id: string;
  title: string;
  slug: string;
  category: string;
  tag: string;
  description: string;
  basePrice: number;
  compareAtPrice: number | null;
  isPublished: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImageResponse[];
  variants: ProductVariantResponse[];
  primaryImage: ProductImageResponse | null;
  inStock: boolean;
}

export interface ProductDetailResponse extends ProductSummaryResponse {
  materialsAndCare: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListProductsResponse {
  products: ProductSummaryResponse[];
  pagination: PaginationMeta;
}

export interface VariantStockStatus {
  variantId: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  stockQuantity: number;
  inStock: boolean;
  isLowStock: boolean;
}

export interface ProductStockResponse {
  productId: string;
  inStock: boolean;
  totalStock?: number;
  variant?: VariantStockStatus;
  variants?: VariantStockStatus[];
}
