<template>
  <div class="relative w-full">
    <input
      :value="displayValue"
      @click="showDropdown = true"
      @focus="showDropdown = true"
      @blur="hideDropdown"
      :placeholder="placeholder"
      :class="[
        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer placeholder-gray-400 text-gray-900',
        hasError ? 'border-red-500' : 'border-gray-300'
      ]"
      autocomplete="off"
      readonly
    />
    <button type="button" @mousedown.prevent="showDropdown = true" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
    </button>
    <ul v-if="showDropdown" class="absolute left-0 right-0 z-20 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto mt-1">
      <li v-for="(option, idx) in options" :key="idx"
          @mousedown.prevent="selectOption(option)"
          :class="[
            'px-3 py-2 cursor-pointer transition',
            getValue(option) === modelValue ? 'bg-green-500 text-white font-semibold' : 'hover:bg-gray-100'
          ]">
        {{ getLabel(option) }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: String,
  options: Array, // Can be ['option1', 'option2'] or [{value: 'val', label: 'Label'}]
  placeholder: String,
  hasError: {
    type: Boolean,
    default: false
  }
})

// Визначаємо чи options - це прості строки чи об'єкти
const isObjectOptions = computed(() => {
  return props.options.length > 0 && typeof props.options[0] === 'object'
})

// Отримати label для відображення
const getLabel = (option) => {
  if (typeof option === 'string') return option
  return option.label || option.value
}

// Отримати value
const getValue = (option) => {
  if (typeof option === 'string') return option
  return option.value
}

// Знайти поточний label для modelValue
const displayValue = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null) return ''
  if (!isObjectOptions.value) return props.modelValue
  const found = props.options.find(opt => opt.value === props.modelValue)
  return found ? found.label : props.modelValue
})

const showDropdown = ref(false)
function hideDropdown() {
  setTimeout(() => { showDropdown.value = false }, 150)
}

function selectOption(option) {
  const value = getValue(option)
  emit('update:modelValue', value)
  showDropdown.value = false
}

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border: none;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  background: #fff;
  transition: box-shadow 0.2s;
}
li {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}
li:last-child {
  border-bottom: none;
}
li:hover {
  background: #e0f2fe;
}
input {
  border: 1px solid #d1d5db;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #60a5fa33;
}
button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}
button:focus {
  outline: none;
  color: #2563eb;
}
</style>
