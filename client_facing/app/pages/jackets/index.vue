<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full min-w-0">
    <!-- Breadcrumbs -->
    <nav class="flex items-center space-x-2 text-xs text-[#718096] uppercase tracking-wider mb-6">
      <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
      <span>/</span>
      <span class="text-[#D4AF37]">Jackets</span>
    </nav>

    <!-- Catalog Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#1E2633] gap-6 w-full min-w-0">
      <div>
        <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight break-words">
          Men's Outerwear
        </h1>
        <p class="text-sm sm:text-base text-[#A0AEC0] mt-2 max-w-xl">
          Engineered for thermal protection and architectural drape. Discover our complete line of bombers, field jackets, technical parkas, and tailored overcoats.
        </p>
      </div>

      <!-- Sorting Selector -->
      <div class="flex items-center space-x-3 text-xs">
        <label for="sort" class="text-[#718096] uppercase tracking-wider font-semibold">Sort By:</label>
        <select
          id="sort"
          v-model="activeSort"
          class="bg-[#14181F] border border-[#2D3748] rounded px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
        >
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Customer Rated</option>
        </select>
      </div>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex items-center space-x-2 my-8 overflow-x-auto pb-2 scrollbar-none w-full max-w-full min-w-0">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        @click="activeCategory = cat.id"
        class="px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-colors shrink-0"
        :class="activeCategory === cat.id
          ? 'bg-white text-[#0B0D10]'
          : 'bg-[#14181F] text-[#A0AEC0] border border-[#2D3748] hover:text-white hover:border-[#D4AF37]'"
      >
        {{ cat.name }} ({{ getCategoryCount(cat.id) }})
      </button>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      <ProductCard
        v-for="product in sortedProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProducts } from '~/composables/useProducts';
import ProductCard from '~/components/product/ProductCard.vue';

const { products } = useProducts();

const activeCategory = ref<string>('all');
const activeSort = ref<string>('featured');

const categories = [
  { id: 'all', name: 'All Jackets' },
  { id: 'bomber', name: 'Bombers' },
  { id: 'field', name: 'Field Jackets' },
  { id: 'parka', name: 'Parkas' },
  { id: 'overcoat', name: 'Overcoats' },
];

const getCategoryCount = (categoryId: string) => {
  if (categoryId === 'all') return products.value.length;
  return products.value.filter((p) => p.category === categoryId).length;
};

const sortedProducts = computed(() => {
  let list = [...products.value];

  // Filter
  if (activeCategory.value !== 'all') {
    list = list.filter((p) => p.category === activeCategory.value);
  }

  // Sort
  if (activeSort.value === 'price-asc') {
    list.sort((a, b) => a.basePrice - b.basePrice);
  } else if (activeSort.value === 'price-desc') {
    list.sort((a, b) => b.basePrice - a.basePrice);
  } else if (activeSort.value === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
});

useSeoMeta({
  title: "Men's Jackets Catalog | Last Option",
  description: "Browse all premium outerwear jackets by Last Option. Water-resistant bombers, rugged field jackets, obsidian parkas, and wool overcoats.",
});
</script>
