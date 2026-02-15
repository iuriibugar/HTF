<template>
  <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-2 sm:p-4">
    <h1 class="text-3xl font-bold mb-6 text-yellow-400">{{ title }}</h1>
    
    <!-- Завантаження -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
      <p class="text-white">Завантаження...</p>
    </div>
    
    <!-- Горизонтальне розташування: Список + Форма -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- ЛІВА ЧАСТИНА: Список елементів -->
      <div class="space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-yellow-400">{{ listTitle }}</h2>
          <span class="text-sm text-white">Всього: {{ items.length }}</span>
        </div>
        
        <!-- Немає елементів -->
        <div v-if="items.length === 0" class="text-center py-12 bg-gray-700/50 rounded-lg border-2 border-dashed border-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-white">{{ emptyMessage }}</p>
          <p class="text-gray-300 text-sm">Додайте перший елемент через форму →</p>
        </div>
        
        <!-- Картки елементів -->
        <div v-else class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          <div 
            v-for="item in items" 
            :key="item.id"
            class="bg-gray-700/50 border-2 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
            :class="editingId === item.id ? 'border-yellow-400 shadow-lg' : 'border-white'"
            @click="$emit('edit', item)">
            
            <!-- Slot для кастомного відображення картки -->
            <slot name="item-card" :item="item">
              <!-- Дефолтне відображення -->
              <div v-if="item.imageUrl || item.imageBase64" class="mb-3 h-42 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                <img :src="item.imageUrl || item.imageBase64" alt="Item" class="max-w-full max-h-full object-contain rounded-lg" />
              </div>
              <div v-else class="mb-3 h-32 bg-gray-600 rounded-lg flex items-center justify-center">
                <span class="text-gray-400">Без зображення</span>
              </div>
              
              <h3 class="font-bold text-lg mb-2 text-yellow-400">{{ item.title }}</h3>
              <p class="text-sm text-white mb-2 line-clamp-2">{{ item.description }}</p>
              <a v-if="item.link" :href="item.link" target="_blank" class="text-xs text-yellow-400 hover:underline block mb-3 truncate">
                🔗 {{ item.link }}
              </a>
            </slot>
            
            <!-- Кнопки дій -->
            <div class="flex gap-2 mt-3">
              <button 
                @click.stop="$emit('edit', item)"
                class="flex-1 px-3 py-2 border-2 border-white text-white text-sm rounded transition hover:border-yellow-400 hover:text-yellow-400">
                ✏️ Редагувати
              </button>
              <button 
                @click.stop="$emit('delete', item.id)"
                class="px-3 py-2 border-2 border-white text-white text-sm rounded transition hover:border-red-400 hover:text-red-400">
                🗑️
              </button>
            </div>
            
            <p class="text-xs text-gray-400 mt-2">Оновлено: {{ formatDate(item.updatedAt) }}</p>
          </div>
        </div>
      </div>
      
      <!-- ПРАВА ЧАСТИНА: Форма -->
      <div class="space-y-6 lg:sticky lg:top-4 lg:self-start">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-yellow-400">
            {{ editingId ? formEditTitle : formCreateTitle }}
          </h2>
          <button 
            v-if="editingId"
            @click="$emit('cancel')"
            class="text-sm text-white hover:text-yellow-400 transition">
            ❌ Скасувати
          </button>
        </div>
        
        <!-- Slot для кастомної форми -->
        <slot name="form"></slot>
        
        <!-- Кнопки форми -->
        <div class="flex gap-4">
          <button 
            @click="$emit('save')"
            :disabled="saving"
            class="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed border-2 border-yellow-400">
            <span v-if="saving">⏳ Збереження...</span>
            <span v-else>{{ editingId ? '🔄 Оновити' : '✨ Створити' }}</span>
          </button>
          
          <button 
            v-if="editingId"
            @click="$emit('cancel')"
            class="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg transition hover:border-gray-400 hover:text-gray-400">
            ❌ Скасувати
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  title: {
    type: String,
    default: '📋 Управління елементами'
  },
  listTitle: {
    type: String,
    default: '📋 Список елементів'
  },
  formCreateTitle: {
    type: String,
    default: '➕ Новий елемент'
  },
  formEditTitle: {
    type: String,
    default: '✏️ Редагування елемента'
  },
  emptyMessage: {
    type: String,
    default: 'Елементів ще немає'
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  editingId: {
    type: String,
    default: null
  }
})

// Emits
defineEmits(['edit', 'delete', 'save', 'cancel'])

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
</script>
