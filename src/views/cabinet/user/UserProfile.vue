<template>
  <div class="w-full h-full flex flex-col overflow-y-auto">
    <!-- Заголовок -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-yellow-400 mb-2">📋 Мої дані</h1>
      <p class="text-gray-300">Оновіть вашу особисту інформацію</p>
    </div>

    <!-- Форма -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
      <!-- Основна інформація -->
      <div class="lg:col-span-2 bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border-2 border-gray-700">
        <h2 class="text-lg font-semibold text-yellow-400 mb-4">Основна інформація</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Ім'я</label>
            <input 
              v-model="formData.firstName" 
              type="text" 
              placeholder="Ваше ім'я"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Прізвище</label>
            <input 
              v-model="formData.lastName" 
              type="text" 
              placeholder="Ваше прізвище"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Дата народження</label>
            <input 
              v-model="formData.birthDate" 
              type="date"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Стать</label>
            <select 
              v-model="formData.gender" 
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition">
              <option value="">Виберіть стать</option>
              <option value="male">Чоловік</option>
              <option value="female">Жінка</option>
              <option value="other">Інше</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Контактна інформація -->
      <div class="lg:col-span-2 bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border-2 border-gray-700">
        <h2 class="text-lg font-semibold text-yellow-400 mb-4">📞 Контактна інформація</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Телефон</label>
            <input 
              v-model="formData.phone" 
              type="tel" 
              placeholder="+38 (099) 123-45-67"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Місто</label>
            <input 
              v-model="formData.city" 
              type="text" 
              placeholder="Ваше місто"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Адреса</label>
            <input 
              v-model="formData.address" 
              type="text" 
              placeholder="Вулиця, дім"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Відділення Нової Пошти</label>
            <input 
              v-model="formData.postalDepartment" 
              type="text" 
              placeholder="Наприклад: Київ №1"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
            >
          </div>
        </div>
      </div>

      <!-- Контактна особа в разі необхідності -->
      <div class="lg:col-span-2 bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border-2 border-gray-700">
        <h2 class="text-lg font-semibold text-yellow-400 mb-4">🆘 Контактна особа в разі необхідності</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Ім'я контактної особи</label>
            <input 
              v-model="formData.emergencyContactName" 
              type="text" 
              placeholder="Ім'я і прізвище"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Телефон контактної особи</label>
            <input 
              v-model="formData.emergencyContactPhone" 
              type="tel" 
              placeholder="+38 (099) 123-45-67"
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
            >
          </div>
        </div>
      </div>

      <!-- Інформація про спорт -->
      <div class="lg:col-span-2 bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border-2 border-gray-700">
        <h2 class="text-lg font-semibold text-yellow-400 mb-4">🏊 Інформація про спорт</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Рівень досвіду</label>
            <select 
              v-model="formData.experienceLevel" 
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition">
              <option value="">Виберіть рівень</option>
              <option value="beginner">Початківець</option>
              <option value="intermediate">Середній рівень</option>
              <option value="advanced">Продвинутий</option>
              <option value="professional">Професіонал</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Спеціалізація</label>
            <select 
              v-model="formData.specialization" 
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition">
              <option value="">Виберіть спеціалізацію</option>
              <option value="swimming">Плавання</option>
              <option value="cycling">Велоспорт</option>
              <option value="running">Біг</option>
              <option value="triathlon">Триатлон</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Про себе</label>
            <textarea 
              v-model="formData.bio" 
              rows="4"
              placeholder="Розповідьте про себе..."
              class="w-full px-4 py-2 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Кнопки дії -->
      <div class="lg:col-span-2 flex gap-3 mt-auto pt-6">
        <button 
          @click="saveProfile"
          :disabled="isSaving"
          class="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2">
          <span v-if="!isSaving">✅ Зберегти</span>
          <span v-else>⏳ Збереження...</span>
        </button>
        <button 
          @click="resetForm"
          class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition">
          ↺ Відмінити
        </button>
      </div>

      <!-- Статус збереження -->
      <div v-if="saveStatus" class="lg:col-span-2 p-4 rounded-lg" :class="saveStatus.type === 'success' ? 'bg-green-900/30 border-2 border-green-500 text-green-300' : 'bg-red-900/30 border-2 border-red-500 text-red-300'">
        {{ saveStatus.message }}
      </div>
    </div>

    <!-- Нотифікація -->
    <Notification
      :show="notification.show"
      :type="notification.type"
      :message="notification.message"
      @close="notification.show = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRoute } from 'vue-router'
import { getUserProfile, updateUserProfile } from '@/services/userService'
import Notification from '@/components/Notification.vue'
import { showLoader, hideLoader } from '@/stores/loaderStore'

const route = useRoute()

const formData = ref({
  firstName: '',
  lastName: '',
  birthDate: '',
  gender: '',
  phone: '',
  city: '',
  address: '',
  postalDepartment: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  experienceLevel: '',
  specialization: '',
  bio: ''
})

const originalData = ref({})
const isSaving = ref(false)
const saveStatus = ref(null)
const notification = ref({
  show: false,
  type: 'success',
  message: ''
})

function showNotification(type, message) {
  notification.value = {
    show: true,
    type,
    message
  }
}

// Завантажити дані користувача
const loadUserData = async () => {
  try {
    showLoader()
    const user = auth.currentUser
    if (!user) {
      hideLoader()
      return
    }

    const profile = await getUserProfile(user.uid)
    
    if (profile) {
      formData.value = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        birthDate: profile.birthDate || '',
        gender: profile.gender || '',
        phone: profile.phone || '',
        city: profile.city || '',
        address: profile.address || '',
        postalDepartment: profile.postalDepartment || '',
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactPhone: profile.emergencyContactPhone || '',
        experienceLevel: profile.experienceLevel || '',
        specialization: profile.specialization || '',
        bio: profile.bio || ''
      }
      // Використовуємо глибоку копію для originalData
      originalData.value = JSON.parse(JSON.stringify(formData.value))
    }
  } catch (error) {
    console.error('Помилка завантаження даних:', error)
    saveStatus.value = {
      type: 'error',
      message: '❌ Помилка завантаження даних'
    }
  }
  finally {
    hideLoader()
  }
}

// Зберегти дані
const saveProfile = async () => {
  try {
    isSaving.value = true
    showLoader()

    const user = auth.currentUser
    if (!user) {
      throw new Error('Користувач не аутентифікований')
    }

    // Знаходимо тільки змінені поля, порівнюючи з оригінальними
    const dataToSave = {}
    let changedFields = 0
    
    Object.keys(formData.value).forEach(key => {
      const currentValue = formData.value[key]
      const originalValue = originalData.value[key]
      
      // Якщо значення змінилось
      if (currentValue !== originalValue) {
        // Якщо поле пусте, передаємо null (щоб очистити в БД)
        // Інакше передаємо значення як є
        dataToSave[key] = currentValue === '' ? null : currentValue
        changedFields++
      }
    })
    
    if (changedFields === 0) {
      showNotification('info', 'ℹ️ Не було змін для збереження')
      return
    }
    
    await updateUserProfile(user.uid, dataToSave)
    
    // Перезавантажуємо дані щоб переконатись що все синхронізовано
    await loadUserData()
    
    showNotification('success', '✅ Дані успішно збережені!')
    saveStatus.value = {
      type: 'success',
      message: '✅ Дані успішно збережені'
    }

    setTimeout(() => {
      saveStatus.value = null
    }, 3000)

  } catch (error) {
    console.error('Помилка збереження:', error)
    showNotification('error', 'Помилка при збереженні даних: ' + error.message)
    saveStatus.value = {
      type: 'error',
      message: 'Помилка при збереженні даних'
    }
  } finally {
    isSaving.value = false
    hideLoader()
  }
}

// Скасувати зміни
const resetForm = () => {
  formData.value = { ...originalData.value }
  saveStatus.value = null
}

// При завантаженні компонента
onMounted(() => {
  // Якщо користувач вже аутентифікований, завантажуємо дані відразу
  if (auth.currentUser) {
    loadUserData()
  } else {
    // Інакше чекаємо на стан аутентифікації
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserData()
      }
    })
  }
})

// Слідити за маршрутом і перезавантажувати дані при переході на цю сторінку
watch(() => route.path, (newPath) => {
  if (newPath === '/user/profile') {
    loadUserData()
  }
})

// При розмонтуванні компонента
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  // Очищуємо форму
  Object.keys(formData.value).forEach(key => {
    formData.value[key] = ''
  })
})
</script>
