<template>
  <div class="space-y-6">
    <!-- ItemsManager компонент -->
    <ItemsManager
      title="👥 Управління тренерами"
      list-title="📋 Список тренерів"
      form-create-title="➕ Новий тренер"
      form-edit-title="✏️ Редагування тренера"
      empty-message="Тренерів ще немає"
      :items="trainers"
      :loading="loading"
      :saving="saving"
      :editing-id="editingId"
      @edit="editTrainer"
      @delete="deleteTrainer"
      @save="saveTrainer"
      @cancel="cancelEdit"
    >
      <!-- Слот для форми -->
      <template #form>
        <div class="space-y-4">
          <!-- Зображення -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">📷 Фото</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              @change="handleImageChange"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:text-yellow-400 file:bg-gray-600 file:border-0 file:px-3 file:py-1 focus:outline-none focus:border-yellow-400 transition"
            />
            <!-- Попередження -->
            <div class="mt-2 p-3 bg-yellow-400/20 border border-yellow-400/50 rounded-lg">
              <p class="text-yellow-300 text-sm">⚠️ Завантажте зображення (JPG, PNG) макс. 2MB</p>
            </div>
            <!-- Превью -->
            <div v-if="formData.imageBase64" class="mt-3 h-32 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
              <img :src="formData.imageBase64" alt="Preview" class="max-w-full max-h-full object-contain rounded-lg" />
            </div>
          </div>

          <!-- Прізвище -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">👤 Прізвище</label>
            <input
              v-model="formData.lastName"
              type="text"
              placeholder="Прізвище тренера"
              autocomplete="off"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          <!-- Ім'я -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">👤 Ім'я</label>
            <input
              v-model="formData.firstName"
              type="text"
              placeholder="Ім'я тренера"
              autocomplete="off"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          <!-- Опис -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">📝 Опис</label>
            <textarea
              v-model="formData.description"
              placeholder="Розкажіть про тренера, його досвід, спеціалізацію..."
              rows="4"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition resize-none"
            ></textarea>
          </div>

          <!-- Instagram посилання -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">📱 Instagram посилання</label>
            <input
              v-model="formData.instagramLink"
              type="url"
              placeholder="https://instagram.com/username"
              autocomplete="off"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          <!-- Порядковий номер -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">🔢 Порядковий номер</label>
            <input
              v-model.number="formData.order"
              type="number"
              min="1"
              placeholder="1"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          <!-- Помилка -->
          <div v-if="error" class="bg-red-600/20 border-2 border-red-400 rounded-lg p-3 text-red-300 text-sm">
            ❌ {{ error }}
          </div>
        </div>
      </template>

      <!-- Слот для карток тренерів -->
      <template #item-card="{ item }">
        <div v-if="item.imageBase64" class="mb-3 h-32 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
          <img :src="item.imageBase64" alt="Trainer" class="max-w-full max-h-full object-contain rounded-lg" />
        </div>
        <div v-else class="mb-3 h-32 bg-gray-600 rounded-lg flex items-center justify-center">
          <span class="text-gray-400">Без фото</span>
        </div>

        <h3 class="font-bold text-lg mb-2 text-yellow-400">{{ item.lastName }} {{ item.firstName }}</h3>
        <p class="text-sm text-white mb-3 line-clamp-3">{{ item.description }}</p>
        
        <a 
          v-if="item.instagramLink" 
          :href="item.instagramLink" 
          target="_blank" 
          class="text-xs text-yellow-400 hover:underline block mb-3 truncate">
          📱 Instagram профіль
        </a>
      </template>
    </ItemsManager>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ItemsManager from '@/components/ItemsManager.vue'
import { 
  getAllTrainers, 
  createTrainer, 
  updateTrainer, 
  deleteTrainer as deleteTrainerService, 
  convertImageToBase64 
} from '@/services/trainerService'
import { validateImage, getImageInfo } from '@/utils/imageValidation'

const trainers = ref([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const editingId = ref(null)

const formData = ref({
  firstName: '',
  lastName: '',
  imageBase64: '',
  description: '',
  instagramLink: '',
  order: 1
})

// Завантажити всіх тренерів
onMounted(async () => {
  try {
    loading.value = true
    trainers.value = await getAllTrainers()
  } catch (err) {
    error.value = 'Помилка при завантаженні тренерів: ' + err.message
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Обробка вибору зображення
async function handleImageChange(event) {
  try {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    // Валідуємо файл
    const validation = validateImage(file)
    if (!validation.isValid) {
      error.value = validation.error
      event.target.value = '' // Очищуємо input
      return
    }

    // Якщо валідація пройшла, конвертуємо в base64
    const imageInfo = getImageInfo(file)
    formData.value.imageBase64 = await convertImageToBase64(file)
    error.value = '' // Очищуємо помилки при успіху
  } catch (err) {
    error.value = 'Помилка при завантаженні зображення: ' + err.message
  }
}

// Редагування тренера
function editTrainer(trainer) {
  editingId.value = trainer.id
  formData.value = {
    firstName: trainer.firstName,
    lastName: trainer.lastName,
    imageBase64: trainer.imageBase64,
    description: trainer.description,
    instagramLink: trainer.instagramLink || '',
    order: trainer.order || 1
  }
  error.value = ''
}

// Скасування редагування
function cancelEdit() {
  editingId.value = null
  resetForm()
  error.value = ''
}

// Скинути форму
function resetForm() {
  formData.value = {
    firstName: '',
    lastName: '',
    imageBase64: '',
    description: '',
    instagramLink: '',
    order: 1
  }
}

// Зберігання тренера
async function saveTrainer() {
  try {
    error.value = ''
    saving.value = true

    if (!formData.value.firstName.trim()) {
      error.value = 'Введіть ім\'я тренера'
      return
    }
    if (!formData.value.lastName.trim()) {
      error.value = 'Введіть прізвище тренера'
      return
    }
    if (!formData.value.imageBase64) {
      error.value = 'Завантажте фото тренера'
      return
    }
    if (!formData.value.description.trim()) {
      error.value = 'Введіть опис тренера'
      return
    }

    if (editingId.value) {
      // Оновлюємо існуючого тренера
      await updateTrainer(editingId.value, formData.value)
      trainers.value = await getAllTrainers()
    } else {
      // Створюємо нового тренера
      await createTrainer(formData.value)
      trainers.value = await getAllTrainers()
    }

    cancelEdit()
  } catch (err) {
    error.value = 'Помилка при збереженні: ' + err.message
    console.error(err)
  } finally {
    saving.value = false
  }
}

// Видалення тренера
async function deleteTrainerHandler(trainerId) {
  try {
    if (confirm('Ви впевнені, що хочете видалити цього тренера?')) {
      error.value = ''
      await deleteTrainerService(trainerId)
      trainers.value = await getAllTrainers()
      
      if (editingId.value === trainerId) {
        cancelEdit()
      }
    }
  } catch (err) {
    error.value = 'Помилка при видаленні: ' + err.message
    console.error(err)
  }
}

// Функція для видалення (для emit)
function deleteTrainer(trainerId) {
  deleteTrainerHandler(trainerId)
}
</script>
