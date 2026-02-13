<template>
  <div class="relative min-h-screen bg-cover bg-center bg-fixed overflow-y-auto" :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: isMobile ? (viewportW + 'px ' + viewportH + 'px') : 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: isMobile ? 'scroll' : 'fixed', backgroundPosition: isMobile ? 'center top' : 'center' }">
    <!-- Затемнення фону -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Весь контент -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <!-- Хедер -->
      <HeaderWrapper />

      <!-- Основний контент -->
      <div class="flex-1 p-2 sm:p-4 md:p-8">
        <div class="max-w-6xl mx-auto">
          <!-- Заголовок -->
          <div class="mb-2 sm:mb-4">
            <h1 class="text-lg sm:text-2xl font-bold text-yellow-400 text-center mb-1 flex items-center justify-center gap-2">
              <span>📅</span>
              Розклад тренувань
            </h1>
            <p class="text-center text-white text-xs sm:text-sm" v-if="schedule">
              {{ formatDate(schedule.weekStart) }} - {{ formatDate(schedule.weekEnd) }}
            </p>
          </div>

          <!-- Завантаження -->
          <div v-if="loading" class="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-8 text-center border-2 border-yellow-400">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-2"></div>
            <p class="text-white text-sm">Завантаження розкладу...</p>
          </div>

          <!-- Немає розкладу -->
          <div v-else-if="!schedule || !schedule.trainings || schedule.trainings.length === 0" class="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-8 text-center border-2 border-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="text-white text-sm font-bold mb-1">Розклад ще не створений</p>
            <p class="text-gray-400 text-xs">Очікуйте оновлення від адміністратора</p>
          </div>

          <!-- Список тренувань -->
          <div v-else class="space-y-4 sm:space-y-6">
            <div v-for="(dayTrainings, dayName) in groupedTrainings" :key="dayName" class="border-2 border-yellow-400 rounded-xl overflow-hidden">
              <!-- Заголовок дня -->
              <div class="bg-gray-700/70 text-white px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-yellow-400 flex items-center justify-between">
                <h2 class="text-xl sm:text-2xl font-bold text-yellow-400">{{ dayName }}</h2>
                <p class="text-sm text-gray-300">{{ formatDate(dayTrainings[0].date) }}</p>
              </div>
              
              <!-- Тренування -->
              <div class="p-2 sm:p-4 space-y-3 sm:space-y-4 bg-gray-700/50">
                <div 
                  v-for="(training, idx) in dayTrainings" 
                  :key="idx"
                  class="p-3 sm:p-4 bg-gray-800 rounded-lg border-2 border-yellow-400"
                >
                  <!-- Верхня частина: інформація + кнопка -->
                  <div class="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <!-- Ліва частина: інформація про тренування -->
                    <div class="flex-1 w-full">
                      <!-- Назва, складність, оплата -->
                      <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <img :src="getTypeEmoji(training.type)" alt="icon" class="w-6 h-6" />
                        <h3 class="text-base sm:text-lg font-bold text-yellow-400">{{ training.name }}</h3>
                        <span 
                          :class="[
                            'px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold',
                            getDifficultyColor(training.difficulty)
                          ]"
                        >
                          {{ training.difficulty }}
                        </span>
                        <span 
                          v-if="training.isPaid"
                          class="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold bg-yellow-400 text-black"
                        >
                          💰 Платне
                        </span>
                      </div>
                      
                      <!-- Час, адреса, тип -->
                      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-300 text-xs sm:text-sm">
                        <div class="flex items-center gap-1 flex-shrink-0">
                          <span>⏰</span>
                          <span class="font-semibold">{{ training.time }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <span>📍</span>
                          <span>{{ training.address }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <img :src="getTypeEmoji(training.type)" :alt="training.type" class="w-4 h-4 object-contain" />
                          <span>{{ training.type }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Кнопка реєстрацій (фіксована вгорі справа) -->
                    <div class="flex-shrink-0 w-full sm:w-auto">
                      <button 
                        @click="toggleParticipants(training)"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors text-xs sm:text-sm font-semibold text-black"
                      >
                        <span>👥</span>
                        <span>{{ getRegistrationCount(training) }}</span>
                        <span class="text-xs">
                          {{ isParticipantsVisible(training) ? '▼' : '▶' }}
                        </span>
                      </button>
                    </div>
                  </div>

                  <!-- Список учасників (розгортається внизу, окремо) -->
                  <div 
                    v-if="isParticipantsVisible(training)" 
                    class="border-t border-gray-600 mt-3 pt-3"
                  >
                    <div v-if="getRegistrations(training).length === 0" class="text-center text-gray-400 text-xs py-2">
                      Немає реєстрацій
                    </div>
                    <div v-else class="space-y-2">
                      <div 
                        v-for="(registration, regIdx) in getRegistrations(training)" 
                        :key="regIdx"
                        class="text-xs text-white"
                      >
                        <span class="font-medium">{{ registration.userName }}</span>
                        <span class="text-gray-400 mx-1">·</span>
                        <span class="text-gray-500">{{ formatRegistrationTime(registration.registeredAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Футер -->
          <div class="mt-4">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HeaderWrapper from '../components/HeaderWrapper.vue'
import Footer from '../components/htfFooter.vue'
import backgroundImage from '@/assets/background.png'
import backgroundMob from '@/assets/backgroundMob.png'
import { getScheduleForWeek } from '@/services/scheduleService'
import { getScheduleRegistrations } from '@/services/registrationService'

const loading = ref(true)
const schedule = ref(null)
const registrations = ref([])
const visibleParticipants = ref(new Set())
const isMobile = ref(false)
const viewportW = ref(0)
const viewportH = ref(0)
const bgImage = computed(() => isMobile.value ? backgroundMob : backgroundImage)

function _checkMobile() {
  viewportW.value = window.innerWidth
  viewportH.value = window.innerHeight
  isMobile.value = viewportW.value < 768
}

// Отримати дати поточного тижня (понеділок - неділя)
const getCurrentWeekDates = () => {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = неділя, 1 = понеділок, ...
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Понеділок
  
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  
  return { monday, sunday }
}

// Форматування дати для відображення
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long' })
}

// Форматування часу реєстрації
const formatRegistrationTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// Група тренувань по днях
const groupedTrainings = computed(() => {
  if (!schedule.value || !schedule.value.trainings) return {}
  
  const groups = {}
  
  schedule.value.trainings.forEach((training) => {
    const dayName = training.dayName
    if (!groups[dayName]) {
      groups[dayName] = []
    }
    groups[dayName].push(training)
  })
  
  // Сортування по днях тижня
  const dayOrder = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя']
  const sortedGroups = {}
  
  dayOrder.forEach(day => {
    if (groups[day]) {
      sortedGroups[day] = groups[day].sort((a, b) => a.time.localeCompare(b.time))
    }
  })
  
  return sortedGroups
})

// Іконка для типу тренування (з trainingConfig)
const getTypeEmoji = (type) => {
  const iconMap = {
    'swimming': new URL('@/assets/trainingIcons/icon-swimming.png', import.meta.url).href,
    'running': new URL('@/assets/trainingIcons/icon-running.png', import.meta.url).href,
    'cycling': new URL('@/assets/trainingIcons/icon-cycling.png', import.meta.url).href,
    'other': new URL('@/assets/trainingIcons/icon-other.png', import.meta.url).href,
    // Ukrainian names
    'плавання': new URL('@/assets/trainingIcons/icon-swimming.png', import.meta.url).href,
    'біг': new URL('@/assets/trainingIcons/icon-running.png', import.meta.url).href,
    'велосипед': new URL('@/assets/trainingIcons/icon-cycling.png', import.meta.url).href,
    'велотренування': new URL('@/assets/trainingIcons/icon-cycling.png', import.meta.url).href,
    'інше': new URL('@/assets/trainingIcons/icon-other.png', import.meta.url).href
  };

  if (!type) return iconMap['other'];

  const lowerType = String(type).toLowerCase().trim();
  return iconMap[lowerType] || iconMap['other'];
}

// Отримати перший символ імені для аватара
const getUserInitial = (userName) => {
  if (!userName) return '?'
  return userName.charAt(0).toUpperCase()
}

// Колір для складності
const getDifficultyColor = (difficulty) => {
  const colorMap = {
    'Легка': 'bg-green-500 text-white',
    'Середня': 'bg-yellow-400 text-black',
    'Важка': 'bg-red-500 text-white'
  }
  return colorMap[difficulty] || 'bg-gray-500 text-white'
}

// Отримати ID тренування
const getTrainingId = (training) => {
  return schedule.value.id + '_' + training.date + '_' + training.time
}

// Отримати кількість реєстрацій для тренування
const getRegistrationCount = (training) => {
  const trainingId = getTrainingId(training)
  return registrations.value.filter(reg => reg.trainingId === trainingId).length
}

// Отримати список реєстрацій для тренування
const getRegistrations = (training) => {
  const trainingId = getTrainingId(training)
  return registrations.value.filter(reg => reg.trainingId === trainingId)
}

// Перемкнути видимість учасників
const toggleParticipants = (training) => {
  const trainingId = getTrainingId(training)
  if (visibleParticipants.value.has(trainingId)) {
    visibleParticipants.value.delete(trainingId)
  } else {
    visibleParticipants.value.add(trainingId)
  }
}

// Перевірити чи відображаються учасники
const isParticipantsVisible = (training) => {
  const trainingId = getTrainingId(training)
  return visibleParticipants.value.has(trainingId)
}

// Завантажити розклад поточного тижня
const loadCurrentWeekSchedule = async () => {
  try {
    loading.value = true
    
    const { monday, sunday } = getCurrentWeekDates()
    const foundSchedule = await getScheduleForWeek(monday, sunday)
    
    if (foundSchedule) {
      schedule.value = foundSchedule
      await loadRegistrations(foundSchedule.id)
    } else {
      schedule.value = null
    }
    
  } catch (err) {
    console.error('Помилка завантаження розкладу:', err)
  } finally {
    loading.value = false
  }
}

// Завантажити всі реєстрації для розкладу
const loadRegistrations = async (scheduleId) => {
  try {
    const regs = await getScheduleRegistrations(scheduleId)
    registrations.value = regs
  } catch (err) {
    console.error('Помилка завантаження реєстрацій:', err)
  }
}

// Завантажити при монтуванні
onMounted(() => {
  _checkMobile()
  window.addEventListener('resize', _checkMobile)
  loadCurrentWeekSchedule()
})

onUnmounted(() => {
  window.removeEventListener('resize', _checkMobile)
})
</script>
