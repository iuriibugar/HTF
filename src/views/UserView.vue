<template>
  <div class="relative h-screen bg-cover bg-center bg-fixed overflow-hidden" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- Затемнення фону -->
    <div class="absolute inset-0 bg-black opacity-40"></div>

    <!-- Весь контент -->
    <div class="relative z-10 h-full flex flex-col">
      <!-- Хедер -->
      <div class="bg-gray-800">
        <Header />
      </div>

      <!-- Основний контент з боковою панеллю -->
      <div class="flex gap-4 p-4 flex-1 min-h-0">
        <!-- Бокова панель -->
        <aside class="w-80 bg-white bg-opacity-90 rounded-2xl shadow-lg p-4 flex-shrink-0 overflow-y-auto flex flex-col">
          <!-- Інформація про користувача -->
          <div class="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
            <!-- Аватар користувача -->
            <div v-if="userPhoto" class="w-20 h-20 rounded-full mb-3 shadow-md overflow-hidden bg-gray-200">
              <img :src="userPhoto" :alt="userName" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
            </div>
            <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-md">
              {{ userName ? userName.charAt(0).toUpperCase() : 'U' }}
            </div>
            
            <div class="flex items-center justify-center gap-2 w-full">
              <p class="font-semibold text-gray-800 text-center">{{ userName || 'Користувач' }}</p>
              <button 
                @click="logout" 
                class="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition flex-shrink-0"
                title="Вийти">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 text-center break-all">{{ userEmail }}</p>
          </div>

          <!-- Блок для всіх -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Меню</h3>
            <button 
              @click="activeSection = 'registration'"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition', 
                       activeSection === 'registration' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700']">
              ✍️ Реєстрація на тренування
            </button>
          </div>
        </aside>

        <!-- Основний контент -->
        <main class="flex-1 overflow-y-auto">
          <!-- Секція: Реєстрація на тренування -->
          <div v-if="activeSection === 'registration'" class="bg-white bg-opacity-90 rounded-2xl shadow-lg p-6">
            <h1 class="text-3xl font-bold mb-6">📅 Реєстрація на тренування</h1>
            
            <!-- Завантаження -->
            <div v-if="loading" class="text-center py-12">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Завантаження розкладу...</p>
            </div>
            
            <!-- Немає розкладу -->
            <div v-else-if="!schedule || !schedule.trainings || schedule.trainings.length === 0" class="text-center py-12">
              <p class="text-gray-600 text-xl mb-4">📭 Розклад на поточний тиждень ще не створений</p>
              <p class="text-gray-500">Очікуйте оновлення від адміністратора</p>
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
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/htfHeader.vue'
import { auth, db } from '../firebase'
import { ref, onMounted, computed, watch } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import backgroundImage from '@/assets/background.png'
import { getTrainingIcon } from '@/data/trainingConfig'

const userName = ref('')
const userEmail = ref('')
const userPhoto = ref('')
const activeSection = ref('registration')
const loading = ref(false)
const schedule = ref(null)
const userRegistrations = ref([])
const registrationSuccess = ref('')

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
  if (!schedule.value || !schedule.value.trainings) return {}
  
  const groups = {}
  schedule.value.trainings.forEach((training) => {
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

// Іконка для типу тренування (з trainingConfig)
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
const loadSchedule = async () => {
  try {
    loading.value = true
    const { monday, sunday } = getCurrentWeekDates()
    const mondayStr = monday.toISOString().split('T')[0]
    const sundayStr = sunday.toISOString().split('T')[0]
    
    // Завантажуємо всі розклади
    const allSchedulesQuery = query(collection(db, 'schedules'))
    const allSchedulesSnapshot = await getDocs(allSchedulesQuery)
    
    // Фільтруємо розклади: weekStart має бути >= понеділок і weekEnd <= неділя (не пізніше неділі)
    const validSchedules = []
    allSchedulesSnapshot.forEach(doc => {
      const data = doc.data()
      const scheduleStart = data.weekStart
      const scheduleEnd = data.weekEnd
      
      // Розклад підходить якщо:
      // 1. Початок розкладу >= понеділок поточного тижня
      // 2. Кінець розкладу <= неділя поточного тижня
      if (scheduleStart >= mondayStr && scheduleEnd <= sundayStr) {
        validSchedules.push({ id: doc.id, ...data })
      }
    })
    
    if (validSchedules.length > 0) {
      // Сортуємо за датою створення і беремо останній
      validSchedules.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      
      schedule.value = validSchedules[0]
      await loadUserRegistrations()
    } else {
      schedule.value = null
    }
  } catch (err) {
    console.error('❌ Помилка завантаження:', err)
  } finally {
    loading.value = false
  }
}

// Завантажити реєстрації
const loadUserRegistrations = async () => {
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
  const trainingId = `${schedule.value.id}_${training.date}_${training.time}`
  return userRegistrations.value.includes(trainingId)
}

// Перевірити чи тренування вже минуло
const isTrainingPast = (training) => {
  // Створюємо дату та час тренування
  const trainingDateTime = new Date(`${training.date}T${training.time}:00`)
  
  // Поточний час в Києві (UTC+2 або UTC+3 залежно від літнього часу)
  const now = new Date()
  const kyivOffset = 2 * 60 // UTC+2 в хвилинах (зимовий час)
  const localOffset = now.getTimezoneOffset()
  const kyivTime = new Date(now.getTime() + (kyivOffset + localOffset) * 60000)
  
  return trainingDateTime < kyivTime
}

// Реєстрація
const registerForTraining = async (training) => {
  if (!auth.currentUser) {
    alert('Будь ласка, увійдіть в систему для реєстрації')
    return
  }
  
  try {
    const trainingId = `${schedule.value.id}_${training.date}_${training.time}`
    if (isRegistered(training)) return
    
    await addDoc(collection(db, 'registrations'), {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      userName: auth.currentUser.displayName || auth.currentUser.email,
      userPhoto: auth.currentUser.photoURL || null,
      trainingId,
      scheduleId: schedule.value.id,
      trainingDate: training.date,
      trainingTime: training.time,
      trainingName: training.name,
      trainingType: training.type,
      registeredAt: new Date().toISOString()
    })
    
    userRegistrations.value.push(trainingId)
    registrationSuccess.value = `Ви зареєстровані на ${training.name}`
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('HTF - Реєстрація успішна', {
        body: `${training.dayName}, ${training.time} - ${training.name}`,
        icon: '/HTF/HTF.png'
      })
    }
    
    setTimeout(() => { registrationSuccess.value = '' }, 3000)
  } catch (err) {
    alert('Помилка реєстрації: ' + err.message)
  }
}

// Відміна реєстрації
const cancelRegistration = async (training) => {
  if (!auth.currentUser) return
  
  try {
    const trainingId = `${schedule.value.id}_${training.date}_${training.time}`
    
    // Знаходимо документ реєстрації
    const q = query(
      collection(db, 'registrations'),
      where('userId', '==', auth.currentUser.uid),
      where('trainingId', '==', trainingId)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      // Видаляємо документ
      const docToDelete = querySnapshot.docs[0]
      await deleteDoc(docToDelete.ref)
      
      // Оновлюємо локальний список
      const index = userRegistrations.value.indexOf(trainingId)
      if (index > -1) {
        userRegistrations.value.splice(index, 1)
      }
      
      registrationSuccess.value = `Реєстрацію на ${training.name} скасовано`
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('HTF - Реєстрацію скасовано', {
          body: `${training.dayName}, ${training.time} - ${training.name}`,
          icon: '/HTF/HTF.png'
        })
      }
      
      setTimeout(() => { registrationSuccess.value = '' }, 3000)
    }
  } catch (err) {
    alert('Помилка скасування: ' + err.message)
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || ''
      userEmail.value = user.email || ''
      userPhoto.value = user.photoURL || ''
      if (activeSection.value === 'registration') loadSchedule()
    }
  })
})

// Завантажувати розклад при переключенні на секцію реєстрації
watch(activeSection, (newSection) => {
  if (newSection === 'registration') {
    loadSchedule()
  }
})

async function logout() {
  await auth.signOut()
  window.location.href = '/HTF/'
}
</script>