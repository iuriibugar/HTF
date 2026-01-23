<template>
  <div class="bg-white bg-opacity-90 rounded-2xl shadow-lg p-6">
    <h1 class="text-3xl font-bold mb-6">📅 Реєстрація на тренування</h1>
    
    <!-- Завантаження -->
    <div v-if="loadingSchedule" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Завантаження розкладу...</p>
    </div>
    
    <!-- Немає розкладу -->
    <div v-else-if="!currentSchedule || !currentSchedule.trainings || currentSchedule.trainings.length === 0" class="text-center py-12">
      <p class="text-gray-600 text-xl mb-4">📭 Розклад на поточний тиждень ще не створений</p>
      <p class="text-gray-500">Спочатку створіть розклад у розділі "Сформувати розклад"</p>
    </div>
    
    <!-- Список тренувань -->
    <div v-else class="space-y-6">
      <div v-for="(dayTrainings, dayName) in groupedTrainings" :key="dayName" class="border border-gray-200 rounded-xl overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4">
          <h2 class="text-2xl font-bold">{{ dayName }}</h2>
          <p class="text-sm text-blue-100">{{ formatDate(dayTrainings[0].date) }}</p>
        </div>
        
        <div class="p-6 space-y-4 bg-gray-50">
          <div v-for="(training, idx) in dayTrainings" :key="idx" class="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">{{ getTypeEmoji(training.type) }}</span>
                <h3 class="text-xl font-bold text-gray-800">{{ training.name }}</h3>
                <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getDifficultyColor(training.difficulty)]">
                  {{ training.difficulty }}
                </span>
                <span v-if="training.isPaid" class="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                  💰 Платне
                </span>
              </div>
              <div class="flex items-center gap-6 text-gray-600">
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
            <div class="ml-6 flex flex-col gap-2">
              <!-- Тренування вже минуло -->
              <button 
                v-if="isTrainingPast(training) && !isRegistered(training)"
                disabled
                class="px-6 py-3 rounded-lg font-semibold bg-gray-400 text-white cursor-not-allowed shadow-lg opacity-60">
                🕐 Тренування минуло
              </button>
              
              <!-- Можна зареєструватись -->
              <button 
                v-else-if="!isRegistered(training)"
                @click="registerForTraining(training)"
                class="px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl">
                📝 Зареєструватися
              </button>
              
              <!-- Вже зареєстрований -->
              <template v-else>
                <button 
                  class="px-6 py-3 rounded-lg font-semibold bg-green-500 text-white cursor-default shadow-lg">
                  ✅ Зареєстровано
                </button>
                <button 
                  v-if="!isTrainingPast(training)"
                  @click="cancelRegistration(training)"
                  class="px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl">
                  ❌ Відмінити
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Повідомлення про успіх -->
    <div v-if="registrationSuccess" class="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-bounce">
      <p class="font-semibold">✅ {{ registrationSuccess }}</p>
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

// Колір складності
const getDifficultyColor = (difficulty) => {
  const map = {
    'Легка': 'bg-green-100 text-green-800',
    'Середня': 'bg-yellow-100 text-yellow-800',
    'Важка': 'bg-red-100 text-red-800'
  }
  return map[difficulty] || 'bg-gray-100 text-gray-800'
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
