<template>
  <div class="relative w-full">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="showDropdown = true"
      @blur="hideDropdown"
      :placeholder="placeholder"
      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      autocomplete="off"
    />
    <button type="button" @mousedown.prevent="showDropdown = true" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
    </button>
    <ul v-if="showDropdown" class="absolute left-0 right-0 z-10 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto mt-1">
      <li v-for="option in options" :key="option"
          @mousedown.prevent="$emit('update:modelValue', option); showDropdown = false"
          :class="[
            'px-3 py-2 cursor-pointer transition',
            option === modelValue ? 'bg-blue-600 text-white font-semibold' : '',
            'hover:bg-blue-100'
          ]">
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  modelValue: String,
  options: Array,
  placeholder: String
})
const showDropdown = ref(false)
function hideDropdown() {
  setTimeout(() => { showDropdown.value = false }, 150)
}
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
