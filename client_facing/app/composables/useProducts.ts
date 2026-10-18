import { ref, computed } from 'vue';
import type { Product } from '../types/product';
import { mockProducts } from '../data/mockProducts';

/**
 * Composable for querying jackets catalog.
 * Designed so that the underlying data source can be seamlessly switched
 * from mock data to the backend API (`GET /api/v1/products`) without modifying UI components.
 */
export function useProducts() {
  const products = ref<Product[]>(mockProducts);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const featuredProducts = computed(() => {
    return products.value.filter((p) => p.isPublished);
  });

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.value.find((p) => p.slug === slug);
  };

  const filterByCategory = (category: string) => {
    if (!category || category === 'all') {
      return products.value;
    }
    return products.value.filter((p) => p.category === category);
  };

  return {
    products,
    featuredProducts,
    isLoading,
    error,
    getProductBySlug,
    filterByCategory,
  };
}
