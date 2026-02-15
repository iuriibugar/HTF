<template>
  <div class="relative min-h-screen bg-cover bg-center bg-fixed overflow-y-auto" :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: isMobile ? (viewportW + 'px ' + viewportH + 'px') : 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: isMobile ? 'scroll' : 'fixed', backgroundPosition: isMobile ? 'center top' : 'center' }">
    <!-- Затемнення фону -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Весь контент -->
    <div class="relative z-10">
      <!-- Хедер -->
      <HeaderWrapper />

      <!-- Основний контент -->
      <div class="flex-1 p-2 sm:p-4 md:p-8">
        <div class="mx-auto" style="max-width: 80%;">
          <!-- Заголовок -->
          <div class="mb-8">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-2 flex items-center justify-center gap-2">
              <span class="text-2xl md:text-3xl"></span>
              Тренерський склад
            </h1>
          </div>

          <!-- Завантаження -->
          <div v-if="loading" class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-12 text-center border-2 border-yellow-400">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p class="text-white text-lg">Завантаження тренерів...</p>
          </div>

          <!-- Немає тренерів -->
          <div v-else-if="trainers.length === 0" class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-12 text-center border-2 border-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292m0 0H8.646m3.354 0H16M12 20h8a2 2 0 002-2V6a2 2 0 00-2-2h-8" />
            </svg>
            <p class="text-white text-xl">На даний момент немає доступних тренерів</p>
          </div>

          <!-- Список тренерів (вертикально) -->
          <div v-else class="space-y-6">
            <div 
              v-for="trainer in trainers" 
              :key="trainer.id"
              class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl border-2 border-yellow-400">
              
              <!-- Контент тренера -->
              <div class="flex flex-col lg:flex-row">
                <!-- Дів з фото (зліва на MD вверх) -->
                <div class="w-full lg:w-1/3 flex flex-col items-center justify-center p-4 sm:p-6">
                  <div v-if="trainer.imageBase64" class="w-48 h-64 sm:w-56 sm:h-72 rounded-xl overflow-hidden bg-gray-700 shadow-lg">
                    <img 
                      :src="trainer.imageBase64" 
                      :alt="`${trainer.firstName} ${trainer.lastName}`"
                      class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-48 h-64 sm:w-56 sm:h-72 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center rounded-xl shadow-lg">
                    <span class="text-white text-6xl sm:text-7xl">👤</span>
                  </div>
                </div>

                <!-- Дів інформації (справа на MD, унизу на мобільних) -->
                <div class="w-full lg:w-2/3 flex flex-col justify-center p-4 sm:p-6 md:p-8">
                  <!-- Ім'я та призвище -->
                  <div class="mb-3 sm:mb-4 text-center lg:text-left">
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400">
                      {{ trainer.firstName }}
                    </h2>
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400">
                      {{ trainer.lastName }}
                    </h2>
                  </div>

                  <!-- Опис -->
                  <p class="text-white mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base md:text-lg text-center lg:text-left">
                    {{ trainer.description }}
                  </p>

                  <!-- Instagram посилання -->
                  <div class="flex justify-center lg:justify-start">
                    <a 
                      v-if="trainer.instagramLink"
                      :href="trainer.instagramLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-purple-400 text-sm sm:text-base">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm4.846-10.405c0 .795.645 1.44 1.44 1.44s1.44-.645 1.44-1.44-.645-1.44-1.44-1.44-1.44.645-1.44 1.44z"/>
                      </svg>
                      Instagram
                    </a>
                    <div v-else class="text-gray-400 text-sm italic">
                      Instagram посилання недоступне
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Футер -->
      <htfFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import HeaderWrapper from '@/components/HeaderWrapper.vue'
import htfFooter from '@/components/htfFooter.vue'
import backgroundImage from '@/assets/background.png'
import backgroundMob from '@/assets/backgroundMob.png'
import { getAllTrainers } from '@/services/trainerService'

const trainers = ref([])
const loading = ref(false)
const isMobile = ref(false)
const viewportW = ref(0)
const viewportH = ref(0)
const bgImage = computed(() => isMobile.value ? backgroundMob : backgroundImage)

function _checkMobile() {
  viewportW.value = window.innerWidth
  viewportH.value = window.innerHeight
  isMobile.value = viewportW.value < 768
}

// Завантажити тренерів
const loadTrainers = async () => {
  try {
    loading.value = true
    const data = await getAllTrainers()
    // Сортуємо тренерів за порядком (order)
    trainers.value = data.sort((a, b) => (a.order || 999) - (b.order || 999))
  } catch (error) {
    console.error('Помилка при завантаженні тренерів:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  _checkMobile()
  window.addEventListener('resize', _checkMobile)
  loadTrainers()
})

onUnmounted(() => {
  window.removeEventListener('resize', _checkMobile)
})
</script>

<style scoped>
/* Додаткові стилі за необхідності */
</style>
