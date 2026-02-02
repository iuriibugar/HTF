<template>
  <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-2 sm:p-4 ">
    <!-- Заголовок з пагінацією -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <h1 class="text-3xl font-bold text-yellow-400">Формування розкладу</h1>
      
      <!-- Пагінація розкладів -->
      <div v-if="savedSchedules.length > 0" class="flex items-center gap-2">
        <button
          @click="goToPreviousSchedule"
          :disabled="currentScheduleIndex === savedSchedules.length - 1"
          :class="[
            'px-3 py-2 rounded-lg font-bold transition-colors border-2',
            currentScheduleIndex === savedSchedules.length - 1
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600'
              : 'border-white text-white hover:border-yellow-400 hover:text-yellow-400'
          ]"
          :title="'Старіші розклади'"
        >
          &lt;
        </button>
        
        <button
          @click="loadScheduleToForm"
          class="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors border-2 border-yellow-400"
          :title="'Завантажити розклад у форму'"
        >
          {{ currentSavedSchedule ? `${currentScheduleIndex + 1}: ${formatDateRange(currentSavedSchedule.weekStart, currentSavedSchedule.weekEnd)}` : 'Немає розкладів' }}
        </button>
        
        <button
          @click="goToNextSchedule"
          :disabled="currentScheduleIndex === 0"
          :class="[
            'px-3 py-2 rounded-lg font-bold transition-colors border-2',
            currentScheduleIndex === 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600'
              : 'border-white text-white hover:border-yellow-400 hover:text-yellow-400'
          ]"
          :title="'Новіші розклади'"
        >
          &gt;
        </button>
      </div>
      
      <!-- Завантаження -->
      <div v-else-if="loadingSchedules" class="text-gray-500 text-sm">
        Завантаження розкладів...
      </div>
      
      <!-- Немає збережених розкладів -->
      <div v-else class="text-gray-400 text-sm">
        Немає збережених розкладів
      </div>
    </div>
    
    <!-- Вибір періоду -->
    <div class="mb-4 sm:mb-6 p-2 sm:p-4 bg-gray-800/70 rounded-lg border-2 border-yellow-400">
      <h3 class="text-lg font-bold text-yellow-400 mb-4">Період розкладу</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label class="block text-sm font-semibold text-white mb-2">Дата початку тижня *</label>
          <input 
            ref="startDateInput"
            v-model="weekStartDate" 
            type="date"
            @click="openDatePicker($event)"
            :class="['w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 cursor-pointer bg-gray-700 text-white',
                     weekYearError && !weekStartDate ? 'border-red-500' : 'border-white hover:border-yellow-400']" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-white mb-2">Дата кінця тижня *</label>
          <input 
            ref="endDateInput"
            v-model="weekEndDate" 
            type="date"
            @click="openDatePicker($event)"
            :class="['w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 cursor-pointer bg-gray-700 text-white',
                     weekYearError && !weekEndDate ? 'border-red-500' : 'border-white hover:border-yellow-400']" />
        </div>
      </div>
      <p v-if="weekYearError" class="text-yellow-400 text-sm mt-2 font-semibold">⚠️ Обов'язково вкажіть дати початку та кінця тижня</p>
    </div>
    
    <!-- Таблиця тренувань по днях тижня -->
    <div class="space-y-4 sm:space-y-6">
      <div v-for="day in daysOfWeek" :key="day.id" class="border-2 border-yellow-400 rounded-xl p-2 sm:p-4 bg-gray-800/70">
        <h3 class="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-yellow-400">{{ day.name }}</h3>
        
        <!-- Список тренувань для цього дня -->
        <div v-for="(training, index) in day.trainings" :key="`${day.id}-${index}-${forceUpdate}`" class="mb-2 sm:mb-4 p-2 sm:p-4 bg-gray-700/50 rounded-lg shadow-sm border-2 border-yellow-400">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            <!-- Тип тренування + Назва -->
            <div>
              <label class="block text-sm font-semibold text-white mb-2">Тип тренування *</label>
              <div class="flex gap-2">
                <CustomDropdown
                  v-model="training.type"
                  :options="trainingTypes"
                  placeholder="Тип тренування *"
                  :hasError="!!(training.error && !training.type)"
                />
                <CustomDropdown
                  v-model="training.name"
                  :options="getTrainingNames(training.type)"
                  placeholder="Назва тренування *"
                  :hasError="!!(training.error && !training.name)"
                  :allowCustom="true"
                />
              </div>
            </div>

            <!-- Складність -->
            <div>
              <label class="block text-sm font-semibold text-white mb-2">Складність *</label>
              <CustomDropdown
                v-model="training.difficulty"
                :options="getDifficultyLevels(training.type)"
                placeholder="Складність *"
                :hasError="!!(training.error && !training.difficulty)"
              />
            </div>

            <!-- Час початку -->
            <div>
              <label class="block text-sm font-semibold text-white mb-2">Час початку *</label>
              <input 
                v-model="training.time" 
                type="time" 
                :class="['w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-700 text-white',
                         training.error && !training.time ? 'border-red-500' : 'border-white hover:border-yellow-400']" />
            </div>

            <!-- Платне тренування -->
            <div>
              <label class="block text-sm font-semibold text-white mb-2">Тип оплати</label>
              <CustomDropdown
                v-model="training.isPaid"
                :options="[{value: '', label: 'Безкоштовно'}, {value: 'paid', label: '💵 Платне'}]"
                placeholder="Безкоштовно"
              />
            </div>

            <!-- Адреса -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-white mb-2">Адреса *</label>
              <div class="flex gap-2">
                <CustomDropdown
                  v-model="training.address"
                  :options="savedAddresses"
                  placeholder="Введіть адресу *"
                  :hasError="training.error && !training.address"
                  :allowCustom="true"
                />
                <button 
                  @click="removeTraining(day.id, index)"
                  class="px-3 py-2 bg-transparent border-2 border-white text-white rounded-lg transition hover:border-red-400 hover:text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопка додати тренування -->
        <button 
          @click="addTraining(day.id)"
          class="w-full mt-2 px-4 py-2 border-2 border-yellow-400 text-white rounded-lg transition hover:border-white hover:text-yellow-400">
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
        class="flex-1 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg transition text-lg hover:border-yellow-400 hover:text-yellow-400">
        ✨ Сформувати розклад
      </button>
      <button 
        @click="saveScheduleToDatabase"
        class="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition text-lg border-2 border-yellow-400">
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
    <div v-if="generatedImage" class="mt-8 p-4 bg-gray-800/70 rounded-xl border-2 border-white">
      <h3 class="text-xl font-bold mb-4 text-yellow-400">Згенерований розклад</h3>
      <div class="flex flex-col items-center gap-4">
        <canvas ref="scheduleCanvas" class="border-2 border-white rounded-lg shadow-lg max-w-full"></canvas>
        <button 
          @click="downloadSchedule"
          class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition border-2 border-yellow-400">
          📥 Скачати розклад
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { auth } from '@/firebase'
import CustomDropdown from '@/components/CustomDropdown.vue'
import { trainingAddresses, trainingTypes, getDifficultyLevels, getTrainingNames, swimmingIconImg, runningIconImg, cyclingIconImg, otherIconImg } from '@/data/trainingConfig'
import { getAllSchedules, saveSchedule } from '@/services/scheduleService'

// Props
const props = defineProps({
  notification: Object
})

// Emit
const emit = defineEmits(['show-notification'])

// State
const scheduleCanvas = ref(null)
const startDateInput = ref(null)
const endDateInput = ref(null)
const generatedImage = ref(false)
const validationError = ref(false)
const weekYearError = ref(false)
const weekStartDate = ref('')
const weekEndDate = ref('')
const saveSuccess = ref(false)
const savedSchedules = ref([])
const currentScheduleIndex = ref(0)
const loadingSchedules = ref(false)
const saveError = ref(false)
const saveErrorMessage = ref('')
const forceUpdate = ref(0)

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

const savedAddresses = ref(trainingAddresses)

// Показати нотифікацію
function showNotification(type, message, title = '') {
  emit('show-notification', type, message, title)
}

// Завантажити всі збережені розклади
async function loadAllSchedules() {
  try {
    loadingSchedules.value = true
    const schedules = await getAllSchedules()
    
    savedSchedules.value = schedules
    
    if (savedSchedules.value.length > 0) {
      currentScheduleIndex.value = 0
    }
  } catch (error) {
    console.error('Помилка завантаження розкладів:', error)
  } finally {
    loadingSchedules.value = false
  }
}

// Отримати поточний розклад
const currentSavedSchedule = computed(() => {
  if (savedSchedules.value.length === 0) return null
  return savedSchedules.value[currentScheduleIndex.value]
})

// Форматування дати для пагінації
function formatDateRange(weekStart, weekEnd) {
  const start = new Date(weekStart)
  const end = new Date(weekEnd)
  
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}.${month}`
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`
}

function goToPreviousSchedule() {
  if (currentScheduleIndex.value < savedSchedules.value.length - 1) {
    currentScheduleIndex.value++
  }
}

function goToNextSchedule() {
  if (currentScheduleIndex.value > 0) {
    currentScheduleIndex.value--
  }
}

function loadScheduleToForm() {
  const schedule = currentSavedSchedule.value
  if (!schedule) return
  
  weekStartDate.value = schedule.weekStart
  weekEndDate.value = schedule.weekEnd
  
  daysOfWeek.value.forEach(day => {
    day.trainings = []
  })
  
  if (schedule.trainings && Array.isArray(schedule.trainings)) {
    schedule.trainings.forEach(training => {
      const dayId = getDayIdFromName(training.dayName)
      const day = daysOfWeek.value.find(d => d.id === dayId)
      
      if (day) {
        day.trainings.push({
          name: training.name,
          time: training.time,
          type: training.type,
          difficulty: training.difficulty,
          address: training.address,
          isPaid: training.isPaid || false
        })
      }
    })
  }
  
  showNotification('success', 'Розклад завантажено у форму! Ви можете редагувати і зберегти його.', 'Успішно')
}

function getDayIdFromName(dayName) {
  const dayMap = {
    'Понеділок': 'monday',
    'Вівторок': 'tuesday',
    'Середа': 'wednesday',
    'Четвер': 'thursday',
    "П'ятниця": 'friday',
    'Субота': 'saturday',
    'Неділя': 'sunday'
  }
  return dayMap[dayName] || 'monday'
}

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

function openDatePicker(event) {
  const input = event.target
  if (input && typeof input.showPicker === 'function') {
    try {
      input.showPicker()
    } catch (error) {
      // Якщо showPicker не спрацював, нічого не робимо
    }
  }
}

watch(() => daysOfWeek.value.map(day => day.trainings.map(t => t.type)), (newTypes, oldTypes) => {
  daysOfWeek.value.forEach((day, dayIndex) => {
    day.trainings.forEach((training, trainingIndex) => {
      const oldType = oldTypes[dayIndex]?.[trainingIndex]
      const newType = newTypes[dayIndex]?.[trainingIndex]
      
      if (oldType && newType && oldType !== newType) {
        const availableDifficulties = getDifficultyLevels(training.type)
        if (availableDifficulties.length > 0) {
          training.difficulty = availableDifficulties[0].value
        }
        training.name = ''
      }
    })
  })
}, { deep: true })

function removeTraining(dayId, index) {
  const day = daysOfWeek.value.find(d => d.id === dayId)
  if (day) {
    day.trainings.splice(index, 1)
  }
}

async function generateSchedule() {
  validationError.value = false
  weekYearError.value = false
  
  let hasErrors = false
  
  if (!weekStartDate.value || !weekEndDate.value) {
    weekYearError.value = true
    hasErrors = true
  }
  
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
    forceUpdate.value++
    await nextTick()
    showNotification('error', 'Будь ласка, заповніть всі обов\'язкові поля (позначені зірочкою *)', 'Помилка валідації')
    return
  }
  
  generatedImage.value = true
  await new Promise(resolve => setTimeout(resolve, 100))
  await document.fonts.ready
  
  const canvas = scheduleCanvas.value
  if (!canvas) {
    console.error('Canvas not found')
    return
  }

  const ctx = canvas.getContext('2d')
  canvas.width = 1080
  canvas.height = 1920

  ctx.fillStyle = '#2C3E5F'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 70px Montserrat'
  ctx.textAlign = 'center'
  ctx.fillText('РОЗКЛАД ТРЕНУВАНЬ HTF', canvas.width / 2, 120)

  ctx.font = 'bold 26px Montserrat'
  const dollarWidth = ctx.measureText('($) - ').width
  ctx.font = '26px Montserrat'
  const restWidth = ctx.measureText('відвідування цього').width
  const totalWidth = dollarWidth + restWidth
  
  const startX = canvas.width - 60 - totalWidth
  
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 26px Montserrat'
  ctx.textAlign = 'left'
  ctx.fillText('($) - ', startX, 150)
  
  ctx.fillStyle = '#ffffff'
  ctx.font = '26px Montserrat'
  ctx.fillText('відвідування цього', startX + dollarWidth, 150)
  
  ctx.fillStyle = '#ffffff'
  ctx.font = '26px Montserrat'
  ctx.textAlign = 'right'
  ctx.fillText('тренування платне', canvas.width - 60, 180)

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
      img.onerror = () => resolve()
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

  daysOfWeek.value.forEach(day => {
    if (day.trainings.length > 0) {
      const groupedTrainings = []
      day.trainings.forEach(training => {
        const existingGroup = groupedTrainings.find(g => 
          g.type === training.type && 
          g.isPaid === training.isPaid && 
          g.address === training.address &&
          g.name === training.name
        )
        
        if (existingGroup) {
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

      const trainingHeights = []
      let totalBlockHeight = 15
      groupedTrainings.forEach((training, idx) => {
        const diffCount = training.difficultyTimes.length
        const difficultiesHeight = 28 + (diffCount - 1) * 35
        const contentHeight = 60
        const trainingHeight = Math.max(difficultiesHeight, contentHeight) + 30
        trainingHeights.push(trainingHeight)
        totalBlockHeight += trainingHeight
        
        if (idx < groupedTrainings.length - 1) {
          totalBlockHeight += 15
        }
      })
      totalBlockHeight += 15
      const blockHeight = totalBlockHeight

      const dayBoxWidth = 45
      const dayBoxHeight = blockHeight
      ctx.fillStyle = '#FFD700'
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

      const trainingBlockX = 40 + dayBoxWidth
      const trainingBlockWidth = canvas.width - trainingBlockX - 50
      ctx.fillStyle = '#2C3E5F'
      ctx.beginPath()
      ctx.moveTo(trainingBlockX, yPosition)
      ctx.lineTo(trainingBlockX + trainingBlockWidth - 15, yPosition)
      ctx.arcTo(trainingBlockX + trainingBlockWidth, yPosition, trainingBlockX + trainingBlockWidth, yPosition + 15, 15)
      ctx.lineTo(trainingBlockX + trainingBlockWidth, yPosition + blockHeight - 15)
      ctx.arcTo(trainingBlockX + trainingBlockWidth, yPosition + blockHeight, trainingBlockX + trainingBlockWidth - 15, yPosition + blockHeight, 15)
      ctx.lineTo(trainingBlockX, yPosition + blockHeight)
      ctx.closePath()
      ctx.fill()
      
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

      let trainingYPosition = yPosition + 15

      groupedTrainings.forEach((training, index) => {
        const currentTrainingHeight = trainingHeights[index]
        const contentHeight = 55
        const contentOffsetY = (currentTrainingHeight - contentHeight) / 2
        
        const iconImg = loadedIcons[training.type]
        if (iconImg) {
          const iconSize = 50
          ctx.drawImage(iconImg, trainingBlockX + 20, trainingYPosition + contentOffsetY, iconSize, iconSize)
        }

        ctx.fillStyle = '#ffffff'
        ctx.font = '300 32px Montserrat'
        ctx.textAlign = 'left'
        ctx.fillText(training.name, trainingBlockX + 85, trainingYPosition + contentOffsetY + 25)
        
        if (training.isPaid) {
          const nameWidth = ctx.measureText(training.name).width
          ctx.fillStyle = '#FFD700'
          ctx.fillText(' ($)', trainingBlockX + 85 + nameWidth, trainingYPosition + contentOffsetY + 25)
        }

        ctx.fillStyle = '#D1D5DB'
        ctx.font = '20px Montserrat'
        ctx.fillText(training.address, trainingBlockX + 85, trainingYPosition + contentOffsetY + 55)

        const difficultyX = trainingBlockX + trainingBlockWidth - 350
        const diffCount = training.difficultyTimes.length
        const totalDiffHeight = 28 + (diffCount - 1) * 35
        const startDiffY = trainingYPosition + (currentTrainingHeight - totalDiffHeight) / 2
        let diffY = startDiffY
        
        training.difficultyTimes.forEach((diffTime, idx) => {
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
          
          ctx.fillStyle = '#ffffff'
          ctx.font = '22px Montserrat'
          ctx.textAlign = 'right'
          const timesText = diffTime.times.join(' | ')
          ctx.fillText(timesText, trainingBlockX + trainingBlockWidth - 30, diffY + 18)
          
          diffY += 35
        })

        trainingYPosition += currentTrainingHeight

        if (index < groupedTrainings.length - 1) {
          trainingYPosition += 7.5
          ctx.strokeStyle = '#FFD700'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(trainingBlockX + 20, trainingYPosition)
          ctx.lineTo(trainingBlockX + trainingBlockWidth - 20, trainingYPosition)
          ctx.stroke()
          trainingYPosition += 7.5
        }
      })

      yPosition += blockHeight + 25
    }
  })
}

function downloadSchedule() {
  const canvas = scheduleCanvas.value
  if (!canvas) return

  const link = document.createElement('a')
  link.download = 'htf-schedule.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

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
  
  return dayDate.toISOString().split('T')[0]
}

async function saveScheduleToDatabase() {
  saveSuccess.value = false
  saveError.value = false
  saveErrorMessage.value = ''
  validationError.value = false
  weekYearError.value = false
  
  if (!weekStartDate.value || !weekEndDate.value) {
    weekYearError.value = true
    saveError.value = true
    saveErrorMessage.value = 'Необхідно вказати дати початку та кінця тижня'
    return
  }
  
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
    
    const scheduleId = await saveSchedule(
      weekStartDate.value,
      weekEndDate.value,
      trainingsToSave,
      auth.currentUser?.email || 'unknown'
    )
    
    if (scheduleId) {
      saveSuccess.value = true
      showNotification('success', `Успішно збережено ${trainingsToSave.length} тренувань`, 'Розклад збережено')
      
      setTimeout(() => {
        saveSuccess.value = false
      }, 5000)
      
      await loadAllSchedules()
    } else {
      throw new Error('Не вдалося отримати ID збереженого документа')
    }
    
  } catch (error) {
    console.error('Помилка збереження розкладу:', error)
    saveError.value = true
    saveErrorMessage.value = error.message || 'Невідома помилка при збереженні'
  }
}

onMounted(() => {
  loadAllSchedules()
})
</script>
