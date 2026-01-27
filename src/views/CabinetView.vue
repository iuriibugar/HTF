<template>
  <div class="relative h-screen bg-cover bg-center bg-fixed overflow-hidden" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- Затемнення фону -->
    <div class="absolute inset-0 bg-black opacity-40"></div>

    <!-- Нотифікація -->
    <NotificationComponent
      :show="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @close="closeNotification"
    />

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
              <p class="font-semibold text-gray-800 text-center">{{ userName || 'Користувач' }}</p>
              <button 
                @click="logout" 
                class="bg-gray-200 hover:bg-gray-300 p-1.5 rounded transition flex-shrink-0 border border-red-500"
                title="Вийти">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 text-center break-all">{{ userEmail }}</p>
          </div>

          <!-- Блок Адміна (тільки для адмінів) -->
          <div v-if="isAdmin" class="mb-6">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Адміністрування</h3>
            <button 
              @click="activeSection = 'form-schedule'"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition flex items-center gap-2', 
                       activeSection === 'form-schedule' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700']">
              <span :class="activeSection === 'form-schedule' ? 'text-white' : 'text-red-500'">📅</span>
              <span>Сформувати розклад</span>
            </button>
            <button 
              @click="activeSection = 'donations-manager'"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition', 
                       activeSection === 'donations-manager' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700']">
              💰 Управління донатами
            </button>
          </div>
          
          <!-- Блок для всіх -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Загальне</h3>
            <button 
              @click="activeSection = 'training-registration'"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition', 
                       activeSection === 'training-registration' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700']">
              ✍️ Реєстрація на тренування
            </button>
          </div>
        </aside>

        <!-- Основний контент -->
        <main class="flex-1 w-full">
          <!-- Динамічний контент -->
          <component 
            :is="currentComponent" 
            :notification="notification"
            @show-notification="showNotification"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Header from '../components/htfHeader.vue'
import NotificationComponent from '../components/Notification.vue'
import FormSchedule from './cabinet/admin/FormSchedule.vue'
import DonationsManager from './cabinet/admin/DonationsManager.vue'
import TrainingRegistration from './cabinet/user/TrainingRegistration.vue'
import backgroundImage from '@/assets/background.png'

const userName = ref('')
const userEmail = ref('')
const userPhoto = ref('')
const isAdmin = ref(false)
const activeSection = ref('training-registration')

// Для нотифікацій
const notification = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

// Функція для показу нотифікації
function showNotification(type, message, title = '') {
  notification.value = {
    show: true,
    type,
    title,
    message
  }
}

// Функція для закриття нотифікації
function closeNotification() {
  notification.value.show = false
}

// Визначаємо поточний компонент
const currentComponent = computed(() => {
  const components = {
    'form-schedule': FormSchedule,
    'donations-manager': DonationsManager,
    'training-registration': TrainingRegistration
  }
  return components[activeSection.value] || TrainingRegistration
})

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || ''
      userEmail.value = user.email || ''
      userPhoto.value = user.photoURL || ''
      
      // Перевірка чи користувач адмін (за email)
      const adminEmails = [
        'kulikalovdenis@gmail.com',
        'bugary20@gmail.com',
      ] // Додайте інші email адмінів
      isAdmin.value = adminEmails.includes(user.email)
      
      // Встановлюємо початкову секцію
      if (isAdmin.value) {
        activeSection.value = 'form-schedule'
      }
    }
  })
})

async function logout() {
  await auth.signOut()
  window.location.href = '/HTF/'
}
</script>
