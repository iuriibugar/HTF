<template>
  <ItemsManager
    title="💰 Управління донатами"
    list-title="📋 Список донатів"
    form-create-title="➕ Новий донат"
    form-edit-title="✏️ Редагування донату"
    empty-message="Донатів ще немає"
    :items="donations"
    :loading="loading"
    :saving="saving"
    :editing-id="editingId"
    @edit="editDonation"
    @delete="deleteDonationHandler"
    @save="saveDonation"
    @cancel="cancelEdit">
    
    <!-- Slot для форми -->
    <template #form>
      <!-- Завантаження зображення -->
      <div class="border-2 border-dashed border-white rounded-xl p-6 text-center hover:border-yellow-400 transition bg-gray-700/50">
        <div v-if="imagePreview" class="mb-4">
          <img :src="imagePreview" alt="Preview" class="max-h-64 mx-auto rounded-lg shadow-md" />
          <button 
            @click="removeImage"
            class="mt-4 px-4 py-2 border-2 border-white text-white rounded-lg transition hover:border-red-400 hover:text-red-400">
            ❌ Видалити зображення
          </button>
        </div>
        <div v-else>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-white mb-2">Завантажте зображення (PNG)</p>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/png"
            @change="handleImageUpload"
            class="hidden" />
          <button 
            @click="$refs.fileInput.click()"
            class="px-6 py-3 border-2 border-white text-white rounded-lg transition">
            📁 Вибрати файл
          </button>
        </div>
      </div>
      
      <!-- Назва -->
      <div>
        <label class="block text-sm font-semibold text-white mb-2">Назва *</label>
        <input 
          v-model="formData.title"
          type="text"
          placeholder="Наприклад: Підтримка ЗСУ"
          :class="['w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-700 text-white',
                   errors.title ? 'border-red-500' : 'border-white']" />
        <p v-if="errors.title" class="text-yellow-400 text-sm mt-1 font-semibold">⚠️ {{ errors.title }}</p>
      </div>
      
      <!-- Опис -->
      <div>
        <label class="block text-sm font-semibold text-white mb-2">Опис *</label>
        <textarea 
          v-model="formData.description"
          rows="4"
          placeholder="Опишіть мету донатів..."
          :class="['w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-700 text-white',
                   errors.description ? 'border-red-500' : 'border-white']"></textarea>
        <p v-if="errors.description" class="text-yellow-400 text-sm mt-1 font-semibold">⚠️ {{ errors.description }}</p>
      </div>
      
      <!-- Посилання -->
      <div>
        <label class="block text-sm font-semibold text-white mb-2">Посилання на донат *</label>
        <input 
          v-model="formData.link"
          type="url"
          placeholder="https://send.monobank.ua/..."
          :class="['w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-700 text-white',
                   errors.link ? 'border-red-500' : 'border-white']" />
        <p v-if="errors.link" class="text-yellow-400 text-sm mt-1 font-semibold">⚠️ {{ errors.link }}</p>
      </div>
    </template>
  </ItemsManager>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ItemsManager from '@/components/ItemsManager.vue'
import { getAllDonations, createDonation, updateDonation, deleteDonation } from '@/services/donationService'
import { showLoader, hideLoader } from '@/stores/loaderStore'

// Props/Emits
const emit = defineEmits(['show-notification'])

// State
const loading = ref(false)
const saving = ref(false)
const imagePreview = ref('')
const imageFile = ref(null)
const donations = ref([])
const editingId = ref(null)
const fileInput = ref(null)

const formData = ref({
  title: '',
  description: '',
  link: ''
})

const errors = ref({
  title: '',
  description: '',
  link: ''
})

// Завантажити всі донати
async function loadDonations() {
  try {
    loading.value = true
    showLoader()
    donations.value = await getAllDonations()
  } catch (error) {
    console.error('Помилка завантаження донатів:', error)
    emit('show-notification', 'error', 'Помилка завантаження даних', 'Помилка')
  } finally {
    loading.value = false
    hideLoader()
  }
}

// Редагувати донат
function editDonation(donation) {
  editingId.value = donation.id
  formData.value.title = donation.title || ''
  formData.value.description = donation.description || ''
  formData.value.link = donation.link || ''
  
  // Завантажити Base64 зображення
  if (donation.imageBase64) {
    imagePreview.value = donation.imageBase64
  } else {
    imagePreview.value = ''
  }
  
  imageFile.value = null
  
  // Прокрутка до форми на мобільних
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Скасувати редагування
function cancelEdit() {
  editingId.value = null
  clearForm()
}

// Видалити донат
async function deleteDonationHandler(donationId) {
  if (!confirm('Ви впевнені, що хочете видалити цей донат?')) return
  
  try {
    showLoader()
    await deleteDonation(donationId)
    
    emit('show-notification', 'success', 'Донат успішно видалено', 'Успіх')
    
    // Оновити список
    await loadDonations()
    
    // Якщо редагували цей донат, скасувати редагування
    if (editingId.value === donationId) {
      cancelEdit()
    }
  } catch (error) {
    console.error('Помилка видалення:', error)
    emit('show-notification', 'error', 'Помилка видалення донату', 'Помилка')
  }
  finally {
    hideLoader()
  }
}

// Обробка завантаження зображення
function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.includes('png')) {
    emit('show-notification', 'warning', 'Будь ласка, завантажте файл формату PNG', 'Невірний формат')
    return
  }
  
  // Перевірка розміру (макс 1MB для Base64)
  if (file.size > 1024 * 1024) {
    emit('show-notification', 'warning', 'Зображення занадто велике. Максимум 1MB', 'Великий розмір')
    return
  }
  
  imageFile.value = file
  
  // Конвертувати в Base64 для попереднього перегляду та збереження
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result // Base64 рядок
  }
  reader.readAsDataURL(file)
}

// Видалити зображення
function removeImage() {
  imagePreview.value = ''
  imageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Валідація
function validate() {
  errors.value = {
    title: '',
    description: '',
    link: ''
  }
  
  let isValid = true
  
  if (!formData.value.title.trim()) {
    errors.value.title = 'Назва обов\'язкова'
    isValid = false
  }
  
  if (!formData.value.description.trim()) {
    errors.value.description = 'Опис обов\'язковий'
    isValid = false
  }
  
  if (!formData.value.link.trim()) {
    errors.value.link = 'Посилання обов\'язкове'
    isValid = false
  } else if (!formData.value.link.startsWith('http')) {
    errors.value.link = 'Посилання має починатися з http:// або https://'
    isValid = false
  }
  
  return isValid
}

// Зберегти донат
async function saveDonation() {
  if (!validate()) {
    emit('show-notification', 'warning', 'Заповніть всі обов\'язкові поля', 'Помилка валідації')
    return
  }
  
  try {
    saving.value = true
    showLoader()
    
    // Дані для збереження
    const donationData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      link: formData.value.link.trim(),
      imageBase64: imagePreview.value || ''
    }
    
    if (editingId.value) {
      // Оновити існуючий донат
      await updateDonation(editingId.value, donationData)
      emit('show-notification', 'success', 'Донат успішно оновлено', 'Успіх')
    } else {
      // Створити новий донат
      await createDonation(donationData)
      emit('show-notification', 'success', 'Новий донат успішно створено', 'Успіх')
    }
    
    // Перезавантажити список
    await loadDonations()
    
    // Очистити форму
    cancelEdit()
    
  } catch (error) {
    console.error('Помилка збереження:', error)
    emit('show-notification', 'error', error.message || 'Невідома помилка при збереженні', 'Помилка')
  } finally {
    saving.value = false
    hideLoader()
  }
}

// Очистити форму
function clearForm() {
  formData.value = {
    title: '',
    description: '',
    link: ''
  }
  removeImage()
  errors.value = {
    title: '',
    description: '',
    link: ''
  }
}

// Форматування дати
function formatDate(dateStr) {
  if (!dateStr) return 'Невідомо'
  const date = new Date(dateStr)
  return date.toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadDonations()
})
</script>
