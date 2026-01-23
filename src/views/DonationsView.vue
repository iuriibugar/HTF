<template>
  <div class="relative min-h-screen bg-cover bg-center bg-fixed overflow-y-auto" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- Затемнення фону -->
    <div class="absolute inset-0 bg-black opacity-40"></div>

    <!-- Весь контент -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <!-- Хедер -->
      <div class="bg-gray-800">
        <Header />
      </div>

      <!-- Основний контент -->
      <div class="flex-1 p-2 sm:p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Заголовок -->
          <div class="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6">
            <h1 class="text-4xl font-bold text-gray-800 text-center mb-4 flex items-center justify-center gap-3">
              <span class="text-5xl">💙💛</span>
              Допомога Збройним Силам України
            </h1>
            <p class="text-center text-gray-600 text-lg">
              Наш клуб підтримує захисників України. Долучайтесь до збору коштів!
            </p>
          </div>

          <!-- Завантаження -->
          <div v-if="loading" class="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Завантаження...</p>
          </div>

          <!-- Немає донатів -->
          <div v-else-if="donations.length === 0" class="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 text-xl">На даний момент немає активних зборів</p>
          </div>

          <!-- Список донатів -->
          <div v-else :class="gridClasses">
            <div 
              v-for="donation in donations" 
              :key="donation.id"
              class="bg-white bg-opacity-95 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              
              <!-- Зображення -->
              <div v-if="donation.imageBase64" class="w-full h-64 overflow-hidden bg-gray-200">
                <img 
                  :src="donation.imageBase64" 
                  :alt="donation.title"
                  class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-full h-64 bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center">
                <span class="text-white text-6xl">💙💛</span>
              </div>
              
              <!-- Контент -->
              <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-3">{{ donation.title }}</h2>
                <p class="text-gray-600 mb-6 leading-relaxed">{{ donation.description }}</p>
                
                <!-- Кнопка донату -->
                <a 
                  :href="donation.link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
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
          <div class="mt-8 bg-gradient-to-r from-blue-600 to-yellow-500 bg-opacity-95 rounded-2xl shadow-2xl p-6 md:p-8 text-white">
            <h3 class="text-2xl font-bold mb-4 text-center">🇺🇦 Разом до перемоги!</h3>
            <p class="text-center text-lg mb-4">
              Кожна гривня наближає нас до перемоги. Дякуємо за вашу підтримку!
            </p>
            <p class="text-center text-sm opacity-90">
              Всі кошти йдуть безпосередньо на потреби ЗСУ
            </p>
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
import Header from '@/components/htfHeader.vue'
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
