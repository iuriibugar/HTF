<template>
  <Transition name="slide-fade">
    <div 
      v-if="visible"
      :class="[
        'fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md rounded-lg shadow-2xl p-4 flex items-start gap-3',
        'transition-all duration-300',
        notificationClasses
      ]"
    >
      <!-- Іконка -->
      <div class="flex-shrink-0 text-2xl">
        {{ icon }}
      </div>
      
      <!-- Контент -->
      <div class="flex-1">
        <h4 v-if="title" class="font-bold text-lg mb-1">{{ title }}</h4>
        <p class="text-sm">{{ message }}</p>
      </div>
      
      <!-- Кнопка закриття -->
      <button 
        @click="close"
        class="flex-shrink-0 text-2xl opacity-60 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'warning', 'error'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const visible = ref(props.show)
let timeoutId = null

// Класи для різних типів нотифікацій
const notificationClasses = computed(() => {
  const classes = {
    success: 'bg-green-50 border-l-4 border-green-500 text-green-800',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
    error: 'bg-red-50 border-l-4 border-red-500 text-red-800'
  }
  return classes[props.type]
})

// Іконки для різних типів
const icon = computed(() => {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }
  return icons[props.type]
})

// Закрити нотифікацію
const close = () => {
  visible.value = false
  emit('close')
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}

// Відстежувати зміни prop show
watch(() => props.show, (newValue) => {
  visible.value = newValue
  
  if (newValue && props.duration > 0) {
    // Автоматично закрити через певний час
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

// Якщо show=true при створенні, запустити таймер
if (props.show && props.duration > 0) {
  timeoutId = setTimeout(() => {
    close()
  }, props.duration)
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
