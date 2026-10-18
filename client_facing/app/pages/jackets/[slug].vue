<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
    <!-- Breadcrumbs -->
    <nav class="flex items-center space-x-2 text-xs text-[#718096] uppercase tracking-wider mb-8">
      <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
      <span>/</span>
      <NuxtLink to="/jackets" class="hover:text-white transition-colors">Jackets</NuxtLink>
      <span>/</span>
      <span class="text-[#D4AF37]">{{ product.title }}</span>
    </nav>

    <!-- Product Layout Grid: Left Gallery, Right Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      <!-- Image Gallery Preview -->
      <div class="space-y-4">
        <div class="relative w-full aspect-[3/4] bg-[#14181F] rounded-lg overflow-hidden border border-[#1E2633]">
          <img
            :src="product.images[0]?.imageUrl || '/images/hero/hero-editorial.jpg'"
            :alt="product.title"
            class="w-full h-full object-cover object-center"
          />
          <div class="absolute top-4 left-4">
            <span class="px-3 py-1 rounded bg-[#0B0D10]/80 backdrop-blur border border-[#2D3748] text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              {{ product.tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Product Details & Variants -->
      <div class="space-y-6">
        <div>
          <div class="inline-flex items-center space-x-2 text-xs text-[#D4AF37] mb-2 font-medium">
            <span>★★★★★</span>
            <span class="text-[#718096]">({{ product.reviewCount }} customer reviews)</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            {{ product.title }}
          </h1>
          <div class="flex items-baseline space-x-3 mt-3">
            <span class="text-2xl font-black text-white">
              {{ formatPrice(product.basePrice) }}
            </span>
            <span
              v-if="product.compareAtPrice"
              class="text-sm text-[#718096] line-through font-normal"
            >
              {{ formatPrice(product.compareAtPrice) }}
            </span>
            <span class="text-xs text-[#718096]">Inclusive of all taxes</span>
          </div>
        </div>

        <p class="text-sm text-[#A0AEC0] leading-relaxed">
          {{ product.description }}
        </p>

        <!-- Color Swatches -->
        <div class="space-y-3 pt-4 border-t border-[#1E2633]">
          <div class="flex items-center justify-between text-xs">
            <span class="uppercase tracking-wider font-semibold text-white">Color:</span>
            <span class="text-[#D4AF37]">{{ selectedColorName }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <button
              v-for="color in uniqueColors"
              :key="color.hex"
              type="button"
              @click="selectedColor = color.hex; selectedColorName = color.name"
              class="w-7 h-7 rounded-full border-2 transition-all p-0.5"
              :class="selectedColor === color.hex ? 'border-[#D4AF37] scale-110' : 'border-transparent hover:border-[#2D3748]'"
              :aria-label="color.name"
            >
              <span class="block w-full h-full rounded-full" :style="{ backgroundColor: color.hex }"></span>
            </button>
          </div>
        </div>

        <!-- Size Selector -->
        <div class="space-y-3 pt-4 border-t border-[#1E2633]">
          <div class="flex items-center justify-between text-xs">
            <span class="uppercase tracking-wider font-semibold text-white">Select Size:</span>
            <span class="text-[#718096]">True to size (Indian fit)</span>
          </div>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="size in ['S', 'M', 'L', 'XL', 'XXL']"
              :key="size"
              type="button"
              @click="selectedSize = size"
              class="py-2.5 rounded border text-xs font-bold uppercase tracking-wider transition-colors"
              :class="selectedSize === size
                ? 'bg-white text-[#0B0D10] border-white'
                : 'bg-[#14181F] text-[#A0AEC0] border-[#2D3748] hover:border-[#D4AF37] hover:text-white'"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Materials & Care -->
        <div class="space-y-2 pt-4 border-t border-[#1E2633] text-xs text-[#A0AEC0]">
          <p class="font-semibold uppercase tracking-wider text-white">Materials &amp; Care:</p>
          <p class="leading-relaxed">{{ product.materialsAndCare }}</p>
        </div>

        <!-- Back to Catalog Link -->
        <div class="pt-6">
          <NuxtLink
            to="/jackets"
            class="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] hover:text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to All Jackets</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- 404 State if product slug is invalid -->
  <div v-else class="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
    <h2 class="text-2xl font-bold text-white">Jacket Not Found</h2>
    <p class="text-sm text-[#A0AEC0]">The requested outerwear piece is unavailable or does not exist.</p>
    <NuxtLink
      to="/jackets"
      class="inline-flex items-center px-6 py-2.5 rounded bg-[#14181F] border border-[#2D3748] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider"
    >
      Return to Catalog
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProducts } from '~/composables/useProducts';
import { formatPrice } from '~/types/product';

const route = useRoute();
const { getProductBySlug } = useProducts();

const slug = computed(() => route.params.slug as string);
const product = computed(() => getProductBySlug(slug.value));

const selectedSize = ref<string>('M');

const uniqueColors = computed(() => {
  if (!product.value) return [];
  const map = new Map<string, { name: string; hex: string }>();
  for (const v of product.value.variants) {
    if (!map.has(v.colorHex)) {
      map.set(v.colorHex, { name: v.colorName, hex: v.colorHex });
    }
  }
  return Array.from(map.values());
});

const selectedColor = ref<string>('');
const selectedColorName = ref<string>('');

if (uniqueColors.value.length > 0) {
  selectedColor.value = uniqueColors.value[0]?.hex || '';
  selectedColorName.value = uniqueColors.value[0]?.name || '';
}

useSeoMeta({
  title: computed(() => product.value ? `${product.value.title} | Last Option` : 'Outerwear | Last Option'),
  description: computed(() => product.value?.description || "Last Option premium men's jackets."),
});
</script>
