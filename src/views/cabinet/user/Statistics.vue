<template>
  <div class="max-w-4xl mx-auto">
    <!-- Заголовок -->
    <div class="bg-yellow-600/20 border-2 border-yellow-400 rounded-lg p-6 mb-6">
      <h1 class="text-3xl font-bold text-yellow-300 mb-2">📊 Статистика</h1>
      <p class="text-yellow-100">
        Переглядайте вашу статистику участі у тренуваннях по видам спорту
      </p>
    </div>

    <!-- Статистика відвідувань -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Плавання -->
      <div class="bg-blue-900/40 border-2 border-blue-400 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-3">
          <img src="@/assets/trainingIcons/icon-swimming.png" alt="Плавання" class="w-8 h-8" />
          <h3 class="text-lg font-bold text-blue-300">Плавання</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">Кількість реєстрацій:</span>
            <span class="text-blue-300 font-bold">{{ stats.swimming.registered }}</span>
          </div>
        </div>
      </div>

      <!-- Велоспорт -->
      <div class="bg-green-900/40 border-2 border-green-400 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-3">
          <img src="@/assets/trainingIcons/icon-cycling.png" alt="Велоспорт" class="w-8 h-8" />
          <h3 class="text-lg font-bold text-green-300">Велоспорт</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">Кількість реєстрацій:</span>
            <span class="text-green-300 font-bold">{{ stats.cycling.registered }}</span>
          </div>
        </div>
      </div>

      <!-- Бігу -->
      <div class="bg-red-900/40 border-2 border-red-400 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-3">
          <img src="@/assets/trainingIcons/icon-running.png" alt="Біг" class="w-8 h-8" />
          <h3 class="text-lg font-bold text-red-300">Біг</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">Кількість реєстрацій:</span>
            <span class="text-red-300 font-bold">{{ stats.running.registered }}</span>
          </div>
        </div>
      </div>

      <!-- Інші -->
      <div class="bg-purple-900/40 border-2 border-purple-400 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-3">
          <img src="@/assets/trainingIcons/icon-other.png" alt="Інше" class="w-8 h-8" />
          <h3 class="text-lg font-bold text-purple-300">Інше</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">Кількість реєстрацій:</span>
            <span class="text-purple-300 font-bold">{{ stats.other.registered }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Стан рахунку -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- Баланс -->
      <div class="bg-green-900/40 border-2 border-green-400 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm mb-2">💰 Стан Вашого Рахунку</p>
            <p class="text-5xl font-bold text-green-400">{{ userAmount }}</p>
            <p class="text-xs text-gray-400 mt-2">htfCoin</p>
          </div>
          <div class="text-6xl">💸</div>
        </div>
      </div>

      <!-- Знижка (якщо є) -->
      <div v-if="userDiscount" class="bg-orange-900/40 border-2 border-orange-400 rounded-lg p-6">
        <div class="flex items-center justify-between h-full">
          <div>
            <p class="text-gray-300 text-sm mb-2">🏷️ Ваша Знижка</p>
            <p class="text-5xl font-bold text-orange-400">{{ userDiscount }}%</p>
            <p class="text-xs text-gray-400 mt-2">Активна знижка</p>
          </div>
          <div class="text-6xl">🎁</div>
        </div>
      </div>
    </div>

    <!-- Транзакції -->
    <div class="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-600 mb-6">
      <h2 class="text-2xl font-bold text-yellow-400 mb-6">💳 Транзакції</h2>
      
      <div class="space-y-3">
        <div class="bg-gray-700/30 rounded-lg p-4 border-l-4 border-gray-500">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-gray-300 font-semibold">Немає транзакцій</p>
              <p class="text-xs text-gray-400 mt-1">Ваша історія платежів і операцій з'явиться тут</p>
            </div>
            <span class="text-3xl">📋</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  trainingStats: {
    type: Object,
    default: () => ({
      swimming: { registered: 0 },
      cycling: { registered: 0 },
      running: { registered: 0 },
      other: { registered: 0 }
    })
  },
  userAmount: {
    type: Number,
    default: 0
  },
  userDiscount: {
    type: [Number, null],
    default: null
  }
})

const stats = computed(() => props.trainingStats)
</script>
