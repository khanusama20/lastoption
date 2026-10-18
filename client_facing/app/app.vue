<template>
  <div class="min-h-screen bg-[#0B0D10] text-[#E2E8F0] flex flex-col justify-between font-sans antialiased">
    <!-- Header -->
    <header class="border-b border-[#1E2633] px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <span class="text-xl font-bold tracking-widest text-white uppercase">Last Option</span>
        <span class="text-xs px-2 py-0.5 rounded bg-[#1A202C] text-[#D4AF37] border border-[#2D3748] tracking-wider uppercase font-semibold">Outerwear</span>
      </div>
      <div class="flex items-center space-x-4 text-sm text-[#A0AEC0]">
        <span>Foundation v1.0</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-6 py-16">
      <div class="max-w-xl w-full text-center space-y-6">
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14181F] border border-[#2D3748] text-xs text-[#D4AF37]">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="font-medium tracking-wide">Nuxt 4 + Tailwind CSS Foundation Ready</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          STRUCTURED ELEGANCE.<br />BUILT TO ENDURE.
        </h1>

        <p class="text-[#A0AEC0] text-base sm:text-lg leading-relaxed">
          The foundation for the Last Option men's e-commerce platform has been established. Client-facing Nuxt 4 application and backend Express API are operational.
        </p>

        <div class="grid grid-cols-2 gap-4 pt-4 text-left">
          <div class="p-4 rounded-lg bg-[#14181F] border border-[#1E2633]">
            <p class="text-xs text-[#718096] uppercase tracking-wider font-semibold">Client Facing</p>
            <p class="text-sm font-medium text-white mt-1">Nuxt 4 (SSR) + Vue 3</p>
            <p class="text-xs text-emerald-400 mt-1">● Port 3000 Active</p>
          </div>
          <div class="p-4 rounded-lg bg-[#14181F] border border-[#1E2633]">
            <p class="text-xs text-[#718096] uppercase tracking-wider font-semibold">Backend API</p>
            <p class="text-sm font-medium text-white mt-1">Node.js + Express + TS</p>
            <p class="text-xs text-emerald-400 mt-1">● Port 5000 Active</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-[#1E2633] px-6 py-4 text-center text-xs text-[#718096]">
      © 2026 Last Option. All rights reserved. Built with Nuxt 4, Vue 3, Express, TypeScript &amp; Tailwind CSS.
    </footer>
  </div>
</template>
