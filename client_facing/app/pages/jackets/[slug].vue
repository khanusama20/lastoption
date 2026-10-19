<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 pb-28 sm:pb-16">
    <!-- Breadcrumbs matching Wireframe 2.2 -->
    <nav class="flex items-center space-x-2 text-xs text-[#718096] uppercase tracking-wider mb-8">
      <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
      <span>/</span>
      <NuxtLink to="/jackets" class="hover:text-white transition-colors">Jackets</NuxtLink>
      <span>/</span>
      <span class="text-[#D4AF37]">{{ product.title }}</span>
    </nav>

    <!-- Product Layout Grid: Left Gallery, Right Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      <!-- Image Gallery Preview matching Wireframe 2.2 -->
      <div class="space-y-4">
        <div class="relative w-full aspect-[3/4] bg-[#14181F] rounded-lg overflow-hidden border border-[#1E2633]">
          <img
            :src="activeImage || product.images[0]?.imageUrl || '/images/hero/hero-editorial.jpg'"
            :alt="product.title"
            class="w-full h-full object-cover object-center"
          />
          <div class="absolute top-4 left-4">
            <span class="px-3 py-1 rounded bg-[#0B0D10]/80 backdrop-blur border border-[#2D3748] text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              {{ product.tag }}
            </span>
          </div>
        </div>

        <!-- Image Thumbnails (if multiple images exist) -->
        <div v-if="product.images.length > 1" class="flex items-center space-x-3">
          <button
            v-for="img in product.images"
            :key="img.id"
            type="button"
            @click="activeImage = img.imageUrl"
            class="w-16 h-20 rounded border overflow-hidden transition-all"
            :class="activeImage === img.imageUrl ? 'border-[#D4AF37]' : 'border-[#1E2633] opacity-70 hover:opacity-100'"
          >
            <img :src="img.imageUrl" :alt="img.altText" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Product Details & Purchase Funnel -->
      <div class="space-y-6">
        <div>
          <!-- Star Rating & Review Count matching Wireframe 2.2 -->
          <div class="inline-flex items-center space-x-2 text-xs text-[#D4AF37] mb-2 font-medium">
            <span>★★★★★</span>
            <span class="text-[#718096]">({{ product.reviewCount }} customer reviews)</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            {{ product.title }}
          </h1>

          <!-- Price in INR & Tax Note matching Wireframe 2.2 -->
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

        <!-- Product Description -->
        <p class="text-sm text-[#A0AEC0] leading-relaxed">
          {{ product.description }}
        </p>

        <!-- Color Swatches matching Wireframe 2.2 -->
        <div class="space-y-3 pt-4 border-t border-[#1E2633]">
          <div class="flex items-center justify-between text-xs">
            <span class="uppercase tracking-wider font-semibold text-white">
              Color: <span class="text-[#D4AF37] font-normal ml-1">{{ selectedColorName }}</span>
            </span>
          </div>
          <div class="flex items-center space-x-3">
            <button
              v-for="color in uniqueColors"
              :key="color.hex"
              type="button"
              @click="selectColor(color)"
              class="w-7 h-7 rounded-full border-2 transition-all p-0.5"
              :class="selectedColor === color.hex ? 'border-[#D4AF37] scale-110' : 'border-transparent hover:border-[#2D3748]'"
              :aria-label="color.name"
            >
              <span class="block w-full h-full rounded-full" :style="{ backgroundColor: color.hex }"></span>
            </button>
          </div>
        </div>

        <!-- Size Selector matching Wireframe 2.2 -->
        <div class="space-y-3 pt-4 border-t border-[#1E2633]">
          <div class="flex items-center justify-between text-xs">
            <span class="uppercase tracking-wider font-semibold text-white">Select Size:</span>
            <button
              type="button"
              @click="isSizeGuideOpen = true"
              class="text-[#D4AF37] hover:underline font-medium cursor-pointer"
            >
              Size Guide
            </button>
          </div>

          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="size in availableSizes"
              :key="size"
              type="button"
              @click="selectedSize = size"
              class="relative py-2.5 rounded border text-xs font-bold uppercase tracking-wider transition-colors"
              :class="[
                selectedSize === size
                  ? 'bg-white text-[#0B0D10] border-white'
                  : isSizeInStock(size)
                    ? 'bg-[#14181F] text-[#A0AEC0] border-[#2D3748] hover:border-[#D4AF37] hover:text-white'
                    : 'bg-[#0E1217] text-[#4A5568] border-[#1E2633] hover:border-[#2D3748]'
              ]"
            >
              {{ size }}
              <!-- Out of stock indicator dot on unavailable size -->
              <span
                v-if="!isSizeInStock(size)"
                class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E53E3E]"
                title="Out of stock in this color"
              ></span>
            </button>
          </div>

          <!-- Dynamic Stock Indicator matching Wireframe 2.2: (• M selected - 3 units left!) -->
          <div class="text-xs pt-1">
            <p v-if="activeVariant && activeVariant.stockQuantity > 0 && activeVariant.stockQuantity <= 3" class="text-amber-400 font-medium flex items-center space-x-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>• {{ selectedSize }} selected — only {{ activeVariant.stockQuantity }} units left!</span>
            </p>
            <p v-else-if="activeVariant && activeVariant.stockQuantity > 3" class="text-emerald-400 font-medium flex items-center space-x-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>• {{ selectedSize }} selected — In Stock (Ready to dispatch)</span>
            </p>
            <p v-else class="text-red-400 font-medium flex items-center space-x-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <span>• Size {{ selectedSize }} is currently out of stock in {{ selectedColorName }}</span>
            </p>
          </div>
        </div>

        <!-- Delivery Estimator matching Wireframe 2.2 -->
        <div class="space-y-2 pt-4 border-t border-[#1E2633]">
          <label for="pincode" class="block text-xs uppercase tracking-wider font-semibold text-white">
            Delivery Estimator:
          </label>
          <div class="flex items-center space-x-2">
            <input
              id="pincode"
              v-model="pincodeInput"
              type="text"
              maxlength="6"
              placeholder="Enter 6-digit Pincode"
              class="w-48 bg-[#14181F] border border-[#2D3748] rounded px-3 py-2 text-xs text-white placeholder-[#718096] focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="button"
              @click="checkPincode"
              class="px-4 py-2 rounded bg-[#14181F] border border-[#2D3748] text-xs font-semibold uppercase tracking-wider text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Check
            </button>
          </div>
          <p v-if="pincodeMessage" class="text-xs pt-1 flex items-center space-x-1.5" :class="isPincodeValid ? 'text-[#A0AEC0]' : 'text-amber-400'">
            <span class="text-[#D4AF37]">→</span>
            <span>{{ pincodeMessage }}</span>
          </p>
        </div>

        <!-- Desktop Action Buttons matching Wireframe 2.2 -->
        <div class="space-y-3 pt-4 border-t border-[#1E2633]">
          <!-- Add to Cart Button (Primary) -->
          <button
            type="button"
            :disabled="isOutOfStock"
            class="w-full py-4 rounded font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2"
            :class="isOutOfStock
              ? 'bg-[#1E2633] text-[#718096] cursor-not-allowed border border-[#2D3748]'
              : 'bg-white text-[#0B0D10] hover:bg-[#D4AF37] hover:text-[#0B0D10] shadow-lg shadow-black/50 cursor-pointer'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>{{ isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}</span>
          </button>

          <!-- Buy Now Button (Secondary) -->
          <button
            type="button"
            :disabled="isOutOfStock"
            class="w-full py-3.5 rounded font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2"
            :class="isOutOfStock
              ? 'bg-[#14181F]/50 text-[#4A5568] border border-[#1E2633] cursor-not-allowed'
              : 'bg-[#14181F] text-white border border-[#2D3748] hover:border-[#D4AF37] hover:text-[#D4AF37] cursor-pointer'"
          >
            <span>{{ isOutOfStock ? 'Unavailable' : 'Buy Now' }}</span>
          </button>
        </div>

        <!-- Accordions: Materials, Shipping & Returns matching Wireframe 2.2 -->
        <div class="space-y-3 pt-4 border-t border-[#1E2633] text-xs">
          <!-- Materials & Care Accordion -->
          <div class="border border-[#1E2633] rounded bg-[#0E1217] overflow-hidden">
            <button
              type="button"
              @click="isMaterialsOpen = !isMaterialsOpen"
              class="w-full px-4 py-3 flex items-center justify-between text-left font-semibold uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors"
            >
              <span>Materials &amp; Garment Care</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="isMaterialsOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="isMaterialsOpen" class="px-4 pb-4 pt-1 text-[#A0AEC0] leading-relaxed border-t border-[#1E2633]/50">
              {{ product.materialsAndCare }}
            </div>
          </div>

          <!-- Shipping & Free Exchanges Accordion -->
          <div class="border border-[#1E2633] rounded bg-[#0E1217] overflow-hidden">
            <button
              type="button"
              @click="isShippingOpen = !isShippingOpen"
              class="w-full px-4 py-3 flex items-center justify-between text-left font-semibold uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors"
            >
              <span>Shipping &amp; Free Exchanges</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="isShippingOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="isShippingOpen" class="px-4 pb-4 pt-1 text-[#A0AEC0] leading-relaxed space-y-2 border-t border-[#1E2633]/50">
              <p>• Free express shipping on all orders over ₹2,999 across India.</p>
              <p>• 7-day doorstep size exchange guarantee. If the fit isn't right, we exchange it free of charge.</p>
              <p>• Cash on delivery available with phone OTP verification.</p>
            </div>
          </div>
        </div>

        <!-- Back to Catalog Link -->
        <div class="pt-4">
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

    <!-- Mobile Sticky Action Bar matching Requirements 3.3 -->
    <div
      class="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0B0D10]/95 backdrop-blur-md border-t border-[#1E2633] px-3 py-2.5 shadow-2xl"
    >
      <div class="flex items-center space-x-2 w-full">
        <!-- Add to Cart (Mobile) -->
        <button
          type="button"
          :disabled="isOutOfStock"
          class="flex-1 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
          :class="isOutOfStock
            ? 'bg-[#1E2633] text-[#718096] cursor-not-allowed border border-[#2D3748]'
            : 'bg-white text-[#0B0D10] hover:bg-[#D4AF37]'"
        >
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span class="truncate">{{ isOutOfStock ? 'Sold Out' : 'Add to Cart' }}</span>
        </button>

        <!-- Buy Now (Mobile) -->
        <button
          type="button"
          :disabled="isOutOfStock"
          class="flex-1 py-2.5 rounded font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center"
          :class="isOutOfStock
            ? 'bg-[#14181F]/50 text-[#4A5568] border border-[#1E2633] cursor-not-allowed'
            : 'bg-[#14181F] text-white border border-[#2D3748] hover:border-[#D4AF37]'"
        >
          <span class="truncate">{{ isOutOfStock ? 'Unavailable' : 'Buy Now' }}</span>
        </button>
      </div>
    </div>

    <!-- Size Guide Modal matching Wireframe 2.2 -->
    <div
      v-if="isSizeGuideOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="isSizeGuideOpen = false"
    >
      <div class="bg-[#14181F] border border-[#2D3748] rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div class="flex items-center justify-between border-b border-[#1E2633] pb-3">
          <h3 class="text-base font-bold text-white uppercase tracking-wider">Men's Jacket Size Guide</h3>
          <button
            type="button"
            @click="isSizeGuideOpen = false"
            class="text-[#A0AEC0] hover:text-white p-1 rounded"
            aria-label="Close Size Guide"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p class="text-xs text-[#A0AEC0]">
          Measurements below are garment dimensions in inches. Engineered for the Indian male silhouette with a high-armhole tailored drape.
        </p>

        <!-- Sizing Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#CBD5E1]">
            <thead class="border-b border-[#2D3748] text-[#D4AF37] uppercase tracking-wider">
              <tr>
                <th class="py-2 pr-3">Size</th>
                <th class="py-2 px-3">Chest</th>
                <th class="py-2 px-3">Shoulder</th>
                <th class="py-2 px-3">Length</th>
                <th class="py-2 pl-3">Sleeve</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1E2633]">
              <tr>
                <td class="py-2 pr-3 font-bold text-white">S</td>
                <td class="py-2 px-3">38"</td>
                <td class="py-2 px-3">17.5"</td>
                <td class="py-2 px-3">26.0"</td>
                <td class="py-2 pl-3">25.0"</td>
              </tr>
              <tr>
                <td class="py-2 pr-3 font-bold text-white">M</td>
                <td class="py-2 px-3">40"</td>
                <td class="py-2 px-3">18.0"</td>
                <td class="py-2 px-3">26.5"</td>
                <td class="py-2 pl-3">25.5"</td>
              </tr>
              <tr>
                <td class="py-2 pr-3 font-bold text-white">L</td>
                <td class="py-2 px-3">42"</td>
                <td class="py-2 px-3">18.5"</td>
                <td class="py-2 px-3">27.0"</td>
                <td class="py-2 pl-3">26.0"</td>
              </tr>
              <tr>
                <td class="py-2 pr-3 font-bold text-white">XL</td>
                <td class="py-2 px-3">44"</td>
                <td class="py-2 px-3">19.0"</td>
                <td class="py-2 px-3">27.5"</td>
                <td class="py-2 pl-3">26.5"</td>
              </tr>
              <tr>
                <td class="py-2 pr-3 font-bold text-white">XXL</td>
                <td class="py-2 px-3">46"</td>
                <td class="py-2 px-3">19.5"</td>
                <td class="py-2 px-3">28.0"</td>
                <td class="py-2 pl-3">27.0"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pt-2 border-t border-[#1E2633] flex justify-end">
          <button
            type="button"
            @click="isSizeGuideOpen = false"
            class="px-5 py-2 rounded bg-white text-[#0B0D10] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37]"
          >
            Got It
          </button>
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
import type { JacketSize } from '~/types/product';

const route = useRoute();
const { getProductBySlug } = useProducts();

const slug = computed(() => route.params.slug as string);
const product = computed(() => getProductBySlug(slug.value));

const availableSizes: JacketSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
const selectedSize = ref<JacketSize>('M');

const activeImage = ref<string>('');
const isSizeGuideOpen = ref<boolean>(false);
const isMaterialsOpen = ref<boolean>(true);
const isShippingOpen = ref<boolean>(false);

// Delivery Estimator State
const pincodeInput = ref<string>('');
const pincodeMessage = ref<string>('');
const isPincodeValid = ref<boolean>(false);

function checkPincode() {
  const cleanPin = pincodeInput.value.trim();
  if (/^\d{6}$/.test(cleanPin)) {
    isPincodeValid.value = true;
    pincodeMessage.value = `Estimated delivery by Friday via Delhivery Express (Pincode ${cleanPin} serviceable)`;
  } else {
    isPincodeValid.value = false;
    pincodeMessage.value = 'Please enter a valid 6-digit Indian PIN code';
  }
}

// Color Swatches
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

function selectColor(color: { name: string; hex: string }) {
  selectedColor.value = color.hex;
  selectedColorName.value = color.name;
}

// Active Variant based on selected color and size
const activeVariant = computed(() => {
  if (!product.value) return null;
  return product.value.variants.find(
    (v) => v.colorHex === selectedColor.value && v.size === selectedSize.value
  ) || null;
});

// Check if a given size is in stock for current selected color
function isSizeInStock(size: JacketSize): boolean {
  if (!product.value) return false;
  const variant = product.value.variants.find(
    (v) => v.colorHex === selectedColor.value && v.size === size
  );
  return !!variant && variant.stockQuantity > 0;
}

// Out of stock state for active selection
const isOutOfStock = computed(() => {
  return !activeVariant.value || activeVariant.value.stockQuantity <= 0;
});

useSeoMeta({
  title: computed(() => product.value ? `${product.value.title} | Last Option` : 'Outerwear | Last Option'),
  description: computed(() => product.value?.description || "Last Option premium men's jackets."),
});
</script>
