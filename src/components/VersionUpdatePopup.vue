<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click="handleBackdropClick"
    >
      <div
        class="bg-slate-950 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all border-3 border-yellow-400"
        @click.stop
      >
        <!-- Header with icon -->
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-yellow-400 p-2 rounded-lg">
            <span class="text-2xl">🔄</span>
          </div>
          <h2 class="text-2xl font-bold text-yellow-400">
            Оновлення доступне
          </h2>
        </div>

        <!-- Body -->
        <div class="mb-8">
          <p class="text-gray-200 mb-5 font-medium">
            Доступна нова версія застосунку: 
            <span class="text-yellow-400 font-bold text-lg ml-2">{{ remoteVersion }}</span>
          </p>
        </div>

        <!-- Info text -->
        <p class="text-sm text-gray-300 mb-8 leading-relaxed">
          Натисніть кнопку нижче, щоб оновити застосунок до нової версії та отримати всі останні вдосконалення та виправлення.
        </p>

        <!-- Footer -->
        <button
          @click="handleUpdate"
          class="w-full px-6 py-3 bg-yellow-400 text-slate-900 font-bold text-lg rounded-xl hover:bg-yellow-300 hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="isUpdating"
        >
          <span v-if="!isUpdating" class="flex items-center gap-2">
            ⚡ Оновити зараз
          </span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Оновлюємо...
          </span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { setLocalVersion } from '@/services/versionService'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  localVersion: {
    type: String,
    default: '1.0.0'
  },
  remoteVersion: {
    type: String,
    default: '1.0.1'
  }
})

const emit = defineEmits(['close', 'update'])

const isUpdating = ref(false)
const isVisible = ref(props.show)

// Синхронізуємо isVisible з prop show
watch(() => props.show, (newValue) => {
  isVisible.value = newValue
})

const handleBackdropClick = () => {
  // Не дозволяємо закривати при кліку на фон
  console.log('ℹ️ Оновлення обов\'язкове')
}

const handleUpdate = async () => {
  isUpdating.value = true
  try {
    setLocalVersion(props.remoteVersion)
    emit('update')
    
    setTimeout(() => {
      const currentUrl = window.location.href.split('?')[0]
      window.location.href = currentUrl + '?v=' + Date.now() + '#reload'
    }, 500)
  } catch (error) {
    console.error('Помилка при оновленні версії:', error)
    isUpdating.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
