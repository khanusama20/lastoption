<template>
  <div class="space-y-0">
    <!-- Editorial Hero Section -->
    <HeroBanner />

    <!-- Curated Featured Pieces Catalog Grid -->
    <ProductGrid :products="products" />

    <!-- Brand Philosophy & Craftsmanship Section -->
    <BrandPhilosophy />
  </div>
</template>

<script setup lang="ts">
import { useProducts } from '~/composables/useProducts';
import HeroBanner from '~/components/home/HeroBanner.vue';
import ProductGrid from '~/components/product/ProductGrid.vue';
import BrandPhilosophy from '~/components/home/BrandPhilosophy.vue';

// Fetch products through the decoupled data access composable
const { products } = useProducts();

// Dynamic SEO metadata
useSeoMeta({
  title: "Last Option | Men's Premium Jackets & Outerwear",
  description: "Direct-to-consumer luxury men's jackets. Structured elegance, heavyweight water-resistant fabrics, built to endure.",
  ogTitle: "Last Option — Men's Premium Jackets",
  ogDescription: "Structured Elegance. Built to Endure. Explore the Autumn/Winter collection.",
  ogImage: '/images/hero/hero-editorial.jpg',
});
</script>
