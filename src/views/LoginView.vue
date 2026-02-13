<template>
  <div class="relative min-h-screen bg-cover bg-center bg-fixed" :style="{ backgroundImage: `url(${bgImage})` }">
    <!-- Затемнення -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Контент -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Хедер -->
      <HeaderWrapper />

      <!-- Форма авторизації -->
      <div class="flex flex-col items-center justify-center flex-1 p-2 sm:p-4">
        <div class="bg bg-opacity-80 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl max-w-xs sm:max-w-md w-full border-2 border-yellow-400">
          <!-- Логотип -->
          <div class="flex justify-center mb-8">
            <img src="/HTF.png" alt="HTF Logo" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-lg border-4 border-yellow-400" />
          </div>
          
          <div class="text-center mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold mb-2 text-yellow-400 uppercase tracking-wide">Вітаємо!</h1>
            <p class="text-white text-sm sm:text-base font-light">Happy TRI Friends</p>
          </div>
          
          <button 
            @click="loginWithGoogle" 
            class="w-full flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-3 sm:px-6 sm:py-4 rounded-xl transition shadow-lg hover:shadow-xl text-base sm:text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#000"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000"/>
            </svg>
            Увійти через Google
          </button>
          
          <p class="text-center text-xs sm:text-sm text-gray-300 mt-6 sm:mt-8 font-light">
            Приєднуйтесь до нашої триатлонної спільноти
          </p>
        </div>
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useRouter } from 'vue-router'
import { getUserProfile } from '@/services/userService'
import HeaderWrapper from '../components/HeaderWrapper.vue'
import Footer from '../components/htfFooter.vue'
import backgroundImage from '@/assets/background.png'
import backgroundMob from '@/assets/backgroundMob.png'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const router = useRouter()

const isMobile = ref(false)
const bgImage = computed(() => isMobile.value ? backgroundMob : backgroundImage)

function _checkMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  _checkMobile()
  window.addEventListener('resize', _checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', _checkMobile)
})

// Список email адміністраторів
const ADMIN_EMAILS = [
  'kulikalovdenis@gmail.com',
  'bugary20@gmail.com',
]

async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Чекаємо, щоб Firebase повністю синхронізувався
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Визначаємо роль на основі email
    if (ADMIN_EMAILS.includes(user.email)) {
      router.push('/admin')
    } else {
      // Для неадміністраторів - перевіряємо статус одобрення в Firestore
      try {
        const userProfile = await getUserProfile(user.uid)
        
        if (userProfile && userProfile.isApproved) {
          // Якщо одобрений - йдемо в кабінет
          router.push('/user')
        } else {
          // Якщо не одобрений або немає даних - йдемо на реєстрацію
          router.push('/register')
        }
      } catch (error) {
        console.error('Помилка при отриманні профілю:', error)
        // При помилці йдемо на реєстрацію
        router.push('/register')
      }
    }
  } catch (error) {
    // Ігноруємо помилки закриття popup
    if (error.code && 
        error.code !== 'auth/popup-closed-by-user' && 
        error.code !== 'auth/cancelled-popup-request') {
      console.error('Помилка авторизації:', error.code, error.message)
    }
  }
}
</script>