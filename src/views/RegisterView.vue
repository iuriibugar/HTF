<template>
  <div class="relative min-h-screen bg-cover bg-center bg-fixed" :style="{ backgroundImage: `url(${bgImage})` }">
    <!-- Затемнення -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Контент -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Хедер -->
      <HeaderWrapper />

      <!-- Форма реєстрації -->
      <div class="flex flex-col items-center justify-center flex-1 p-2 sm:p-4">
        <div class="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full border-2 border-yellow-400">
          <!-- Логотип -->
          <div class="flex justify-center mb-8">
            <img src="/HTF.png" alt="HTF Logo" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg border-4 border-yellow-400" />
          </div>
          
          <!-- Заголовок -->
          <div class="text-center mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold mb-2 text-yellow-400 uppercase tracking-wide">Доєднайтесь!</h1>
            <p class="text-gray-300 text-sm sm:text-base font-light">Заповніть форму, щоб приєднатися до нашої спільноти</p>
          </div>

          <!-- Форма -->
          <form @submit.prevent="submitRegistration" class="space-y-4">
            <!-- Якщо не авторизований - показуємо кнопку входу -->
            <div v-if="!isAuthenticated" class="space-y-4">
              <p class="text-gray-300 text-center mb-4">
                Для реєстрації спочатку авторизуйтесь через Google
              </p>
              
              <button
                type="button"
                @click="loginWithGoogle"
                :disabled="isLoggingIn"
                class="w-full flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-bold px-4 py-3 sm:px-6 sm:py-4 rounded-lg transition shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#000"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000"/>
                </svg>
                {{ isLoggingIn ? '⏳ Авторизую...' : '📧 Увійти через Google' }}
              </button>
              
              <!-- Помилка при вході -->
              <div v-if="error" class="bg-red-600/20 border-2 border-red-400 rounded-lg p-3 text-red-300 text-sm">
                ❌ {{ error }}
              </div>
            </div>

            <!-- Якщо авторизований - показуємо форму реєстрації -->
            <div v-else class="space-y-4">
              <!-- Google Email (обов'язкове, не редаговується) -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">📧 Email (Google)</label>
                <input
                  v-model="googleEmail"
                  type="email"
                  disabled
                  class="w-full px-4 py-3 bg-gray-700 border-2 border-green-500 rounded-lg text-white placeholder-gray-500 focus:outline-none cursor-not-allowed bg-gray-600/50"
                />
                <p class="text-xs text-green-400 mt-1">✓ Автоматично заповнене з вашого Google акаунту</p>
              </div>

              <!-- Текст про дані -->
              <div class="bg-yellow-600/20 border-l-4 border-yellow-400 p-4 rounded">
                <p class="text-yellow-100 text-sm">
                  ℹ️ <strong>Залиште ваші дані для зворотнього зв'язку.</strong> 
                  Це допоможе нам швидше обробити вашу заявку. Решта полів заповніть добровільно.
                </p>
              </div>

              <!-- Ім'я -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">👤 Ім'я</label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  placeholder="Ваше ім'я"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <!-- Прізвище -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">👤 Прізвище</label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  placeholder="Ваше прізвище"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <!-- Телефон -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">📱 Телефон</label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  placeholder="+38 (0XX) XXX-XX-XX"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <!-- Місто -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">📍 Місто</label>
                <input
                  v-model="formData.city"
                  type="text"
                  placeholder="Ваше місто"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <!-- Рівень досвіду -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">🏃 Рівень досвіду</label>
                <select
                  v-model="formData.experienceLevel"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition"
                >
                  <option value="">-- Виберіть рівень --</option>
                  <option value="beginner">Початківець</option>
                  <option value="intermediate">Любитель</option>
                  <option value="advanced">Досвідчений</option>
                  <option value="professional">Професіонал</option>
                </select>
              </div>

              <!-- Коментарі -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">💬 Коментарі</label>
                <textarea
                  v-model="formData.bio"
                  placeholder="Розкажіть про себе, ваші цілі та очікування..."
                  rows="3"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition resize-none"
                ></textarea>
              </div>

              <!-- Помилка -->
              <div v-if="error" class="bg-red-600/20 border-2 border-red-400 rounded-lg p-3 text-red-300 text-sm">
                ❌ {{ error }}
              </div>

              <!-- Успіх -->
              <div v-if="submitted" class="bg-green-600/20 border-2 border-green-400 rounded-lg p-4 text-green-300 text-center">
                <p class="font-semibold mb-2">✅ Запит успішно відправлено!</p>
                <p class="text-sm">Адміністратор розглянь вашу заявку протягом 24 годин.</p>
                <p class="text-xs text-green-400 mt-3">Перенаправляємо на головну сторінку...</p>
              </div>

              <!-- Кнопка -->
              <button
                v-if="!submitted"
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-bold px-6 py-3 rounded-lg transition duration-200 text-base sm:text-lg"
              >
                {{ isSubmitting ? '⏳ Відправляю...' : '📤 Направити запит' }}
              </button>

              <!-- Повернення на головну -->
              <button
                v-else
                type="button"
                @click="goHome"
                class="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg transition duration-200"
              >
                🏠 На головну
              </button>
            </div>
          </form>

          <!-- Підпис -->
          <p class="text-center text-xs sm:text-sm text-gray-400 mt-6 font-light">
            Happy TRI Friends - спільнота любителів триатлону
          </p>
        </div>
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { auth } from '@/firebase'
import { signInWithPopup } from 'firebase/auth'
import { googleProvider } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import HeaderWrapper from '../components/HeaderWrapper.vue'
import Footer from '../components/htfFooter.vue'
import { createOrUpdateUserProfile, registerNewUser } from '@/services/userService'
import backgroundImage from '@/assets/background.png'
import backgroundMob from '@/assets/backgroundMob.png'
import { navigateToHome } from '@/utils/navigation'

const router = useRouter()

const isAuthenticated = ref(false)
const googleEmail = ref('')
const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  experienceLevel: '',
  bio: ''
})

const isSubmitting = ref(false)
const error = ref('')
const submitted = ref(false)
const isLoggingIn = ref(false)

const isMobile = ref(false)
const bgImage = computed(() => isMobile.value ? backgroundMob : backgroundImage)

function _checkMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  // Перевіряємо чи користувач авторизований
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true
      googleEmail.value = user.email || ''
    } else {
      isAuthenticated.value = false
      googleEmail.value = ''
    }
  })
  _checkMobile()
  window.addEventListener('resize', _checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', _checkMobile)
})

async function loginWithGoogle() {
  try {
    isLoggingIn.value = true
    error.value = ''
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    if (user) {
      isAuthenticated.value = true
      googleEmail.value = user.email || ''
    }
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
      error.value = 'Помилка авторизації: ' + err.message
      console.error('Помилка входу:', err)
    }
  } finally {
    isLoggingIn.value = false
  }
}

async function submitRegistration() {
  try {
    error.value = ''
    isSubmitting.value = true

    const user = auth.currentUser
    if (!user) {
      throw new Error('Користувач не авторизований')
    }

    // Збираємо тільки непусті поля
    const dataToSave = {}
    if (formData.value.firstName) dataToSave.firstName = formData.value.firstName
    if (formData.value.lastName) dataToSave.lastName = formData.value.lastName
    if (formData.value.phone) dataToSave.phone = formData.value.phone
    if (formData.value.city) dataToSave.city = formData.value.city
    if (formData.value.experienceLevel) dataToSave.experienceLevel = formData.value.experienceLevel
    if (formData.value.bio) dataToSave.bio = formData.value.bio

    // Зберігаємо нового користувача в базу
    const result = await registerNewUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      additionalData: dataToSave
    })

    if (result) {
      submitted.value = true
      // Перенаправляємо на головну через 3 секунди
      setTimeout(() => {
        goHome()
      }, 3000)
    } else {
      error.value = 'Помилка при збереженні даних. Спробуйте пізніше.'
    }
  } catch (err) {
    error.value = 'Помилка: ' + err.message
    console.error('Помилка реєстрації:', err)
  } finally {
    isSubmitting.value = false
  }
}

function goHome() {
  navigateToHome()
}
</script>
