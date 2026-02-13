<template>
  <Transition name="slide-fade">
    <div 
      v-if="visible"
      :class="[
        'fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md rounded-xl shadow-2xl p-4 flex items-start gap-3 border-2 transition-all duration-300',
        notificationClasses
      ]"
      role="status"
      aria-live="polite"
    >
      <!-- Іконка -->
      <div :class="iconClasses">
        <span class="text-lg">{{ icon }}</span>
      </div>
      
      <!-- Контент -->
      <div class="flex-1">
        <h4 v-if="title" class="font-bold text-lg mb-1 text-yellow-400">{{ title }}</h4>
        <p class="text-sm text-gray-300">{{ message }}</p>
      </div>
      
      <!-- Кнопка закриття -->
      <button 
        @click="close"
        class="flex-shrink-0 text-2xl opacity-70 hover:opacity-100 transition-opacity text-yellow-400"
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
    success: 'bg-slate-950 border-yellow-400 text-white',
    warning: 'bg-slate-950 border-yellow-400 text-yellow-400',
    error: 'bg-slate-950 border-red-500 text-red-400'
  }
  return classes[props.type] || classes.success
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

const iconClasses = computed(() => {
  const base = 'flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center'
  if (props.type === 'success') return base + ' bg-yellow-400 text-slate-900'
  if (props.type === 'warning') return base + ' bg-yellow-400 text-slate-900'
  if (props.type === 'error') return base + ' bg-red-500 text-white'
  return base + ' bg-yellow-400 text-slate-900'
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
