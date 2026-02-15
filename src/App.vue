<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VersionUpdatePopup from '@/components/VersionUpdatePopup.vue'
import GlobalLoader from '@/components/GlobalLoader.vue'
import { checkForUpdates, initializeVersion } from '@/services/versionService'

// Стан для модального вікна оновлення
const showUpdatePopup = ref(false)
const updateInfo = ref({
  localVersion: '1.0.0',
  remoteVersion: '1.0.0'
})

// ID інтервалу для очистки
let versionCheckInterval = null

/**
 * Перевірити оновлення версії
 */
async function checkVersionUpdate() {
  try {
    const result = await checkForUpdates()
    
    if (result.hasUpdate && result.localVersion !== result.remoteVersion) {
      updateInfo.value = {
        localVersion: result.localVersion,
        remoteVersion: result.remoteVersion
      }
      showUpdatePopup.value = true
    }
    
  } catch (error) {
    console.error('Помилка при перевірці версії:', error)
  }
}

/**
 * Закрити модальне вікно оновлення
 */
function handleCloseUpdatePopup() {
  showUpdatePopup.value = false
}

onMounted(async () => {
  // Initialize version storage on first load, then check for updates
  await initializeVersion()
  checkVersionUpdate()

  versionCheckInterval = setInterval(() => {
    checkVersionUpdate()
  }, 600000) // 10 хвилин
})

onUnmounted(() => {
  // Очищуємо інтервал при закритті компонента
  if (versionCheckInterval) {
    clearInterval(versionCheckInterval)
  }
})
</script>

<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <router-view />
    <GlobalLoader />
    <VersionUpdatePopup 
      :show="showUpdatePopup"
      :local-version="updateInfo.localVersion"
      :remote-version="updateInfo.remoteVersion"
      @close="handleCloseUpdatePopup"
    />
  </div>
</template>

<style>
/* Кастомний scrollbar для всіх сторінок */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: #fbbf24; /* yellow-400 */
  border-radius: 6px;
  border: 2px solid rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb:hover {
  background: #f59e0b; /* yellow-500 */
}

/* Firefox */
* {
  scrollbar-color: #fbbf24 rgba(0, 0, 0, 0.3);
  scrollbar-width: thin;
}
</style>