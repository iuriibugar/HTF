<script setup>
import UpdateNotification from '@/components/UpdateNotification.vue'
</script>

<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <UpdateNotification />
    <router-view />
  </div>
</template>

<style scoped></style>