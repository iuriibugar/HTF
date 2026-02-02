<template>
  <div class="relative min-h-screen bg-cover bg-center bg-fixed overflow-y-auto" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- Затемнення фону -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Весь контент -->
    <div class="relative z-10">
      <!-- Хедер -->
      <HeaderWrapper />

      <!-- Основний контент -->
      <div class="flex-1 p-2 sm:p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Заголовок -->
          <div class="mb-5">
            <h1 class="text-sm sm:text-base font-bold text-yellow-400 text-center mb-1 flex items-center justify-center gap-1">
              <span class="text-sm">💙💛</span>
              Підтримай захисників України!
            </h1>
          </div>

          <!-- Завантаження -->
          <div v-if="loading" class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-12 text-center border-2 border-yellow-400">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p class="text-white text-lg">Завантаження...</p>
          </div>

          <!-- Немає донатів -->
          <div v-else-if="donations.length === 0" class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-12 text-center border-2 border-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-white text-xl">На даний момент немає активних зборів</p>
          </div>

          <!-- Список донатів -->
          <div v-else :class="gridClasses">
            <div 
              v-for="donation in donations" 
              :key="donation.id"
              class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl border-2 border-yellow-400">
              
              <!-- Зображення -->
              <div v-if="donation.imageBase64" class="w-full h-64 overflow-hidden bg-gray-700">
                <img 
                  :src="donation.imageBase64" 
                  :alt="donation.title"
                  class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-b-2 border-yellow-400">
                <span class="text-white text-6xl">💙💛</span>
              </div>
              
              <!-- Контент -->
              <div class="p-6">
                <h2 class="text-2xl font-bold text-yellow-400 mb-3">{{ donation.title }}</h2>
                <p class="text-white mb-6 leading-relaxed">{{ donation.description }}</p>
                
                <!-- Кнопка донату -->
                <a 
                  :href="donation.link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-xl border-2 border-yellow-400">
                  <span class="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Підтримати збір
                  </span>
                </a>
                
                <!-- Дата оновлення -->
                <p class="text-xs text-gray-400 text-center mt-4">
                  Оновлено: {{ formatDate(donation.updatedAt) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Інформаційний блок -->
          <div class="mt-5 text-center">
            <h3 class="text-sm font-bold mb-1 text-center text-yellow-400">🇺🇦 Разом до перемоги!</h3>
            <p class="text-center text-xs mb-1 text-white">
              
            </p>
          </div>

          <!-- Футер -->
          <div class="mt-2">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import HeaderWrapper from '@/components/HeaderWrapper.vue'
import Footer from '@/components/htfFooter.vue'
import backgroundImage from '@/assets/background.png'

const loading = ref(false)
const donations = ref([])

// Динамічні класи сітки залежно від кількості донатів
const gridClasses = computed(() => {
  const count = donations.value.length
  
  if (count === 1) {
    // 1 донат - по центру, одна колонка
    return 'grid grid-cols-1 md:grid-cols-1 gap-6 max-w-md mx-auto'
  } else if (count === 2) {
    // 2 донати - по центру, дві колонки
    return 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'
  } else if (count === 3) {
    // 3 донати - по центру, три колонки
    return 'grid grid-cols-1 md:grid-cols-3 gap-6'
  } else {
    // 4+ донатів - дві колонки
    return 'grid grid-cols-1 md:grid-cols-2 gap-6'
  }
})

// Завантажити всі донати
async function loadDonations() {
  try {
    loading.value = true
    const querySnapshot = await getDocs(collection(db, 'donations'))
    
    donations.value = []
    querySnapshot.forEach(doc => {
      donations.value.push({ id: doc.id, ...doc.data() })
    })
    
    // Сортуємо за датою оновлення (новіші спочатку)
    donations.value.sort((a, b) => {
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    })
  } catch (error) {
    console.error('Помилка завантаження донатів:', error)
  } finally {
    loading.value = false
  }
}

// Форматування дати
function formatDate(dateStr) {
  if (!dateStr) return 'Невідомо'
  const date = new Date(dateStr)
  return date.toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadDonations()
})
</script>
