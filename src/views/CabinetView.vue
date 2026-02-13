<template>
  <div class="relative h-screen bg-cover bg-center bg-fixed overflow-hidden" :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: isMobile ? (viewportW + 'px ' + viewportH + 'px') : 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: isMobile ? 'scroll' : 'fixed', backgroundPosition: isMobile ? 'center top' : 'center' }">
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

    <!-- Повідомлення про статус одобрення -->
    <div v-if="!isAdmin && !isApproved" class="fixed top-0 left-0 right-0 z-50 bg-yellow-600/90 border-b border-yellow-400">
      <div class="max-w-7xl mx-auto px-4 py-3 text-center">
        <p class="text-white font-semibold">
          ⏳ Ви будете перенаправлені на сторінку реєстрації
        </p>
      </div>
    </div>

    <!-- Весь контент -->
    <div class="relative z-10 h-full flex flex-col">
      <HeaderWrapper />

      <div v-if="userStatus === 'blocked'" class="flex flex-1 items-center justify-center">
        <div class="bg-red-700/90 border-2 border-red-400 rounded-lg p-8 text-center max-w-md mx-auto">
          <h2 class="text-2xl font-bold text-white mb-4">🚫 Вас заблоковано</h2>
          <p class="text-red-200 mb-2">Ваш акаунт заблокований адміністратором. Для уточнення причин зверніться до підтримки або адміністрації.</p>
          <button @click="logoutHandler" class="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition">Вийти</button>
        </div>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-2 lg:gap-4 p-2 sm:p-4 flex-1 min-h-0 overflow-y-auto">
        <aside
          class="w-full lg:w-80 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-2 sm:p-4 flex-shrink-0 overflow-y-auto flex flex-col mb-2 lg:mb-0">
          <div class="flex flex-col items-center mb-6 pb-6 border-b border-gray-400">
            <div v-if="userPhoto" class="w-20 h-20 rounded-full mb-3 shadow-md overflow-hidden bg-gray-200">
              <img :src="userPhoto" :alt="userName" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
            </div>
            <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-md">
              {{ userName ? userName.charAt(0).toUpperCase() : 'A' }}
            </div>
            <div class="flex items-center justify-center gap-2 w-full">
              <p class="font-semibold text-yellow-400 text-center">{{ userName || 'Користувач' }}</p>
              <button 
                @click="logoutHandler" 
                class="bg-transparent border-2 border-yellow-400 text-yellow-400 p-1.5 rounded transition flex-shrink-0 hover:border-white hover:text-white"
                title="Вийти">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-yellow-400 text-center break-all">{{ userEmail }}</p>
            <div class="mt-3 w-full">
              <div v-if="!isAdmin" class="text-center">
                <div v-if="isApproved" class="inline-block px-3 py-1 bg-green-600/50 text-green-300 rounded-full text-xs font-semibold">
                  ✓ Підтверджений учасник
                </div>
                <div v-else class="inline-block px-3 py-1 bg-yellow-600/50 text-yellow-300 rounded-full text-xs font-semibold">
                  ⏳ Очікує погодження
                </div>
              </div>
              <div v-else class="inline-block px-3 py-1 bg-blue-600/50 text-blue-300 rounded-full text-xs font-semibold w-full text-center">
                👑 Адміністратор
              </div>
            </div>
          </div>
          <div v-if="isAdmin" class="mb-6">
            <h3 class="text-sm font-bold text-yellow-400 uppercase mb-3">Адміністрування</h3>
            <button 
              @click="router.push('/admin/users')"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition flex items-center gap-2 border-2 border-white text-white', 
                       activeSection === 'users-manager' ? 'bg-yellow-400 text-black border-yellow-400' : 'hover:border-yellow-400 hover:text-yellow-400']">
              <span>👥</span>
              <span>Управління користувачами</span>
            </button>
            <button 
              @click="router.push('/admin/schedule')"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition flex items-center gap-2 border-2 border-white text-white', 
                       activeSection === 'form-schedule' ? 'bg-yellow-400 text-black border-yellow-400' : 'hover:border-yellow-400 hover:text-yellow-400']">
              <span>📅</span>
              <span>Сформувати розклад</span>
            </button>
            <button 
              @click="router.push('/admin/donations')"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition border-2 border-white text-white', 
                       activeSection === 'donations-manager' ? 'bg-yellow-400 text-black border-yellow-400' : 'hover:border-yellow-400 hover:text-yellow-400']">
              <span>💰 Управління донатами</span>
            </button>
          </div>
          <div>
            <h3 class="text-sm font-bold text-yellow-400 uppercase mb-3">Загальне</h3>
            <button 
              @click="router.push('/user/profile')"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition border-2 border-white text-white', 
                       activeSection === 'user-profile' ? 'bg-yellow-400 text-black border-yellow-400' : 'hover:border-yellow-400 hover:text-yellow-400']">
              📋 Мої дані
            </button>
            <button 
              @click="router.push('/user/registration')"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition border-2 border-white text-white', 
                       activeSection === 'training-registration' ? 'bg-yellow-400 text-black border-yellow-400' : 'hover:border-yellow-400 hover:text-yellow-400']">
              ✍️ Реєстрація на тренування
            </button>
            <button 
              @click="router.push('/user/statistics')"
              :class="['w-full text-left px-4 py-3 rounded-lg mb-2 transition border-2 border-white text-white', 
                       activeSection === 'statistics' ? 'bg-yellow-400 text-black border-yellow-400' : 'hover:border-yellow-400 hover:text-yellow-400']">
              📊 Статистика
            </button>
          </div>
        </aside>
        <main class="flex-1 w-full">
          <div v-if="!isAdmin && !isApproved" class="bg-yellow-600/20 border-2 border-yellow-400 rounded-lg p-6 text-center mb-4">
            <h3 class="text-xl font-bold text-yellow-300 mb-2">⏳ Акаунт в очікуванні</h3>
            <p class="text-yellow-100">
              Дякуємо за реєстрацію! Ваш запит перебуває на розгляді у адміністратора.
              Це займе не більше 24 годин. Ви отримаєте сповіщення, коли доступ буде надано.
            </p>
            <button
              @click="router.push('/register')"
              class="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition"
            >
              ✏️ Оновити дані
            </button>
          </div>
          <component 
            v-if="isAdmin || isApproved"
            :is="currentComponent" 
            :notification="notification"
            :trainingStats="trainingStats"
            :userAmount="userAmount"
            :userDiscount="userDiscount"
            @show-notification="showNotification"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'
import HeaderWrapper from '../components/HeaderWrapper.vue'
import NotificationComponent from '../components/Notification.vue'
import FormSchedule from './cabinet/admin/FormSchedule.vue'
import DonationsManager from './cabinet/admin/DonationsManager.vue'
import UsersManager from './cabinet/admin/UsersManager.vue'
import TrainingRegistration from './cabinet/user/TrainingRegistration.vue'
import UserProfile from './cabinet/user/UserProfile.vue'
import Statistics from './cabinet/user/Statistics.vue'
import backgroundImage from '@/assets/background.png'
import backgroundMob from '@/assets/backgroundMob.png'
import { isAdminUser, logout } from '@/services/authService'
import { getUserProfile } from '@/services/userService'
import { navigateToHome } from '@/utils/navigation'
import { showLoader, hideLoader } from '@/stores/loaderStore'

const route = useRoute()
const router = useRouter()
const props = defineProps({
  section: String
})

const userName = ref('')
const userEmail = ref('')
const userPhoto = ref('')
const isAdmin = ref(false)
const isApproved = ref(false)
const userStatus = ref('active')
const activeSection = ref('training-registration')
const trainingStats = ref({
  swimming: { registered: 0, completed: 0 },
  cycling: { registered: 0, completed: 0 },
  running: { registered: 0, completed: 0 },
  other: { registered: 0, completed: 0 }
})
const userAmount = ref(0)
const userDiscount = ref(null)
const isMobile = ref(false)
const viewportW = ref(0)
const viewportH = ref(0)
const bgImage = computed(() => isMobile.value ? backgroundMob : backgroundImage)

function _checkMobile() {
  viewportW.value = window.innerWidth
  viewportH.value = window.innerHeight
  isMobile.value = viewportW.value < 768
}

const ADMIN_EMAILS = [
  'kulikalovdenis@gmail.com',
  'bugary20@gmail.com',
]

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
    'users-manager': UsersManager,
    'training-registration': TrainingRegistration,
    'user-profile': UserProfile,
    'statistics': Statistics
  }
  return components[activeSection.value] || TrainingRegistration
})

// Функція для завантаження профілю користувача
async function loadUserProfile(userId) {
  try {
    showLoader()
    const userProfile = await getUserProfile(userId)
    if (userProfile) {
      isApproved.value = userProfile.isApproved
      userStatus.value = userProfile.status
      isAdmin.value = userProfile.role === 'admin'
      trainingStats.value = userProfile.trainingStats || trainingStats.value
      userAmount.value = userProfile.amount || 0
      userDiscount.value = userProfile.discount?.percent || null
    } else {
      isApproved.value = false
      userStatus.value = 'active'
      isAdmin.value = false
      userAmount.value = 0
      userDiscount.value = null
    }
  } catch (error) {
    console.error('Помилка при завантаженні профілю:', error)
    isApproved.value = false
    userAmount.value = 0
    userDiscount.value = null
  } finally {
    hideLoader()
  }
}

// Стежимо за параметром маршруту
watch(() => route.path, (newPath) => {
  if (newPath === '/user/profile') {
    activeSection.value = 'user-profile'
  } else if (newPath === '/user/registration') {
    activeSection.value = 'training-registration'
  } else if (newPath === '/user/statistics') {
    activeSection.value = 'statistics'
    // Оновлюємо дані при переході до статистики
    const user = auth.currentUser
    if (user) {
      loadUserProfile(user.uid)
    }
  } else if (newPath === '/admin/users') {
    activeSection.value = 'users-manager'
  } else if (newPath === '/admin/schedule') {
    activeSection.value = 'form-schedule'
  } else if (newPath === '/admin/donations') {
    activeSection.value = 'donations-manager'
  } else if (newPath.includes('/user')) {
    activeSection.value = 'training-registration'
  } else if (newPath.includes('/admin')) {
    activeSection.value = 'form-schedule'
  } else {
    activeSection.value = 'training-registration'
  }
}, { immediate: true })

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userName.value = user.displayName || ''
      userEmail.value = user.email || ''
      userPhoto.value = user.photoURL || ''
      
      // Завантажуємо профіль користувача (isAdmin визначається з профілю)
      await loadUserProfile(user.uid)
      
      // Якщо користувач звичайний та НЕ одобрений - перенаправляємо на реєстрацію
      if (!isAdmin.value && !isApproved.value) {
        router.push('/register')
        return
      }
      
      // Встановлюємо початкову секцію залежно від маршруту
      if (route.path === '/user/registration') {
        activeSection.value = 'training-registration'
      } else if (route.path === '/user/statistics') {
        activeSection.value = 'statistics'
      } else if (route.path === '/admin/users') {
        activeSection.value = 'users-manager'
      } else if (route.path === '/admin/schedule') {
        activeSection.value = 'form-schedule'
      } else if (route.path === '/admin/donations') {
        activeSection.value = 'donations-manager'
      } else if (route.path.includes('/user')) {
        activeSection.value = 'training-registration'
      } else if (route.path.includes('/admin') && isAdmin.value) {
        activeSection.value = 'form-schedule'
      } else {
        activeSection.value = 'training-registration'
      }
    }
  })
  _checkMobile()
  window.addEventListener('resize', _checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', _checkMobile)
})

async function logoutHandler() {
  try {
    await logout()
    router.push('/')
  } catch (error) {
    console.error('Помилка виходу:', error)
  }
}
</script>
