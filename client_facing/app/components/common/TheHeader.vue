<template>
  <header class="sticky top-0 z-40 bg-[#0B0D10]/95 backdrop-blur-md border-b border-[#1E2633] transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <!-- Brand Logo -->
        <div class="flex items-center space-x-3">
          <NuxtLink to="/" class="group flex items-center space-x-2 focus:outline-none">
            <span class="text-xl sm:text-2xl font-black tracking-[0.25em] text-white uppercase group-hover:text-[#D4AF37] transition-colors">
              Last Option
            </span>
            <span class="hidden sm:inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#14181F] text-[#D4AF37] border border-[#2D3748] font-semibold">
              Outerwear
            </span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase text-[#A0AEC0]">
          <NuxtLink
            to="/jackets"
            class="hover:text-white transition-colors duration-150 py-1"
            active-class="text-white border-b-2 border-[#D4AF37]"
          >
            Jackets
          </NuxtLink>
          <NuxtLink
            to="/#story"
            class="hover:text-white transition-colors duration-150 py-1"
          >
            Story
          </NuxtLink>
          <NuxtLink
            to="/#philosophy"
            class="hover:text-white transition-colors duration-150 py-1"
          >
            About
          </NuxtLink>
        </nav>

        <!-- Right Action Icons (Search, Cart, Mobile Toggle) -->
        <div class="flex items-center space-x-4 sm:space-x-6">
          <!-- Search Trigger -->
          <button
            type="button"
            @click="isSearchOpen = !isSearchOpen"
            class="text-[#A0AEC0] hover:text-white p-2 rounded-lg hover:bg-[#14181F] transition-colors"
            aria-label="Search Catalog"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Cart Trigger -->
          <button
            type="button"
            class="relative inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#14181F] border border-[#2D3748] hover:border-[#D4AF37] text-white text-xs font-semibold uppercase tracking-wider transition-all"
            aria-label="Shopping Cart"
          >
            <svg class="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Cart</span>
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1A202C] text-[#D4AF37] text-[11px] font-bold">
              0
            </span>
          </button>

          <!-- Mobile Menu Button -->
          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden text-[#A0AEC0] hover:text-white p-2 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Search Dropdown -->
    <div v-if="isSearchOpen" class="border-t border-[#1E2633] bg-[#14181F] px-4 py-3 sm:px-6">
      <div class="max-w-2xl mx-auto flex items-center space-x-3">
        <svg class="w-5 h-5 text-[#A0AEC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search jackets by style, material, or fit (e.g. Bomber, Parka, Wool)..."
          class="w-full bg-transparent border-0 text-white placeholder-[#718096] text-sm focus:ring-0 focus:outline-none"
          autofocus
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="text-xs text-[#A0AEC0] hover:text-white"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Mobile Drawer / Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t border-[#1E2633] bg-[#0B0D10] px-4 pt-3 pb-6 space-y-3">
      <NuxtLink
        to="/jackets"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#14181F] uppercase tracking-wider"
      >
        Jackets Catalog
      </NuxtLink>
      <NuxtLink
        to="/#story"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-[#A0AEC0] hover:text-white hover:bg-[#14181F] uppercase tracking-wider"
      >
        Brand Story
      </NuxtLink>
      <NuxtLink
        to="/#philosophy"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-[#A0AEC0] hover:text-white hover:bg-[#14181F] uppercase tracking-wider"
      >
        About &amp; Craft
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMobileMenuOpen = ref(false);
const isSearchOpen = ref(false);
const searchQuery = ref('');
</script>
