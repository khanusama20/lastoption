<template>
  <section id="featured-jackets" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full min-w-0">
    <!-- Section Heading & Filter Tabs -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#1E2633] gap-4 w-full min-w-0">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2">Curated Collection</p>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
          Featured Pieces
        </h2>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto max-w-full min-w-0">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="activeCategory = cat.id"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors shrink-0"
          :class="activeCategory === cat.id
            ? 'bg-[#D4AF37] text-[#0B0D10]'
            : 'bg-[#14181F] text-[#A0AEC0] border border-[#2D3748] hover:text-white hover:border-[#D4AF37]'"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Responsive Grid: 2 columns mobile, 3-4 columns desktop -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Bottom Action to View Full Catalog -->
    <div class="mt-14 text-center">
      <NuxtLink
        to="/jackets"
        class="inline-flex items-center space-x-2 px-8 py-3.5 rounded bg-[#14181F] border border-[#2D3748] text-white hover:border-[#D4AF37] hover:text-[#D4AF37] font-semibold text-xs uppercase tracking-[0.2em] transition-all"
      >
        <span>View Full Catalog</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from '~/types/product';
import ProductCard from './ProductCard.vue';

const props = defineProps<{
  products: Product[];
}>();

const activeCategory = ref<string>('all');

const categories = [
  { id: 'all', name: 'All Jackets' },
  { id: 'bomber', name: 'Bombers' },
  { id: 'field', name: 'Field Jackets' },
  { id: 'parka', name: 'Parkas' },
  { id: 'overcoat', name: 'Overcoats' },
];

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return props.products;
  }
  return props.products.filter((p) => p.category === activeCategory.value);
});
</script>
