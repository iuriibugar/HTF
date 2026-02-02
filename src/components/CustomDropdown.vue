<template>
  <div class="relative w-full">
    <input
      :value="allowCustom ? inputValue : displayValue"
      @input="handleInput"
      @click="handleFocus"
      @focus="handleFocus"
      @blur="hideDropdown"
      :placeholder="placeholder"
      :class="[
        'w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 appearance-none cursor-pointer placeholder-gray-400 transition',
        hasError ? 'border-red-500' : modelValue ? 'border-yellow-400 bg-yellow-400 text-black font-semibold' : 'border-white text-white bg-gray-700 hover:border-yellow-400'
      ]"
      autocomplete="off"
      :readonly="!allowCustom"
    />
    <button type="button" @mousedown.prevent="showDropdown = true" class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition" :class="modelValue ? 'text-black' : 'text-white hover:text-yellow-400'">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
    </button>
    <ul v-if="showDropdown" class="absolute left-0 right-0 z-20 border-2 border-white rounded-lg shadow-lg max-h-48 overflow-auto mt-1 bg-gray-800">
      <li v-for="(option, idx) in filteredOptions" :key="idx"
          @mousedown.prevent="selectOption(option)"
          :class="[
            'px-3 py-2 cursor-pointer transition border-b border-gray-700 text-white hover:bg-yellow-400 hover:text-black',
            getValue(option) === modelValue ? 'bg-yellow-400 text-black font-semibold' : ''
          ]">
        {{ getLabel(option) }}
      </li>
      <li v-if="allowCustom && filteredOptions.length === 0" class="px-3 py-2 text-gray-400 text-sm">
        Введіть власне значення
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  options: Array, // Can be ['option1', 'option2'] or [{value: 'val', label: 'Label'}]
  placeholder: String,
  hasError: {
    type: Boolean,
    default: false
  },
  allowCustom: {
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

const inputValue = ref(displayValue.value)

// Фільтровані опції при введенні
const filteredOptions = computed(() => {
  if (!props.allowCustom) return props.options
  // Якщо inputValue співпадає з displayValue (не змінено), показуємо всі опції
  if (inputValue.value === displayValue.value) return props.options
  // Якщо порожнє, показуємо всі
  if (!inputValue.value) return props.options
  // Інакше фільтруємо
  const search = inputValue.value.toLowerCase()
  return props.options.filter(opt => {
    const label = getLabel(opt).toLowerCase()
    return label.includes(search)
  })
})

// Оновлюємо inputValue коли змінюється modelValue ззовні
watch(() => props.modelValue, () => {
  inputValue.value = displayValue.value
})

function handleFocus() {
  showDropdown.value = true
}

function handleInput(event) {
  if (!props.allowCustom) return
  inputValue.value = event.target.value
  showDropdown.value = false
  // Якщо дозволено кастомний ввід, оновлюємо modelValue при введенні
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border: none;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  border-radius: 0.75rem;
  background: #1f2937;
  transition: box-shadow 0.2s;
}
li {
  border-bottom: 1px solid #374151;
  transition: background 0.15s;
}
li:last-child {
  border-bottom: none;
}
input {
  border: 2px solid #d1d5db;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
}
input:focus {
  border-color: #facc15;
  box-shadow: 0 0 0 2px #fef08a33;
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
  color: #facc15;
}
</style>
