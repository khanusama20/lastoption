<template>
  <section id="philosophy" class="bg-[#14181F] border-y border-[#1E2633] py-20 sm:py-28 relative overflow-hidden">
    <!-- Subtle Background Ambient Glow -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Philosophy Header matching Wireframe 2.1 -->
      <div class="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Brand Philosophy</p>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-snug">
          "Why Last Option? Because once you wear this, you won't need another."
        </h2>
        <p class="text-sm sm:text-base text-[#A0AEC0] font-light leading-relaxed">
          Fast fashion thrives on planned obsolescence. Last Option was founded on the opposite premise: engineering garments with such deliberate tailoring, heavyweight fabrics, and structural durability that it becomes the final outerwear piece you ever need to buy.
        </p>
      </div>

      <!-- Value Propositions matching Wireframe 2.1 -->
      <!-- [100% Weatherproof] [Reinforced Stitching] [Tailored Fit Guarantee] -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature 1: 100% Weatherproof -->
        <div class="p-8 rounded-lg bg-[#0B0D10] border border-[#1E2633] hover:border-[#D4AF37]/40 transition-colors space-y-4">
          <div class="w-12 h-12 rounded-lg bg-[#14181F] border border-[#2D3748] flex items-center justify-center text-[#D4AF37]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white uppercase tracking-wider">100% Weatherproof</h3>
          <p class="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed">
            DWR water-repellent nanotech coatings and breathable sealed membranes designed to withstand torrential monsoons and abrasive gusts without soaking through.
          </p>
        </div>

        <!-- Feature 2: Reinforced Stitching -->
        <div class="p-8 rounded-lg bg-[#0B0D10] border border-[#1E2633] hover:border-[#D4AF37]/40 transition-colors space-y-4">
          <div class="w-12 h-12 rounded-lg bg-[#14181F] border border-[#2D3748] flex items-center justify-center text-[#D4AF37]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white uppercase tracking-wider">Reinforced Stitching</h3>
          <p class="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed">
            Bar-tacked stress points, twin-needle lap seams, and heavy-gauge bonded nylon threads guarantee your jacket maintains structural integrity year after year.
          </p>
        </div>

        <!-- Feature 3: Tailored Fit Guarantee -->
        <div class="p-8 rounded-lg bg-[#0B0D10] border border-[#1E2633] hover:border-[#D4AF37]/40 transition-colors space-y-4">
          <div class="w-12 h-12 rounded-lg bg-[#14181F] border border-[#2D3748] flex items-center justify-center text-[#D4AF37]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white uppercase tracking-wider">Tailored Fit Guarantee</h3>
          <p class="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed">
            Engineered with a high-armhole cut and tapered torso drape. Sized precisely for the Indian male silhouette with free doorstep sizing exchanges if needed.
          </p>
        </div>
      </div>

      <!-- Approved Value Propositions matching Requirements 3.1 -->
      <div id="story" class="mt-16 pt-12 border-t border-[#1E2633] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="space-y-1">
          <p class="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Free Express Shipping</p>
          <p class="text-xs text-[#718096]">On orders above ₹2,999 across India</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Secure Payments</p>
          <p class="text-xs text-[#718096]">UPI, Cards &amp; NetBanking via Razorpay</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Cash on Delivery</p>
          <p class="text-xs text-[#718096]">Available with instant phone OTP</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Easy Exchanges</p>
          <p class="text-xs text-[#718096]">Tailored fit guarantee</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Brand Philosophy component matching Wireframe 2.1
</script>
