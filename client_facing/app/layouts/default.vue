<template>
  <div class="min-h-screen bg-[#0B0D10] text-[#E2E8F0] flex flex-col font-sans antialiased w-full max-w-full overflow-x-hidden">
    <!-- Announcement Bar -->
    <AnnouncementBar />

    <!-- Navigation Header -->
    <TheHeader />

    <!-- Page Content -->
    <main class="flex-grow w-full max-w-full overflow-x-hidden min-w-0">
      <slot />
    </main>

    <!-- Global Storefront Footer -->
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
// Default Storefront Layout
</script>
