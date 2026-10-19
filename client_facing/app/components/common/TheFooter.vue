<template>
  <footer class="bg-[#0B0D10] border-t border-[#1E2633] text-[#A0AEC0] text-sm mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- Brand Summary -->
        <div class="md:col-span-1 space-y-4">
          <div class="flex items-center space-x-2">
            <span class="text-lg font-black tracking-[0.25em] text-white uppercase">Last Option</span>
          </div>
          <p class="text-xs text-[#718096] leading-relaxed">
            Direct-to-consumer premium men's outerwear. Tailored precision, heavyweight fabrics, and relentless durability.
          </p>
          <div class="pt-2">
            <a
              v-if="whatsappUrl"
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-[#14181F] border border-[#2D3748] hover:border-[#D4AF37] text-white text-xs font-medium tracking-wide transition-colors"
            >
              <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.126-.532-1.832-.759-3.003-2.616-3.094-2.738-.093-.122-.749-.997-.749-1.903 0-.905.474-1.353.644-1.537.17-.185.372-.232.496-.232.125 0 .248.002.355.008.113.005.264-.043.414.316.155.372.531 1.297.578 1.391.047.094.078.204.016.328-.063.125-.094.204-.188.313-.094.11-.197.246-.282.33-.094.094-.191.196-.082.383.109.187.485.8 1.039 1.293.714.636 1.317.834 1.504.927.188.094.297.079.406-.047.11-.125.469-.546.594-.734.125-.187.25-.156.422-.093.172.062 1.094.516 1.282.609.187.094.312.141.359.219.047.078.047.452-.094.857z"/>
              </svg>
              <span>WhatsApp Concierge</span>
            </a>
            <span
              v-else
              class="inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-[#14181F] border border-[#2D3748] text-[#718096] text-xs font-medium tracking-wide cursor-not-allowed"
              title="WhatsApp customer support contact is pending environment configuration"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500/80"></span>
              <span>WhatsApp Support (Pending Setup)</span>
            </span>
          </div>
        </div>

        <!-- Catalog Links -->
        <div class="space-y-3">
          <p class="text-xs font-bold uppercase tracking-widest text-white">Jackets Collection</p>
          <ul class="space-y-2 text-xs">
            <li><NuxtLink to="/jackets" class="hover:text-white transition-colors">All Outerwear</NuxtLink></li>
            <li><NuxtLink to="/jackets" class="hover:text-white transition-colors">Minimal Bombers</NuxtLink></li>
            <li><NuxtLink to="/jackets" class="hover:text-white transition-colors">Heritage Field Jackets</NuxtLink></li>
            <li><NuxtLink to="/jackets" class="hover:text-white transition-colors">Obsidian Parkas</NuxtLink></li>
            <li><NuxtLink to="/jackets" class="hover:text-white transition-colors">Wool Overcoats</NuxtLink></li>
          </ul>
        </div>

        <!-- Customer Care & Policies -->
        <div class="space-y-3">
          <p class="text-xs font-bold uppercase tracking-widest text-white">Policies &amp; Care</p>
          <ul class="space-y-2 text-xs">
            <li><a href="#shipping-returns" class="hover:text-white transition-colors">Shipping &amp; Free Exchanges</a></li>
            <li><a href="#refund-policy" class="hover:text-white transition-colors">Refund &amp; Cancellation Policy</a></li>
            <li><a href="#privacy-policy" class="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#terms-of-service" class="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#size-guide" class="hover:text-white transition-colors">Jacket Sizing Guide</a></li>
          </ul>
        </div>

        <!-- Logistics & Payment Trust -->
        <div class="space-y-3">
          <p class="text-xs font-bold uppercase tracking-widest text-white">Direct-to-Consumer</p>
          <p class="text-xs text-[#718096] leading-relaxed">
            Exclusive direct-to-consumer men's outerwear tailored for Indian sizing and climate.
          </p>
          <div class="space-y-1 text-xs text-[#718096]">
            <p class="text-white font-medium">Payment Partners:</p>
            <p>Razorpay (UPI, Credit / Debit Cards, NetBanking) &amp; Verified COD.</p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-[#1E2633] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#718096] space-y-4 sm:space-y-0">
        <p>© 2026 Last Option (Men's Wear). All rights reserved.</p>
        <p class="text-[#4A5568]">
          Structured Elegance. Built to Endure.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const config = useRuntimeConfig();
const whatsappNumber = computed(() => (config.public.whatsappNumber as string) || '');

const whatsappUrl = computed(() => {
  if (!whatsappNumber.value) return null;
  const text = encodeURIComponent('Hello Last Option, I have an inquiry regarding outerwear.');
  return `https://wa.me/${whatsappNumber.value}?text=${text}`;
});
</script>
