<template>
  <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-2 sm:p-4">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-yellow-400">📅 Реєстрація на тренування</h1>
    
    <!-- Завантаження -->
    <div v-if="loadingSchedule" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
      <p class="text-white">Завантаження розкладу...</p>
    </div>
    
    <!-- Немає розкладу -->
    <div v-else-if="!currentSchedule || !currentSchedule.trainings || currentSchedule.trainings.length === 0" class="text-center py-12">
      <p class="text-white text-lg sm:text-xl mb-4">📭 Розклад на поточний тиждень ще не створений</p>
      <p class="text-gray-300">Спочатку створіть розклад у розділі "Сформувати розклад"</p>
    </div>
    
    <!-- Список тренувань -->
    <div v-else class="space-y-4 sm:space-y-6">
      <div v-for="(dayTrainings, dayName) in groupedTrainings" :key="dayName" class="border-2 border-yellow-400 rounded-xl overflow-hidden">
        <div class="bg-gray-700/70 text-white px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-yellow-400 flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-bold text-yellow-400">{{ dayName }}</h2>
          <p class="text-sm text-gray-300">{{ formatDate(dayTrainings[0].date) }}</p>
        </div>
        
        <div class="p-2 sm:p-4 space-y-3 sm:space-y-4 bg-gray-700/50">
          <!-- МОБІЛЬНА ВЕРСТКА -->
          <div v-for="(training, idx) in dayTrainings" :key="idx" class="sm:hidden border-2 border-yellow-400 rounded-lg p-4 bg-gray-800">
            <div class="flex items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <img :src="getTrainingImage(training.type)" :alt="training.type" class="w-8 h-8 object-contain flex-shrink-0" />
                <h3 class="text-lg font-bold text-yellow-400 truncate">{{ training.name }}</h3>
              </div>
              <div class="text-right">
                <div class="text-2l font-bold text-white">{{ training.time }}</div>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span :class="['px-3 py-1 rounded text-xs font-semibold', getDifficultyColor(training.difficulty)]">
                {{ training.difficulty }}
              </span>
              <span v-if="training.isPaid" class="px-3 py-1 rounded text-xs font-semibold bg-yellow-400 text-black">
                💰 Платне
              </span>
            </div>
            
            <div class="space-y-2 mb-4 text-gray-300 text-sm">
              <div class="flex items-start gap-2">
                <span>📍</span>
                <span>{{ training.address }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>🏃</span>
                <span>{{ training.type }}</span>
              </div>
            </div>
            
            <!-- Мобільні кнопки -->
            <div class="space-y-2">
              <!-- Тренування вже минуло -->
              <button 
                v-if="isTrainingPast(training) && !isRegistered(training)"
                disabled
                class="w-full px-4 py-2 rounded-lg font-semibold bg-gray-600 text-gray-400 cursor-not-allowed opacity-60">
                🕐 Тренування минуло
              </button>
              
              <!-- Можна зареєструватись -->
              <button 
                v-else-if="!isRegistered(training)"
                @click="registerForTraining(training)"
                class="w-full px-4 py-3 rounded-lg font-semibold border-2 border-white text-white hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                📝 Зареєструватися
              </button>
              
              <!-- Вже зареєстрований -->
              <template v-else>
                <button 
                  class="w-full px-4 py-3 rounded-lg font-semibold bg-yellow-400 text-black cursor-default">
                  ✅ Зареєстровано
                </button>
                <button 
                  v-if="!isTrainingPast(training)"
                  @click="cancelRegistration(training)"
                  class="w-full px-4 py-2 rounded-lg font-semibold border-2 border-white text-white hover:border-red-400 hover:text-red-400 transition-colors">
                  ❌ Відмінити
                </button>
              </template>
            </div>
          </div>

          <!-- ДЕСКТОПНА ВЕРСТКА -->
          <div v-for="(training, idx) in dayTrainings" :key="idx" class="hidden sm:flex items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg border-2 border-yellow-400 hover:shadow-lg transition-shadow">
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <img :src="getTrainingImage(training.type)" :alt="training.type" class="w-8 h-8 object-contain" />
                <h3 class="text-lg sm:text-xl font-bold text-yellow-400">{{ training.name }}</h3>
                <span :class="['px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold', getDifficultyColor(training.difficulty)]">
                  {{ training.difficulty }}
                </span>
                <span v-if="training.isPaid" class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-yellow-400 text-black">
                  💰 Платне
                </span>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-300 text-sm">
                <div class="flex items-center gap-2">
                  <span>🕐</span>
                  <span class="font-semibold">{{ training.time }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>📍</span>
                  <span>{{ training.address }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>🏃</span>
                  <span>{{ training.type }}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2 flex-shrink-0">
              <!-- Тренування вже минуло -->
              <button 
                v-if="isTrainingPast(training) && !isRegistered(training)"
                disabled
                class="px-10 py-2 rounded font-semibold text-sm bg-gray-600 text-gray-400 cursor-not-allowed opacity-60 whitespace-nowrap">
                🕐 Тренування минуло
              </button>
              
              <!-- Можна зареєструватись -->
              <button 
                v-else-if="!isRegistered(training)"
                @click="registerForTraining(training)"
                class="px-10 py-2 rounded font-semibold text-sm transition-all border-2 border-white text-white hover:border-yellow-400 hover:text-yellow-400 whitespace-nowrap">
                📝 Записатися
              </button>
              
              <!-- Вже зареєстрований -->
              <template v-else>
                <button 
                  class="px-10 py-2 rounded font-semibold text-sm bg-yellow-400 text-black cursor-default whitespace-nowrap">
                  ✅ Зареєстровано
                </button>
                <button 
                  v-if="!isTrainingPast(training)"
                  @click="cancelRegistration(training)"
                  class="px-10 py-2 rounded font-semibold text-sm border-2 border-white text-white hover:border-red-400 hover:text-red-400 transition-colors whitespace-nowrap">
                  ❌ Відмінити
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Повідомлення про успіх -->
    <div v-if="registrationSuccess" class="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-yellow-400 text-black px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl animate-bounce z-50">
      <p class="font-semibold text-sm sm:text-base">✅ {{ registrationSuccess }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth, db } from '@/firebase'
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { getTrainingIcon } from '@/data/trainingConfig'

// Props
const props = defineProps({
  notification: Object
})

// Emit
const emit = defineEmits(['show-notification'])

// State
const loadingSchedule = ref(false)
const currentSchedule = ref(null)
const userRegistrations = ref([])
const registrationSuccess = ref('')

// Показати нотифікацію
function showNotification(type, message, title = '') {
  emit('show-notification', type, message, title)
}

// Отримати дати поточного тижня
const getCurrentWeekDates = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  
  return { monday, sunday }
}

// Форматування дати
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long' })
}

// Група тренувань по днях
const groupedTrainings = computed(() => {
  if (!currentSchedule.value || !currentSchedule.value.trainings) return {}
  
  const groups = {}
  currentSchedule.value.trainings.forEach((training) => {
    const dayName = training.dayName
    if (!groups[dayName]) groups[dayName] = []
    groups[dayName].push(training)
  })
  
  const dayOrder = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя']
  const sortedGroups = {}
  dayOrder.forEach(day => {
    if (groups[day]) {
      sortedGroups[day] = groups[day].sort((a, b) => a.time.localeCompare(b.time))
    }
  })
  return sortedGroups
})

// Іконка для типу тренування
const getTypeEmoji = (type) => {
  return getTrainingIcon(type)
}

// Отримати картинку для типу тренування
const getTrainingImage = (type) => {
  const iconMap = {
    'swimming': new URL('@/assets/trainingIcons/icon-swimming.png', import.meta.url).href,
    'running': new URL('@/assets/trainingIcons/icon-running.png', import.meta.url).href,
    'cycling': new URL('@/assets/trainingIcons/icon-cycling.png', import.meta.url).href,
    'other': new URL('@/assets/trainingIcons/icon-other.png', import.meta.url).href
  }
  const key = type.toLowerCase()
  return iconMap[key] || iconMap['other']
}

// Колір складності
const getDifficultyColor = (difficulty) => {
  const map = {
    'Легка': 'bg-green-500 text-white',
    'Середня': 'bg-yellow-500 text-black',
    'Важка': 'bg-red-500 text-white'
  }
  return map[difficulty] || 'bg-gray-500 text-white'
}

// Завантажити розклад
const loadScheduleForRegistration = async () => {
  try {
    loadingSchedule.value = true
    const { monday, sunday } = getCurrentWeekDates()
    const mondayStr = monday.toISOString().split('T')[0]
    const sundayStr = sunday.toISOString().split('T')[0]
    
    const allSchedulesQuery = query(collection(db, 'schedules'))
    const allSchedulesSnapshot = await getDocs(allSchedulesQuery)
    
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
      validSchedules.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      
      currentSchedule.value = validSchedules[0]
      await loadUserRegistrationsForAdmin()
    } else {
      currentSchedule.value = null
    }
  } catch (err) {
    console.error('❌ Помилка завантаження:', err)
  } finally {
    loadingSchedule.value = false
  }
}

// Завантажити реєстрації
const loadUserRegistrationsForAdmin = async () => {
  if (!auth.currentUser) return
  try {
    const q = query(collection(db, 'registrations'), where('userId', '==', auth.currentUser.uid))
    const querySnapshot = await getDocs(q)
    userRegistrations.value = querySnapshot.docs.map(doc => doc.data().trainingId)
  } catch (err) {
    // Тиха помилка
  }
}

// Перевірити реєстрацію
const isRegistered = (training) => {
  const trainingId = `${currentSchedule.value.id}_${training.date}_${training.time}`
  return userRegistrations.value.includes(trainingId)
}

// Перевірити чи тренування вже минуло
const isTrainingPast = (training) => {
  const trainingDateTime = new Date(`${training.date}T${training.time}:00`)
  const now = new Date()
  const kyivOffset = 2 * 60
  const localOffset = now.getTimezoneOffset()
  const kyivTime = new Date(now.getTime() + (kyivOffset + localOffset) * 60000)
  
  return trainingDateTime < kyivTime
}

// Реєстрація
const registerForTraining = async (training) => {
  if (!auth.currentUser) {
    showNotification('warning', 'Будь ласка, увійдіть в систему для реєстрації', 'Потрібна авторизація')
    return
  }
  
  try {
    const trainingId = `${currentSchedule.value.id}_${training.date}_${training.time}`
    if (isRegistered(training)) return
    
    await addDoc(collection(db, 'registrations'), {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      userName: auth.currentUser.displayName || auth.currentUser.email,
      userPhoto: auth.currentUser.photoURL || null,
      trainingId,
      scheduleId: currentSchedule.value.id,
      trainingDate: training.date,
      trainingTime: training.time,
      trainingName: training.name,
      trainingType: training.type,
      registeredAt: new Date().toISOString()
    })
    
    userRegistrations.value.push(trainingId)
    registrationSuccess.value = `Ви зареєстровані на ${training.name}`
    
    setTimeout(() => { registrationSuccess.value = '' }, 3000)
  } catch (err) {
    showNotification('error', err.message, 'Помилка реєстрації')
  }
}

// Відміна реєстрації
const cancelRegistration = async (training) => {
  if (!auth.currentUser) return
  
  try {
    const trainingId = `${currentSchedule.value.id}_${training.date}_${training.time}`
    
    const q = query(
      collection(db, 'registrations'),
      where('userId', '==', auth.currentUser.uid),
      where('trainingId', '==', trainingId)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0]
      await deleteDoc(docToDelete.ref)
      
      const index = userRegistrations.value.indexOf(trainingId)
      if (index > -1) {
        userRegistrations.value.splice(index, 1)
      }
      
      registrationSuccess.value = `Реєстрацію на ${training.name} скасовано`
      
      setTimeout(() => { registrationSuccess.value = '' }, 3000)
    }
  } catch (err) {
    showNotification('error', err.message, 'Помилка скасування')
  }
}

onMounted(() => {
  loadScheduleForRegistration()
})
</script>
