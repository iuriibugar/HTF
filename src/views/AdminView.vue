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
      <div class="flex flex-col lg:flex-row gap-2 lg:gap-4 p-2 sm:p-4 flex-1 min-h-0 overflow-y-auto">
        <!-- Бокова панель меню -->
        <aside class="w-full lg:w-80 bg-white bg-opacity-90 rounded-2xl shadow-lg p-2 sm:p-4 flex-shrink-0 overflow-y-auto flex flex-col mb-2 lg:mb-0">
          <!-- Інформація про користувача -->
          <div class="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
            <!-- Аватар користувача -->
            <div v-if="userPhoto" class="w-20 h-20 rounded-full mb-3 shadow-md overflow-hidden bg-gray-200">
              <img :src="userPhoto" :alt="userName" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
            </div>
            <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-md">
              {{ userName ? userName.charAt(0).toUpperCase() : 'A' }}
            </div>
            
            <div class="flex items-center justify-center gap-2 w-full">
              <p class="font-semibold text-gray-800 text-center">{{ userName || 'Адміністратор' }}</p>
              <button 
                @click="logout" 
                class="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition flex-shrink-0"
                title="Війти">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 text-center break-all">{{ userEmail }}</p>
          </div>

          <!-- Блок Адміна -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Адміністрування</h3>
            <button 
              @click="activeSection = 'schedule'"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition', 
                       activeSection === 'schedule' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700']">
              📅 Сформувати розклад
            </button>
          </div>
          
          <!-- Блок для всіх -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Загальне</h3>
            <button 
              @click="activeSection = 'registration'"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition', 
                       activeSection === 'registration' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700']">
              ✍️ Реєстрація на тренування
            </button>
          </div>
        </aside>

        <!-- Основний контент -->
        <main class="flex-1 w-full">
          <!-- Секція: Сформувати розклад -->
          <div v-if="activeSection === 'schedule'" class="bg-white bg-opacity-90 rounded-2xl shadow-lg p-2 sm:p-4">
            <h1 class="text-3xl font-bold mb-6">Формування розкладу</h1>
            
            <!-- Вибір періоду -->
            <div class="mb-4 sm:mb-6 p-2 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Дата початку тижня *</label>
                  <input 
                    v-model="weekStartDate" 
                    type="date"
                    :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                             weekYearError && !weekStartDate ? 'border-red-500' : 'border-gray-300']" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Дата кінця тижня *</label>
                  <input 
                    v-model="weekEndDate" 
                    type="date"
                    :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                             weekYearError && !weekEndDate ? 'border-red-500' : 'border-gray-300']" />
                </div>
              </div>
              <p v-if="weekYearError" class="text-red-600 text-sm mt-2">⚠️ Обов'язково вкажіть дати початку та кінця тижня</p>
            </div>
            
            <!-- Таблиця тренувань по днях тижня -->
            <div class="space-y-4 sm:space-y-6">
              <div v-for="day in daysOfWeek" :key="day.id" class="border border-gray-200 rounded-xl p-2 sm:p-4 bg-gray-50">
                <h3 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800">{{ day.name }}</h3>
                
                <!-- Список тренувань для цього дня -->
                <div v-for="(training, index) in day.trainings" :key="index" class="mb-2 sm:mb-4 p-2 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    <!-- Тип тренування + Назва -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Тип тренування *</label>
                      <div class="flex gap-2">
                        <select 
                          v-model="training.type" 
                          :class="['px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                   training.error && !training.type ? 'border-red-500' : 'border-gray-300']">
                          <option v-for="type in trainingTypes" :key="type.value" :value="type.value">
                            {{ type.label }}
                          </option>
                        </select>
                        <input 
                          v-model="training.name" 
                          type="text" 
                          placeholder="Назва тренування *"
                          :list="'training-names-' + training.type"
                          :class="['flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                   training.error && !training.name ? 'border-red-500' : 'border-gray-300']" />
                        <datalist :id="'training-names-' + training.type">
                          <option v-for="name in getTrainingNames(training.type)" :key="name" :value="name"></option>
                        </datalist>
                      </div>
                    </div>

                    <!-- Складність -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Складність *</label>
                      <select 
                        v-model="training.difficulty" 
                        :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                 training.error && !training.difficulty ? 'border-red-500' : 'border-gray-300']">
                        <option v-for="level in getDifficultyLevels(training.type)" :key="level.value" :value="level.value">
                          {{ level.label }}
                        </option>
                      </select>
                    </div>

                    <!-- Час початку -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Час початку *</label>
                      <input 
                        v-model="training.time" 
                        type="time" 
                        :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                 training.error && !training.time ? 'border-red-500' : 'border-gray-300']" />
                    </div>

                    <!-- Платне тренування -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Тип оплати</label>
                      <select v-model="training.isPaid" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Безкоштовно</option>
                        <option value="paid">💵 Платне</option>
                      </select>
                    </div>

                    <!-- Адреса -->
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Адреса *</label>
                      <div class="flex gap-2">
                        <input 
                          v-model="training.address" 
                          type="text" 
                          placeholder="Введіть адресу *"
                          list="addresses"
                          :class="['flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                   training.error && !training.address ? 'border-red-500' : 'border-gray-300']" />
                        <datalist id="addresses">
                          <option v-for="addr in savedAddresses" :key="addr" :value="addr"></option>
                        </datalist>
                        <button 
                          @click="removeTraining(day.id, index)"
                          class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Кнопка додати тренування -->
                <button 
                  @click="addTraining(day.id)"
                  class="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">
                  ➕ Додати тренування
                </button>
              </div>
            </div>

            <!-- Повідомлення про помилку -->
            <div v-if="validationError" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p class="font-semibold">⚠️ Помилка валідації</p>
              <p>Будь ласка, заповніть всі обов'язкові поля (позначені зірочкою *)</p>
            </div>

            <!-- Кнопки -->
            <div class="mt-8 flex gap-4">
              <button 
                @click="generateSchedule"
                class="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition text-lg">
                ✨ Сформувати розклад
              </button>
              <button 
                @click="saveScheduleToDatabase"
                class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition text-lg">
                💾 Завантажити розклад в БД
              </button>
            </div>

            <!-- Повідомлення про збереження -->
            <div v-if="saveSuccess" class="mt-4 p-4 bg-green-100 border-2 border-green-500 text-green-800 rounded-lg shadow-lg animate-pulse">
              <p class="font-bold text-lg">✅ Успішно збережено!</p>
              <p>Розклад успішно завантажено в базу даних Firebase</p>
            </div>
            <div v-if="saveError" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p class="font-semibold">❌ Помилка збереження</p>
              <p>{{ saveErrorMessage }}</p>
            </div>

            <!-- Попередній перегляд та завантаження -->
            <div v-if="generatedImage" class="mt-8 p-4 bg-gray-50 rounded-xl">
              <h3 class="text-xl font-semibold mb-4">Згенерований розклад</h3>
              <div class="flex flex-col items-center gap-4">
                <canvas ref="scheduleCanvas" class="border border-gray-300 rounded-lg shadow-lg max-w-full"></canvas>
                <button 
                  @click="downloadSchedule"
                  class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
                  📥 Скачати розклад
                </button>
              </div>
            </div>
          </div>

          <!-- Секція: Реєстрація на тренування -->
          <div v-if="activeSection === 'registration'" class="bg-white bg-opacity-90 rounded-2xl shadow-lg p-6">
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
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/htfHeader.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { getAllRegistrations } from '../services/trainingService'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import backgroundImage from '@/assets/background.png'
import { trainingNames, difficultyLevels, trainingAddresses, trainingTypes, getTrainingIcon, getDifficultyLevels, getTrainingNames } from '@/data/trainingConfig'

const userName = ref('')
const userEmail = ref('')
const userPhoto = ref('')
const activeSection = ref('schedule') // За замовчуванням відкрита секція формування розкладу
const scheduleCanvas = ref(null)
const generatedImage = ref(false)
const validationError = ref(false)
const weekYearError = ref(false)
const weekStartDate = ref('')
const weekEndDate = ref('')
const saveSuccess = ref(false)

// Для реєстрації
const loadingSchedule = ref(false)
const currentSchedule = ref(null)
const userRegistrations = ref([])
const registrationSuccess = ref('')
const saveError = ref(false)
const saveErrorMessage = ref('')

// Функція для форматування дати українською
function formatDateUkrainian(dateStr) {
  const date = new Date(dateStr)
  const months = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ]
  return `${date.getDate()} ${months[date.getMonth()]}`
}

// Функція для отримання року з дати
function getYear(dateStr) {
  return new Date(dateStr).getFullYear()
}

// Дні тижня з тренуваннями
const daysOfWeek = ref([
  { id: 'monday', name: 'Понеділок', trainings: [] },
  { id: 'tuesday', name: 'Вівторок', trainings: [] },
  { id: 'wednesday', name: 'Середа', trainings: [] },
  { id: 'thursday', name: 'Четвер', trainings: [] },
  { id: 'friday', name: "П'ятниця", trainings: [] },
  { id: 'saturday', name: 'Субота', trainings: [] },
  { id: 'sunday', name: 'Неділя', trainings: [] }
])

// Використовуємо дані з конфігурації
const savedAddresses = ref(trainingAddresses)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || ''
      userEmail.value = user.email || ''
      userPhoto.value = user.photoURL || ''
    }
  })
})

// Завантажувати розклад при переключенні на секцію реєстрації
watch(activeSection, (newSection) => {
  if (newSection === 'registration') {
    loadScheduleForRegistration()
  }
})

const registrations = ref([])

async function loadRegistrations() {
  registrations.value = await getAllRegistrations()
}

async function logout() {
  await auth.signOut()
  window.location.href = '/HTF/'
}

// Додати тренування до дня
function addTraining(dayId) {
  const day = daysOfWeek.value.find(d => d.id === dayId)
  if (day) {
    day.trainings.push({
      type: 'swimming',
      name: '',
      difficulty: 'ELEMENTARY',
      time: '07:00',
      isPaid: '',
      address: '',
      error: false
    })
  }
}

// Watch для автоматичного оновлення назви та складності при зміні типу
watch(() => daysOfWeek.value.map(day => day.trainings.map(t => t.type)), (newTypes, oldTypes) => {
  daysOfWeek.value.forEach(day => {
    day.trainings.forEach(training => {
      // Скидаємо складність до першого доступного значення для нового типу
      const availableDifficulties = getDifficultyLevels(training.type)
      if (availableDifficulties.length > 0 && !availableDifficulties.find(d => d.value === training.difficulty)) {
        training.difficulty = availableDifficulties[0].value
      }
      // Скидаємо назву при зміні типу
      const availableNames = getTrainingNames(training.type)
      if (!availableNames.includes(training.name)) {
        training.name = ''
      }
    })
  })
}, { deep: true })

// Видалити тренування
function removeTraining(dayId, index) {
  const day = daysOfWeek.value.find(d => d.id === dayId)
  if (day) {
    day.trainings.splice(index, 1)
  }
}

// Генерація розкладу
async function generateSchedule() {
  // Скидаємо попередні помилки
  validationError.value = false
  weekYearError.value = false
  
  // Валідація дат
  if (!weekStartDate.value || !weekEndDate.value) {
    weekYearError.value = true
    return
  }
  
  // Валідація всіх тренувань
  let hasErrors = false
  daysOfWeek.value.forEach(day => {
    day.trainings.forEach(training => {
      training.error = false
      if (!training.name || !training.type || !training.difficulty || !training.time || !training.address) {
        training.error = true
        hasErrors = true
      }
    })
  })
  
  // Якщо є помилки, показуємо повідомлення і виходимо
  if (hasErrors) {
    validationError.value = true
    return
  }
  
  generatedImage.value = true
  
  // Чекаємо наступний тік, щоб canvas був у DOM
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const canvas = scheduleCanvas.value
  if (!canvas) {
    console.error('Canvas not found')
    return
  }

  const ctx = canvas.getContext('2d')
  
  // Розмір для Instagram Stories (9:16)
  canvas.width = 1080
  canvas.height = 1920

  // Фон
  ctx.fillStyle = '#1e3a5f'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Заголовок
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 60px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Розклад тренувань', canvas.width / 2, 100)
  
  ctx.font = 'bold 80px Arial'
  ctx.fillStyle = '#ffd700'
  ctx.fillText('HAPPY TRI FRIENDS', canvas.width / 2, 200)

  // Період тижня
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 40px Arial'
  const startFormatted = formatDateUkrainian(weekStartDate.value)
  const endFormatted = formatDateUkrainian(weekEndDate.value)
  const year = getYear(weekEndDate.value)
  ctx.fillText(`${startFormatted} - ${endFormatted} ${year}р`, canvas.width / 2, 270)

  // Примітка про платність
  ctx.fillStyle = '#ffd700'
  ctx.font = '32px Arial'
  ctx.fillText('($) — Відвідування цього тренування платне', canvas.width / 2, 330)

  let yPosition = 360

  const dayAbbreviations = {
    'Понеділок': 'Пн',
    'Вівторок': 'Вт',
    'Середа': 'Ср',
    'Четвер': 'Чт',
    "П'ятниця": 'Пт',
    'Субота': 'Сб',
    'Неділя': 'Нд'
  }

  // Малюємо тренування по днях
  daysOfWeek.value.forEach(day => {
    if (day.trainings.length > 0) {
      // Висота блоку залежить від кількості тренувань
      const trainingHeight = 90 // Висота одного тренування всередині
      const separatorHeight = day.trainings.length > 1 ? (day.trainings.length - 1) * 20 : 0 // 20px на кожну лінію (10 до + 10 після)
      const blockHeight = 60 + (day.trainings.length * trainingHeight) + separatorHeight + 30 // Верх + тренування + роздільники + низ

      // Рамка для всього дня
      ctx.strokeStyle = '#ffd700'
      ctx.lineWidth = 3
      ctx.strokeRect(40, yPosition, canvas.width - 80, blockHeight)


      // Прибираємо заголовок дня тижня справа у рамці


      let trainingYPosition = yPosition + 50; // Зменшено відступ для першого тренування

      // Малюємо всі тренування цього дня
      day.trainings.forEach((training, index) => {
        // Відступ між тренуваннями (не для першого)
        if (index > 0) {
          trainingYPosition += 20; // Відступ між тренуваннями
        }

        // Іконка типу тренування
        const typeConfig = trainingTypes.find(t => t.value === training.type);
        const icon = typeConfig ? typeConfig.icon : '🏊';
        ctx.font = '45px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(icon, 60, trainingYPosition + 35);

        // Перший рядок: назва тренування (з іконкою) + рівень складності
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        const isPaidText = training.isPaid ? ' ($)' : '';
        ctx.textAlign = 'left';
        ctx.fillText(training.name + isPaidText, 130, trainingYPosition + 25);

        ctx.fillStyle = '#ffd700';
        ctx.font = '24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(training.difficulty, 500, trainingYPosition + 25);

        // Другий рядок: адреса (зменшений відступ), день тижня над часом, час
        // Адреса (завжди для кожного тренування)
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial'; // Зменшено розмір
        ctx.textAlign = 'left';
        ctx.fillText(training.address, 130, trainingYPosition + 50);

        // День тижня (над часом)
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 34px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(dayAbbreviations[day.name] || day.name.substring(0, 2), canvas.width - 80, trainingYPosition + 25);

        // Час справа (нижче дня тижня)
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(training.time, canvas.width - 80, trainingYPosition + 55);

        trainingYPosition += trainingHeight;
      });

      yPosition += blockHeight + 20 // Додаємо відступ між днями
    }
  })
}

// Завантажити розклад
function downloadSchedule() {
  const canvas = scheduleCanvas.value
  if (!canvas) return

  const link = document.createElement('a')
  link.download = 'htf-schedule.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// Функція для конвертації дня тижня в дату
function getDayDate(dayId) {
  const startDate = new Date(weekStartDate.value)
  const dayIndexMap = {
    'monday': 0,
    'tuesday': 1,
    'wednesday': 2,
    'thursday': 3,
    'friday': 4,
    'saturday': 5,
    'sunday': 6
  }
  
  const dayIndex = dayIndexMap[dayId]
  const dayDate = new Date(startDate)
  dayDate.setDate(startDate.getDate() + dayIndex)
  
  return dayDate.toISOString().split('T')[0] // Формат YYYY-MM-DD
}

// Зберегти розклад в базу даних
async function saveScheduleToDatabase() {
  // Скидаємо попередні повідомлення
  saveSuccess.value = false
  saveError.value = false
  saveErrorMessage.value = ''
  validationError.value = false
  weekYearError.value = false
  
  // Валідація дат
  if (!weekStartDate.value || !weekEndDate.value) {
    weekYearError.value = true
    saveError.value = true
    saveErrorMessage.value = 'Необхідно вказати дати початку та кінця тижня'
    return
  }
  
  // Валідація всіх тренувань
  let hasErrors = false
  daysOfWeek.value.forEach(day => {
    day.trainings.forEach(training => {
      training.error = false
      if (!training.name || !training.type || !training.difficulty || !training.time || !training.address) {
        training.error = true
        hasErrors = true
      }
    })
  })
  
  if (hasErrors) {
    validationError.value = true
    saveError.value = true
    saveErrorMessage.value = 'Заповніть всі обов\'язкові поля тренувань'
    return
  }
  
  try {
    // Збираємо всі тренування з датами
    const trainingsToSave = []
    
    daysOfWeek.value.forEach(day => {
      if (day.trainings.length > 0) {
        const dayDate = getDayDate(day.id)
        
        day.trainings.forEach(training => {
          trainingsToSave.push({
            date: dayDate,
            dayName: day.name,
            type: training.type,
            name: training.name,
            difficulty: training.difficulty,
            time: training.time,
            isPaid: training.isPaid === 'paid',
            address: training.address,
            createdAt: new Date().toISOString(),
            createdBy: auth.currentUser?.email || 'unknown'
          })
        })
      }
    })
    
    // Зберігаємо розклад як один документ
    const docRef = await addDoc(collection(db, 'schedules'), {
      weekStart: weekStartDate.value,
      weekEnd: weekEndDate.value,
      trainings: trainingsToSave,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser?.email || 'unknown'
    })
    
    // Перевіряємо, що документ був створений
    if (docRef && docRef.id) {

      
      saveSuccess.value = true
      
      // Показуємо браузерну нотифікацію, якщо дозволено
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('HTF - Розклад збережено', {
          body: `Успішно збережено ${trainingsToSave.length} тренувань`,
          icon: '/HTF.png'
        })
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        // Запитуємо дозвіл на нотифікації
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('HTF - Розклад збережено', {
              body: `Успішно збережено ${trainingsToSave.length} тренувань`,
              icon: '/HTF.png'
            })
          }
        })
      }
      
      // Автоматично приховуємо повідомлення через 5 секунд
      setTimeout(() => {
        saveSuccess.value = false
      }, 5000)
    } else {
      throw new Error('Не вдалося отримати ID збереженого документа')
    }
    
  } catch (error) {
    console.error('Помилка збереження розкладу:', error)
    saveError.value = true
    saveErrorMessage.value = error.message || 'Невідома помилка при збереженні'
  }
}

// ===== ФУНКЦІОНАЛ РЕЄСТРАЦІЇ =====

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
const loadScheduleForRegistration = async () => {
  if (activeSection.value !== 'registration') return
  
  try {
    loadingSchedule.value = true
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
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('HTF - Реєстрація успішна', {
        body: `${training.dayName}, ${training.time} - ${training.name}`,
        icon: '/HTF.png'
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
    const trainingId = `${currentSchedule.value.id}_${training.date}_${training.time}`
    
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
          icon: '/HTF.png'
        })
      }
      
      setTimeout(() => { registrationSuccess.value = '' }, 3000)
    }
  } catch (err) {
    alert('Помилка скасування: ' + err.message)
  }
}
</script>