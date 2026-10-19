<template>
  <div class="group relative flex flex-col bg-[#14181F] border border-[#1E2633] rounded-lg overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300">
    <!-- Image Container with Aspect Ratio 3:4 -->
    <div class="relative w-full aspect-[3/4] bg-[#0E1217] overflow-hidden">
      <img
        :src="product.images[0]?.imageUrl || '/images/hero/hero-editorial.jpg'"
        :alt="product.images[0]?.altText || product.title"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />

      <!-- Subtle Dark Vignette -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#14181F]/70 via-transparent to-transparent pointer-events-none"></div>

      <!-- Tag Badge (Top Left) -->
      <div class="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
        <span class="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-[#0B0D10]/85 backdrop-blur border border-[#2D3748] text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
          {{ product.tag }}
        </span>
      </div>

      <!-- Stock Alert Badge (Stacked below tag on mobile, Top Right on desktop) -->
      <div v-if="lowStockVariant" class="absolute top-8 left-2.5 sm:top-3 sm:left-auto sm:right-3 z-10">
        <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-950/90 backdrop-blur border border-amber-600/50 text-[9px] sm:text-[10px] font-semibold text-amber-300 tracking-wide">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span class="hidden sm:inline">Only {{ lowStockVariant.stockQuantity }} left in {{ lowStockVariant.size }}</span>
          <span class="sm:hidden">{{ lowStockVariant.stockQuantity }} left ({{ lowStockVariant.size }})</span>
        </span>
      </div>

      <!-- Quick Action Overlay on Desktop Hover -->
      <div class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <NuxtLink
          :to="`/jackets/${product.slug}`"
          class="w-full py-2.5 rounded bg-[#0B0D10]/95 backdrop-blur border border-[#2D3748] text-white hover:text-[#0B0D10] hover:bg-[#D4AF37] font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center space-x-1 transition-colors"
        >
          <span>View Details</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Product Info Section -->
    <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
      <div>
        <NuxtLink :to="`/jackets/${product.slug}`" class="focus:outline-none">
          <h3 class="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">
            {{ product.title }}
          </h3>
        </NuxtLink>

        <!-- Price in INR (formatted via formatPrice utility) -->
        <div class="flex items-baseline space-x-2 mt-1">
          <span class="text-base font-extrabold text-white">
            {{ formatPrice(product.basePrice) }}
          </span>
          <span
            v-if="product.compareAtPrice"
            class="text-xs text-[#718096] line-through font-normal"
          >
            {{ formatPrice(product.compareAtPrice) }}
          </span>
          <span
            v-if="discountPercentage"
            class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider"
          >
            Save {{ discountPercentage }}%
          </span>
        </div>
      </div>

      <!-- Colors Swatches matching Wireframe: Colors: [o][o] -->
      <div class="pt-2 border-t border-[#1E2633] flex items-center justify-between gap-1 overflow-hidden">
        <div class="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          <span class="text-[10px] sm:text-[11px] text-[#718096] uppercase tracking-wider mr-0.5">Colors:</span>
          <button
            v-for="color in uniqueColors"
            :key="color.hex"
            type="button"
            :title="color.name"
            @click="selectedColor = color.name"
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all"
            :class="selectedColor === color.name ? 'border-white scale-125' : 'border-[#2D3748] hover:border-gray-400'"
            :style="{ backgroundColor: color.hex }"
            :aria-label="`Select color ${color.name}`"
          ></button>
        </div>
        <span class="text-[10px] sm:text-[11px] text-[#A0AEC0] truncate max-w-[65px] sm:max-w-none text-right">
          {{ selectedColor || uniqueColors[0]?.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from '~/types/product';
import { formatPrice } from '~/types/product';

const props = defineProps<{
  product: Product;
}>();

const selectedColor = ref<string>('');

// Extract unique color options from variants
const uniqueColors = computed(() => {
  const map = new Map<string, { name: string; hex: string }>();
  for (const variant of props.product.variants) {
    if (!map.has(variant.colorHex)) {
      map.set(variant.colorHex, { name: variant.colorName, hex: variant.colorHex });
    }
  }
  return Array.from(map.values());
});

// Identify any variant with low stock (< 3 units)
const lowStockVariant = computed(() => {
  return props.product.variants.find((v) => v.stockQuantity > 0 && v.stockQuantity <= 3);
});

// Calculate discount percentage if compareAtPrice is present
const discountPercentage = computed(() => {
  if (!props.product.compareAtPrice || props.product.compareAtPrice <= props.product.basePrice) {
    return null;
  }
  const diff = props.product.compareAtPrice - props.product.basePrice;
  return Math.round((diff / props.product.compareAtPrice) * 100);
});
</script>
