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
                    ref="startDateInput"
                    v-model="weekStartDate" 
                    type="date"
                    @click="openDatePicker($event)"
                    :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer',
                             weekYearError && !weekStartDate ? 'border-red-500' : 'border-gray-300']" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Дата кінця тижня *</label>
                  <input 
                    ref="endDateInput"
                    v-model="weekEndDate" 
                    type="date"
                    @click="openDatePicker($event)"
                    :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer',
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
                        <CustomDropdown
                          v-model="training.name"
                          :options="getTrainingNames(training.type)"
                          placeholder="Назва тренування *"
                        />
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
                        <CustomDropdown
                          v-model="training.address"
                          :options="savedAddresses"
                          placeholder="Введіть адресу *"
                        />
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
import CustomDropdown from '../components/CustomDropdown.vue'
import Header from '../components/htfHeader.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { getAllRegistrations } from '../services/trainingService'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import backgroundImage from '@/assets/background.png'
import { trainingNames, difficultyLevels, trainingAddresses, trainingTypes, getTrainingIcon, getDifficultyLevels, getTrainingNames, swimmingIconImg, runningIconImg, cyclingIconImg, otherIconImg } from '@/data/trainingConfig'

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

// Функція для відкриття календаря при кліку на поле дати
function openDatePicker(event) {
  const input = event.target
  if (input && typeof input.showPicker === 'function') {
    try {
      input.showPicker()
    } catch (error) {
      // Якщо showPicker не спрацював, нічого не робимо (браузер сам відкриє календар)
    }
  }
}

// Watch для автоматичного оновлення назви та складності при зміні типу
watch(() => daysOfWeek.value.map(day => day.trainings.map(t => t.type)), (newTypes, oldTypes) => {
  daysOfWeek.value.forEach((day, dayIndex) => {
    day.trainings.forEach((training, trainingIndex) => {
      // Перевіряємо чи змінився тип для цього конкретного тренування
      const oldType = oldTypes[dayIndex]?.[trainingIndex]
      const newType = newTypes[dayIndex]?.[trainingIndex]
      
      if (oldType && newType && oldType !== newType) {
        // Скидаємо складність до першого доступного значення для нового типу
        const availableDifficulties = getDifficultyLevels(training.type)
        if (availableDifficulties.length > 0) {
          training.difficulty = availableDifficulties[0].value
        }
        // Очищаємо назву тренування при зміні типу
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
  
  // Чекаємо поки завантажиться Montserrat
  await document.fonts.ready
  
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
  ctx.fillStyle = '#2C3E5F'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Заголовок
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 70px Montserrat'
  ctx.textAlign = 'center'
  ctx.fillText('РОЗКЛАД ТРЕНУВАНЬ HTF', canvas.width / 2, 120)

  // Примітка про платність (справа, 2 рядки)
  // Перший рядок: ($) жовтим жирним + решта білим
  // Вимірюємо загальну ширину
  ctx.font = 'bold 26px Montserrat'
  const dollarWidth = ctx.measureText('($) - ').width
  ctx.font = '26px Montserrat'
  const restWidth = ctx.measureText('відвідування цього').width
  const totalWidth = dollarWidth + restWidth
  
  // Стартова позиція для лівого краю тексту
  const startX = canvas.width - 60 - totalWidth
  
  // Малюємо ($) жовтим жирним
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 26px Montserrat'
  ctx.textAlign = 'left'
  ctx.fillText('($) - ', startX, 150)
  
  // Малюємо решту тексту білим
  ctx.fillStyle = '#ffffff'
  ctx.font = '26px Montserrat'
  ctx.fillText('відвідування цього', startX + dollarWidth, 150)
  
  // Другий рядок: білим не жирним, вирівняний справа
  ctx.fillStyle = '#ffffff'
  ctx.font = '26px Montserrat'
  ctx.textAlign = 'right'
  ctx.fillText('тренування платне', canvas.width - 60, 180)

  // Завантажуємо всі іконки
  const loadedIcons = {}
  const iconPromises = [
    { type: 'swimming', src: swimmingIconImg },
    { type: 'running', src: runningIconImg },
    { type: 'cycling', src: cyclingIconImg },
    { type: 'other', src: otherIconImg }
  ].map(({ type, src }) => {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => {
        loadedIcons[type] = img
        resolve()
      }
      img.onerror = () => resolve() // Якщо помилка, продовжуємо без іконки
      img.src = src
    })
  })

  await Promise.all(iconPromises)

  let yPosition = 220

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
      // Групуємо однакові тренування
      const groupedTrainings = []
      day.trainings.forEach(training => {
        // Шукаємо чи є вже така група (тип, платність, адреса співпадають)
        const existingGroup = groupedTrainings.find(g => 
          g.type === training.type && 
          g.isPaid === training.isPaid && 
          g.address === training.address &&
          g.name === training.name
        )
        
        if (existingGroup) {
          // Шукаємо чи є вже така складність в групі
          const difficultyEntry = existingGroup.difficultyTimes.find(d => d.difficulty === training.difficulty)
          if (difficultyEntry) {
            difficultyEntry.times.push(training.time)
          } else {
            existingGroup.difficultyTimes.push({
              difficulty: training.difficulty,
              times: [training.time]
            })
          }
        } else {
          // Створюємо нову групу
          groupedTrainings.push({
            type: training.type,
            name: training.name,
            isPaid: training.isPaid,
            address: training.address,
            difficultyTimes: [{
              difficulty: training.difficulty,
              times: [training.time]
            }]
          })
        }
      })

      // Висота блоку залежить від кількості груп тренувань
      // Рахуємо висоту кожного тренування окремо
      const trainingHeights = []
      let totalBlockHeight = 15 // Відступ зверху 15px
      groupedTrainings.forEach((training, idx) => {
        // Висота складностей
        const diffCount = training.difficultyTimes.length
        const difficultiesHeight = 28 + (diffCount - 1) * 35
        
        // Висота контенту тренування (від верху назви до низу адреси)
        // Назва на +30, адреса на +60, тому контент займає приблизно 60px
        const contentHeight = 60
        
        // Висота тренування = максимум з висоти складностей або контенту + відступи
        const trainingHeight = Math.max(difficultiesHeight, contentHeight) + 30 // +30px для відступів зверху/знизу
        trainingHeights.push(trainingHeight)
        totalBlockHeight += trainingHeight
        
        // Додаємо відступ для роздільника між тренуваннями (крім останнього)
        if (idx < groupedTrainings.length - 1) {
          totalBlockHeight += 15 // 15px відступ між тренуваннями
        }
      })
      totalBlockHeight += 15 // Відступ знизу 15px
      const blockHeight = totalBlockHeight

      // Жовтий квадрат дня тижня зліва (приліплений до блоку)
      const dayBoxWidth = 45
      const dayBoxHeight = blockHeight
      ctx.fillStyle = '#FFD700'
      // Заокруглені краї зліва
      ctx.beginPath()
      ctx.moveTo(40 + 15, yPosition)
      ctx.lineTo(40 + dayBoxWidth, yPosition)
      ctx.lineTo(40 + dayBoxWidth, yPosition + dayBoxHeight)
      ctx.lineTo(40 + 15, yPosition + dayBoxHeight)
      ctx.arcTo(40, yPosition + dayBoxHeight, 40, yPosition + dayBoxHeight - 15, 15)
      ctx.lineTo(40, yPosition + 15)
      ctx.arcTo(40, yPosition, 40 + 15, yPosition, 15)
      ctx.closePath()
      ctx.fill()

      // Текст дня тижня (вертикально по центру)
      ctx.fillStyle = '#000000'
      ctx.font = '32px Montserrat'
      ctx.textAlign = 'center'
      const dayAbbr = dayAbbreviations[day.name] || day.name.substring(0, 2)
      const letters = dayAbbr.toUpperCase().split('')
      const letterSpacing = 38
      const totalHeight = letters.length * letterSpacing
      const startY = yPosition + (dayBoxHeight - totalHeight) / 2 + 30
      
      letters.forEach((letter, idx) => {
        ctx.fillText(letter, 40 + dayBoxWidth / 2, startY + idx * letterSpacing)
      })

      // Темний блок з жовтою обводкою для тренувань (приліплений до дня)
      const trainingBlockX = 40 + dayBoxWidth
      const trainingBlockWidth = canvas.width - trainingBlockX - 50
      ctx.fillStyle = '#2C3E5F'
      // Заокруглені краї справа
      ctx.beginPath()
      ctx.moveTo(trainingBlockX, yPosition)
      ctx.lineTo(trainingBlockX + trainingBlockWidth - 15, yPosition)
      ctx.arcTo(trainingBlockX + trainingBlockWidth, yPosition, trainingBlockX + trainingBlockWidth, yPosition + 15, 15)
      ctx.lineTo(trainingBlockX + trainingBlockWidth, yPosition + blockHeight - 15)
      ctx.arcTo(trainingBlockX + trainingBlockWidth, yPosition + blockHeight, trainingBlockX + trainingBlockWidth - 15, yPosition + blockHeight, 15)
      ctx.lineTo(trainingBlockX, yPosition + blockHeight)
      ctx.closePath()
      ctx.fill()
      
      // Жовта обводка навколо всього блоку (включно з днем тижня)
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(40 + 15, yPosition)
      ctx.lineTo(trainingBlockX + trainingBlockWidth - 15, yPosition)
      ctx.arcTo(trainingBlockX + trainingBlockWidth, yPosition, trainingBlockX + trainingBlockWidth, yPosition + 15, 15)
      ctx.lineTo(trainingBlockX + trainingBlockWidth, yPosition + blockHeight - 15)
      ctx.arcTo(trainingBlockX + trainingBlockWidth, yPosition + blockHeight, trainingBlockX + trainingBlockWidth - 15, yPosition + blockHeight, 15)
      ctx.lineTo(40 + 15, yPosition + blockHeight)
      ctx.arcTo(40, yPosition + blockHeight, 40, yPosition + blockHeight - 15, 15)
      ctx.lineTo(40, yPosition + 15)
      ctx.arcTo(40, yPosition, 40 + 15, yPosition, 15)
      ctx.closePath()
      ctx.stroke()

      let trainingYPosition = yPosition + 15 // Початковий відступ 15px

      // Малюємо всі групи тренувань цього дня
      groupedTrainings.forEach((training, index) => {
        const currentTrainingHeight = trainingHeights[index]
        
        // Розраховуємо висоту контенту (іконка + текст)
        const contentHeight = 55 // Від верху іконки (0) до низу адреси (55px)
        // Центруємо контент по висоті блоку тренування
        const contentOffsetY = (currentTrainingHeight - contentHeight) / 2
        
        // Частина 1: День тижня (вже намальований)
        
        // Частина 2: Іконка типу тренування
        const iconImg = loadedIcons[training.type]
        if (iconImg) {
          const iconSize = 50
          ctx.drawImage(iconImg, trainingBlockX + 20, trainingYPosition + contentOffsetY, iconSize, iconSize)
        }

        // Частина 3: Назва тренування + ($) якщо платне, нижче адреса
        ctx.fillStyle = '#ffffff'
        ctx.font = 'semi-bold 34px Montserrat'
        ctx.textAlign = 'left'
        ctx.fillText(training.name, trainingBlockX + 85, trainingYPosition + contentOffsetY + 25)
        
        // Додаємо ($) жовтим жирним якщо платне
        if (training.isPaid) {
          const nameWidth = ctx.measureText(training.name).width
          ctx.fillStyle = '#FFD700'
          ctx.fillText(' ($)', trainingBlockX + 85 + nameWidth, trainingYPosition + contentOffsetY + 25)
        }

        // Адреса нижче
        ctx.fillStyle = '#D1D5DB'
        ctx.font = '22px Montserrat'
        ctx.fillText(training.address, trainingBlockX + 85, trainingYPosition + contentOffsetY + 55)

        // Частина 4 і 5: Складність та час (відцентровані по висоті блоку тренування)
        const difficultyX = trainingBlockX + 500
        const diffCount = training.difficultyTimes.length
        const totalDiffHeight = 28 + (diffCount - 1) * 35 // Перша рамка 28px + (кількість - 1) * 35px
        // Центруємо по висоті блоку тренування
        const startDiffY = trainingYPosition + (currentTrainingHeight - totalDiffHeight) / 2
        let diffY = startDiffY
        
        training.difficultyTimes.forEach((diffTime, idx) => {
          // Малюємо рамку складності
          ctx.font = '20px Montserrat'
          ctx.textAlign = 'left'
          const textWidth = ctx.measureText(diffTime.difficulty).width
          const padding = 15
          const diffWidth = textWidth + (padding * 2)
          
          ctx.strokeStyle = '#FFD700'
          ctx.lineWidth = 2
          ctx.strokeRect(difficultyX, diffY, diffWidth, 28)
          
          ctx.fillStyle = '#FFD700'
          ctx.fillText(diffTime.difficulty, difficultyX + padding, diffY + 20)
          
          // Часи в рядок через кому навпроти цієї складності (22px, не жирний)
          ctx.fillStyle = '#ffffff'
          ctx.font = '22px Montserrat'
          ctx.textAlign = 'right'
          const timesText = diffTime.times.join(' | ')
          ctx.fillText(timesText, trainingBlockX + trainingBlockWidth - 30, diffY + 18)
          
          diffY += 35
        })

        // Збільшуємо позицію для наступного тренування
        trainingYPosition += currentTrainingHeight

        // Роздільник між тренуваннями (якщо не останнє)
        if (index < groupedTrainings.length - 1) {
          trainingYPosition += 7.5 // Половина відступу перед лінією
          ctx.strokeStyle = '#FFD700'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(trainingBlockX + 20, trainingYPosition)
          ctx.lineTo(trainingBlockX + trainingBlockWidth - 20, trainingYPosition)
          ctx.stroke()
          trainingYPosition += 7.5 // Друга половина відступу після лінії
        }
      })

      yPosition += blockHeight + 25
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