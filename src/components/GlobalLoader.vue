<template>
  <teleport to="body">
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-auto">
      <div class="flex flex-col items-center gap-4 p-6 rounded-lg">
        <div class="animate-spin rounded-full h-14 w-14 border-b-4 border-yellow-400"></div>
        <p class="text-white font-semibold">Завантаження...</p>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { isLoading } from '@/stores/loaderStore'
</script>

<style scoped>
/* ensure loader content is centered and visible */
</style>
