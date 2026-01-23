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
        <div class="max-w-6xl mx-auto">
          <!-- Заголовок -->
          <div class="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-2 sm:p-4 md:p-8 mb-4 sm:mb-6">
            <h1 class="text-4xl font-bold text-gray-800 text-center mb-2 flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              Розклад тренувань
            </h1>
            <p class="text-center text-gray-600" v-if="schedule">
              {{ formatDate(schedule.weekStart) }} - {{ formatDate(schedule.weekEnd) }}
            </p>
          </div>

          <!-- Завантаження -->
          <div v-if="loading" class="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12 text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Завантаження розкладу...</p>
          </div>

          <!-- Немає розкладу -->
          <div v-else-if="!schedule || !schedule.trainings || schedule.trainings.length === 0" class="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="text-gray-600 text-xl mb-4">Розклад на поточний тиждень ще не створений</p>
            <p class="text-gray-500">Очікуйте оновлення від адміністратора</p>
          </div>

          <!-- Список тренувань -->
          <div v-else class="space-y-2 sm:space-y-4">
            <!-- Група по днях -->
            <div 
              v-for="(dayTrainings, dayName) in groupedTrainings" 
              :key="dayName"
              class="flex flex-col sm:flex-row gap-2 sm:gap-4"
            >
              <!-- День тижня зліва -->
              <div class="w-full sm:w-32 flex-shrink-0">
                <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-2 sm:p-4 text-center sticky top-4">
                  <h2 class="text-base sm:text-lg font-bold text-white">
                    {{ dayName }}
                  </h2>
                </div>
              </div>

              <!-- Тренування -->
              <div class="flex-1 space-y-3">
                <div 
                  v-for="(training, idx) in dayTrainings" 
                  :key="idx"
                  class="bg-white bg-opacity-95 rounded-lg shadow-md border border-gray-200"
                >
                  <!-- Основна інформація про тренування -->
                  <div class="p-4">
                    <div class="flex items-start justify-between gap-4">
                      <!-- Ліва частина: основна інформація -->
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <span class="text-2xl">{{ getTypeEmoji(training.type) }}</span>
                          <h3 class="text-lg font-bold text-gray-800">{{ training.name }}</h3>
                          <span 
                            :class="[
                              'px-2 py-0.5 rounded-full text-xs font-semibold',
                              getDifficultyColor(training.difficulty)
                            ]"
                          >
                            {{ training.difficulty }}
                          </span>
                          <span 
                            v-if="training.isPaid"
                            class="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800"
                          >
                            💰
                          </span>
                        </div>
                        
                        <div class="flex items-center gap-4 text-sm text-gray-600">
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                            </svg>
                            <span class="font-semibold">{{ training.time }}</span>
                          </div>
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                            </svg>
                            <span class="text-xs">{{ training.address }}</span>
                          </div>
                          <span class="text-xs">{{ training.type }}</span>
                        </div>
                      </div>

                      <!-- Права частина: реєстрації -->
                      <div class="flex-shrink-0">
                        <button 
                          @click="toggleParticipants(training)"
                          class="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span class="font-semibold text-gray-800">{{ getRegistrationCount(training) }}</span>
                          <span class="text-gray-500 text-xs">
                            {{ isParticipantsVisible(training) ? '▼' : '▶' }}
                          </span>
                        </button>
                      </div>
                    </div>

                    <!-- Список учасників (компактний) -->
                    <div 
                      v-if="isParticipantsVisible(training)" 
                      class="mt-3 pt-3 border-t border-gray-200"
                    >
                      <div v-if="getRegistrations(training).length === 0" class="text-center text-gray-400 text-sm py-2">
                        Немає реєстрацій
                      </div>
                      <div v-else class="space-y-1">
                        <div 
                          v-for="(registration, regIdx) in getRegistrations(training)" 
                          :key="regIdx"
                          class="text-sm text-gray-700 py-1"
                        >
                          <span class="font-medium">{{ registration.userName }}</span>
                          <span class="text-gray-400 mx-1">·</span>
                          <span class="text-xs text-gray-500">{{ formatRegistrationTime(registration.registeredAt) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '../components/htfHeader.vue'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getTrainingIcon } from '../data/trainingConfig.js'
import backgroundImage from '@/assets/background.png'
const loading = ref(true)
const schedule = ref(null)
const registrations = ref([])
const visibleParticipants = ref(new Set())

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
  return getTrainingIcon(type)
}

// Отримати перший символ імені для аватара
const getUserInitial = (userName) => {
  if (!userName) return '?'
  return userName.charAt(0).toUpperCase()
}

// Колір для складності
const getDifficultyColor = (difficulty) => {
  const colorMap = {
    'Легка': 'bg-green-100 text-green-800',
    'Середня': 'bg-yellow-100 text-yellow-800',
    'Важка': 'bg-red-100 text-red-800'
  }
  return colorMap[difficulty] || 'bg-gray-100 text-gray-800'
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
    const mondayStr = monday.toISOString().split('T')[0]
    const sundayStr = sunday.toISOString().split('T')[0]
    
    // Завантажуємо всі розклади
    const allSchedulesQuery = query(collection(db, 'schedules'))
    const allSchedulesSnapshot = await getDocs(allSchedulesQuery)
    
    // Фільтруємо розклади: weekStart має бути >= понеділок і weekEnd <= неділя
    const validSchedules = []
    allSchedulesSnapshot.forEach(doc => {
      const data = doc.data()
      const scheduleStart = data.weekStart
      const scheduleEnd = data.weekEnd
      
      if (scheduleStart >= mondayStr && scheduleEnd <= sundayStr) {
        validSchedules.push({ id: doc.id, ...data })
      }
    })
    
    if (validSchedules.length > 0) {
      // Сортуємо за датою створення і беремо останній
      validSchedules.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      
      schedule.value = validSchedules[0]
      
      // Завантажити реєстрації для цього розкладу
      await loadRegistrations(schedule.value.id)
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
    const q = query(
      collection(db, 'registrations'),
      where('scheduleId', '==', scheduleId)
    )
    
    const querySnapshot = await getDocs(q)
    registrations.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('Помилка завантаження реєстрацій:', err)
  }
}

// Завантажити при монтуванні
onMounted(() => {
  loadCurrentWeekSchedule()
})
</script>
