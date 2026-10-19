<template>
  <section class="relative w-full bg-[#0B0D10] overflow-hidden border-b border-[#1E2633]">
    <!-- Hero Background Image with Gradient Overlay -->
    <div class="relative h-[75vh] min-h-[520px] max-h-[820px] w-full">
      <img
        src="/images/hero/hero-editorial.jpg"
        alt="Last Option Men's Outerwear Collection"
        class="w-full h-full object-cover object-top filter brightness-[0.78] contrast-[1.05]"
        loading="eager"
      />
      <!-- Luxury Dark Gradient Overlays -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/40 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#0B0D10]/80 via-transparent to-[#0B0D10]/30"></div>

      <!-- Content Container -->
      <div class="absolute inset-0 flex items-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="max-w-2xl space-y-6">
            <!-- Brand Badge -->
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14181F]/90 backdrop-blur border border-[#2D3748] text-xs text-[#D4AF37]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              <span class="font-medium tracking-wider uppercase">Outerwear Collection</span>
            </div>

            <!-- Wireframe Title -->
            <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-normal sm:tracking-tight text-white uppercase leading-[1.12] break-words">
              Structured Elegance.<br />
              <span class="text-[#D4AF37]">Built to Endure.</span>
            </h1>

            <!-- Wireframe Subheading -->
            <p class="text-[#CBD5E1] text-base sm:text-xl font-light leading-relaxed max-w-xl">
              Crafted from premium water-resistant twill and full-grain leather. Uncompromising outerwear engineered for the modern man.
            </p>

            <!-- Call-to-action button -->
            <div class="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="#featured-jackets"
                class="inline-flex items-center justify-center px-8 py-3.5 rounded bg-white text-[#0B0D10] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-[#0B0D10] transition-all duration-200 shadow-lg shadow-black/50"
              >
                Explore Jackets
              </a>
              <NuxtLink
                to="/#philosophy"
                class="inline-flex items-center justify-center px-6 py-3.5 rounded bg-[#14181F]/80 backdrop-blur border border-[#2D3748] text-white hover:border-[#D4AF37] font-semibold text-xs uppercase tracking-[0.18em] transition-all duration-200"
              >
                The Philosophy
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Hero banner component matching Wireframe 2.1
</script>
