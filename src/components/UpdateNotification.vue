<template>
  <Teleport to="body">
    <div
      v-if="showNotification"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-gray-900 rounded-lg shadow-xl p-6 max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300 border-2 border-yellow-400"
      >
        <!-- Заголовок -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-yellow-400/20"
          >
            <svg
              class="h-6 w-6 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-yellow-400">Нова версія доступна</h2>
        </div>

        <!-- Текст -->
        <p class="text-gray-100 mb-2">
          Доступна нова версія додатку v{{ newVersion }}.
        </p>
        <p class="text-gray-300 mb-6 text-sm">
          Для отримання останніх обновлень та виправлень натисніть кнопку оновлення.
        </p>

        <!-- Кнопка -->
        <div class="flex gap-3">
          <button
            @click="handleUpdate"
            :disabled="isUpdating"
            class="w-full px-4 py-2 text-black bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span v-if="!isUpdating">Оновити зараз</span>
            <span v-else class="flex items-center gap-2">
              <svg
                class="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Оновлення...
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import versionService from '@/services/versionService'

const showNotification = ref(false)
const newVersion = ref('')
const isUpdating = ref(false)

let unsubscribe = null

const handleUpdate = async () => {
  isUpdating.value = true
  
  // Закриваємо поп-ап одразу
  showNotification.value = false
  
  // Затримка щоб користувач мав час побачити закриття поп-ап
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Запускаємо оновлення
  await versionService.updateApp()
}

onMounted(() => {
  // Ініціалізуємо сервіс - виконується один раз при завантаженні
  versionService.initialize()
  
  // Підписуємось на оновлення версії
  unsubscribe = versionService.subscribe((version) => {
    newVersion.value = version
    showNotification.value = true
  })

  // Запускаємо періодичну перевірку кожні 5 хвилин
  versionService.startPeriodicCheck()
})

onUnmounted(() => {
  // Відписуємось від оновлень версії
  if (unsubscribe) {
    unsubscribe()
  }

  // Зупиняємо періодичну перевірку
  versionService.stopPeriodicCheck()
})
</script>
