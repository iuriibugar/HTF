<template>
  <div class="max-w-2xl mx-auto">
    <!-- Заголовок -->
    <div class="bg-yellow-600/20 border-2 border-yellow-400 rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-bold text-yellow-300 mb-2">👋 Вітаємо у спільноті!</h2>
      <p class="text-yellow-100">
        Для повного доступу до платформи потрібно заповнити форму реєстрації і чекати одобрення адміністратора.
        Це займе не більше 24 годин.
      </p>
    </div>

    <!-- Форма реєстрації -->
    <div class="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-600">
      <form @submit.prevent="submitRegistration" class="space-y-4">
        <!-- Контактні дані -->
        <div class="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
          <h3 class="text-lg font-semibold text-yellow-400 mb-4">📞 Контактні дані</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Ім'я -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Ім'я *</label>
              <input
                v-model="formData.firstName"
                type="text"
                placeholder="Ваше ім'я"
                required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <!-- Прізвище -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Прізвище *</label>
              <input
                v-model="formData.lastName"
                type="text"
                placeholder="Ваше прізвище"
                required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <!-- Телефон -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Телефон *</label>
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="+38 (0XX) XXX-XX-XX"
                required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <!-- Місто -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Місто *</label>
              <input
                v-model="formData.city"
                type="text"
                placeholder="Ваше місто"
                required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        <!-- Інформація про спорт -->
        <div class="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
          <h3 class="text-lg font-semibold text-yellow-400 mb-4">🏃 Спортивна інформація</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Рівень досвіду *</label>
            <select
              v-model="formData.experienceLevel"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="">-- Виберіть рівень --</option>
              <option value="beginner">Початківець</option>
              <option value="intermediate">Любитель</option>
              <option value="advanced">Досвідчений</option>
              <option value="professional">Професіонал</option>
            </select>
          </div>
        </div>

        <!-- Додаткові коментарі -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Коментарі (опціонально)</label>
          <textarea
            v-model="formData.bio"
            placeholder="Розкажіть про себе, ваші цілі та очікування..."
            rows="4"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          ></textarea>
        </div>

        <!-- Помилка -->
        <div v-if="error" class="bg-red-600/20 border border-red-400 rounded-lg p-4 text-red-300">
          {{ error }}
        </div>

        <!-- Кнопки -->
        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-bold px-6 py-3 rounded-lg transition"
          >
            {{ isSubmitting ? '⏳ Відправляю...' : '📤 Направити запит' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Статус повідомлення -->
    <div v-if="submitted" class="mt-6 bg-green-600/20 border-2 border-green-400 rounded-lg p-6 text-center">
      <h3 class="text-xl font-bold text-green-300 mb-2">✅ Запит відправлено!</h3>
      <p class="text-green-100">
        Дякуємо за реєстрацію! Ваш запит переглянув адміністратор протягом 24 годин.
        Ви отримаєте сповіщення, коли ваш акаунт буде одобрено.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase'
import { updateUserProfile } from '@/services/userService'
import { showLoader, hideLoader } from '@/stores/loaderStore'

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

async function submitRegistration() {
  try {
    error.value = ''
    isSubmitting.value = true
    showLoader()

    const user = auth.currentUser
    if (!user) {
      throw new Error('Користувач не авторизований')
    }

    // Зберігаємо контактні дані
    const result = await updateUserProfile(user.uid, {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      phone: formData.value.phone,
      city: formData.value.city,
      experienceLevel: formData.value.experienceLevel,
      bio: formData.value.bio
    })

    if (result) {
      submitted.value = true
      // Очищуємо форму
      setTimeout(() => {
        formData.value = {
          firstName: '',
          lastName: '',
          phone: '',
          city: '',
          experienceLevel: '',
          bio: ''
        }
      }, 3000)
    } else {
      error.value = 'Помилка при збереженні даних. Спробуйте пізніше.'
    }
  } catch (err) {
    error.value = 'Помилка: ' + err.message
    console.error('Помилка реєстрації:', err)
  } finally {
    isSubmitting.value = false
    hideLoader()
  }
}
</script>
