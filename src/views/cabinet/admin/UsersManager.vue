<template>
  <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 overflow-auto h-full">
    <!-- Заголовок -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-yellow-400 mb-2">👥 Управління користувачами</h2>
      <p class="text-gray-300">Тут ви можете переглядати, одобрювати та керувати користувачами</p>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
      <div class="bg-gray-700/50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-yellow-400">{{ stats.total }}</div>
        <div class="text-xs text-gray-400">Всього користувачів</div>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-green-400">{{ stats.approved }}</div>
        <div class="text-xs text-gray-400">Одобрено</div>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-orange-400">{{ stats.pending }}</div>
        <div class="text-xs text-gray-400">Очікує</div>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-blue-400">{{ stats.admins }}</div>
        <div class="text-xs text-gray-400">Адмінів</div>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-green-500">{{ stats.active }}</div>
        <div class="text-xs text-gray-400">Активних</div>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-red-400">{{ stats.blocked }}</div>
        <div class="text-xs text-gray-400">Заблокованих</div>
      </div>
    </div>

    <!-- Фільтри і пошук -->
    <div class="mb-6 flex gap-2 flex-wrap">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Пошук по email або імені..."
        class="flex-1 min-w-48 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
      />
      <select 
        v-model="filterStatus"
        class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
      >
        <option value="">Всі статуси</option>
        <option value="pending">Очікує</option>
        <option value="approved">Одобрено</option>
        <option value="blocked">Заблоковано</option>
      </select>
    </div>

    <!-- Таблиця користувачів -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-600 text-yellow-400">
            <th class="text-left py-3 px-2">Email</th>
            <th class="text-left py-3 px-2">Ім'я</th>
            <th class="text-left py-3 px-2">Статус</th>
            <th class="text-left py-3 px-2">Роль</th>
            <th class="text-left py-3 px-2">💰 Баланс</th>
            <th class="text-left py-3 px-2">🏷️ Знижка</th>
            <th class="text-left py-3 px-2">Тренування</th>
            <th class="text-left py-3 px-2">Реєстрація</th>
            <th class="text-left py-3 px-2">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in filteredUsers" 
            :key="user.id"
            class="border-b border-gray-700 hover:bg-gray-700/30 transition"
          >
            <td class="py-3 px-2 text-gray-300">{{ user.email }}</td>
            <td class="py-3 px-2 text-gray-300">{{ user.displayName || '-' }}</td>
            <td class="py-3 px-2">
              <span 
                :class="getStatusBadge(user.isApproved, user.status)"
              >
                {{ getStatusText(user.isApproved, user.status) }}
              </span>
            </td>
            <td class="py-3 px-2">
              <span 
                :class="user.role === 'admin' ? 'text-blue-400' : 'text-gray-400'"
              >
                {{ user.role === 'admin' ? '👑 Адмін' : 'Користувач' }}
              </span>
            </td>
            <td class="py-3 px-2">
              <button 
                @click="showBalanceModal(user)"
                class="px-3 py-1 bg-green-600/50 hover:bg-green-600 text-green-300 rounded text-sm transition font-semibold"
              >
                💰 {{ user.amount || 0 }}
              </button>
            </td>
            <td class="py-3 px-2">
              <button 
                @click="showDiscountModal(user)"
                class="px-3 py-1 bg-orange-600/50 hover:bg-orange-600 text-orange-300 rounded text-sm transition font-semibold"
              >
                🏷️ {{ user.discount?.percent || 0 }}%
              </button>
            </td>
            <td class="py-3 px-2">
              <button 
                @click="showTrainingStats(user)"
                class="px-3 py-1 bg-gray-600 hover:bg-yellow-500 hover:text-black text-white rounded text-xs transition font-bold"
              >
                ✓ {{ getTotalRegistered(user) }}
              </button>
            </td>
            <td class="py-3 px-2 text-gray-400 text-xs">{{ formatDate(user.registeredAt) }}</td>
            <td class="py-3 px-2">
              <div class="flex gap-2">
                <button 
                  v-if="!user.isApproved"
                  @click="approveUserHandler(user.id)"
                  class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition"
                  title="Одобрити"
                >
                  ✓
                </button>
                <button 
                  v-if="user.isApproved && user.status !== 'blocked'"
                  @click="blockUser(user.id)"
                  class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
                  title="Заблокувати"
                >
                  🚫
                </button>
                <button 
                  v-if="user.status === 'blocked'"
                  @click="unblockUser(user.id)"
                  class="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs transition"
                  title="Розблокувати"
                >
                  🔓
                </button>
                <button 
                  v-if="user.role === 'user'"
                  @click="makeAdmin(user.id)"
                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition"
                  title="Зробити адміном"
                >
                  👑
                </button>
                <button
                  v-if="user.role === 'admin'"
                  @click="removeAdminRole(user.id)"
                  class="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-black rounded text-xs transition"
                  title="Зняти права адміна"
                >
                  🙅‍♂️
                </button>
                <button 
                  @click="showUserDetails(user)"
                  class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition"
                  title="Деталі"
                >
                  📋
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0" class="border-b border-gray-700">
            <td colspan="6" class="py-4 text-center text-gray-400">
              Користувачів не знайдено
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальне вікно редагування балансу -->
    <div 
      v-if="balanceModal.show && balanceModal.user"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="balanceModal.show = false"
    >
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-yellow-400">💰 Редагування балансу</h3>
          <button 
            @click="balanceModal.show = false"
            class="text-2xl text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <p class="text-gray-300 mb-2">{{ balanceModal.user.email }}</p>
            <p class="text-gray-400 text-sm">Поточний баланс: <span class="text-green-400 font-bold">{{ balanceModal.user.amount || 0 }} 🪙</span></p>
          </div>

          <div class="border-t border-gray-700 pt-4">
            <label class="text-gray-300 block mb-2 font-semibold">Нова сума</label>
            <input 
              v-model.number="balanceModal.newAmount"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              placeholder="Введіть суму..."
            />
          </div>

          <div class="bg-gray-700/30 rounded p-3 border border-gray-600">
            <div class="text-xs text-gray-400 mb-2">Швидкі дії:</div>
            <div class="space-y-2">
              <button 
                @click="addToBalance(50)"
                class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition font-semibold"
              >
                + 50 🪙
              </button>
              <button 
                @click="addToBalance(100)"
                class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition font-semibold"
              >
                + 100 🪙
              </button>
              <button 
                @click="addToBalance(500)"
                class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition font-semibold"
              >
                + 500 🪙
              </button>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              @click="balanceModal.show = false"
              class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition"
            >
              Закрити
            </button>
            <button 
              @click="showBalanceConfirmation"
              class="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded transition"
            >
              Зберегти
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальне вікно підтвердження зміни балансу -->
    <div 
      v-if="confirmBalanceModal.show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="confirmBalanceModal.show = false"
    >
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-yellow-400">⚠️ Підтвердження зміни</h3>
          <button 
            @click="confirmBalanceModal.show = false"
            class="text-2xl text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-700/30 rounded p-4 border border-gray-600">
            <div class="mb-4">
              <p class="text-gray-400 text-sm mb-2">Поточний баланс:</p>
              <p class="text-green-400 font-bold text-lg">{{ confirmBalanceModal.oldAmount }} 🪙</p>
            </div>

            <div class="flex justify-center items-center my-4">
              <div class="text-yellow-400 text-2xl">→</div>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-2">Новий баланс:</p>
              <p class="text-yellow-300 font-bold text-lg">{{ confirmBalanceModal.newAmount }} 🪙</p>
            </div>


          </div>

          <p class="text-gray-300 text-sm text-center">
            Ви впевнені що хочете застосувати ці зміни?
          </p>

          <div class="flex gap-3 pt-4">
            <button 
              @click="confirmBalanceModal.show = false"
              class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition"
            >
              Скасувати
            </button>
            <button 
              @click="confirmSaveBalance"
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
            >
              Підтвердити
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальне вікно редагування знижки -->
    <div 
      v-if="discountModal.show && discountModal.user"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="discountModal.show = false"
    >
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-orange-400">🏷️ Редагування знижки</h3>
          <button 
            @click="discountModal.show = false"
            class="text-2xl text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <p class="text-gray-300 mb-2">{{ discountModal.user.email }}</p>
            <p class="text-gray-400 text-sm">Поточна знижка: <span class="text-orange-400 font-bold">{{ discountModal.user.discount?.percent || 0 }}%</span></p>
          </div>

          <div class="border-t border-gray-700 pt-4">
            <label class="text-gray-300 block mb-2 font-semibold">Нова знижка (%)</label>
            <input 
              v-model.number="discountModal.discountPercent"
              type="number"
              min="0"
              max="100"
              step="0.1"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              placeholder="Введіть відсоток знижки (0-100)..."
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              @click="discountModal.show = false"
              class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition"
            >
              Закрити
            </button>
            <button 
              @click="saveDiscount"
              class="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded transition"
            >
              Зберегти
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальне вікно деталей -->
    <div 
      v-if="selectedUser"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="selectedUser = null"
    >
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-yellow-400">Деталі користувача</h3>
          <button 
            @click="selectedUser = null"
            class="text-2xl text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div class="space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-400">Email:</span>
              <div class="text-white font-semibold">{{ selectedUser.email }}</div>
            </div>
            <div>
              <span class="text-gray-400">Ім'я:</span>
              <div class="text-white font-semibold">{{ selectedUser.displayName || '-' }}</div>
            </div>
            <div>
              <span class="text-gray-400">Статус:</span>
              <div class="text-white font-semibold">{{ getStatusText(selectedUser.isApproved, selectedUser.status) }}</div>
            </div>
            <div>
              <span class="text-gray-400">Роль:</span>
              <div class="text-white font-semibold">{{ selectedUser.role === 'admin' ? 'Адміністратор' : 'Користувач' }}</div>
            </div>
            <div>
              <span class="text-gray-400">Рівень досвіду:</span>
              <div class="text-white font-semibold">{{ selectedUser.experienceLevel || '-' }}</div>
            </div>
            <div>
              <span class="text-gray-400">Спеціалізація:</span>
              <div class="text-white font-semibold">{{ selectedUser.specialization || '-' }}</div>
            </div>
            <div>
              <span class="text-gray-400">Дата реєстрації:</span>
              <div class="text-white font-semibold">{{ formatDate(selectedUser.registeredAt) }}</div>
            </div>
            <div>
              <span class="text-gray-400">Останній вхід:</span>
              <div class="text-white font-semibold">{{ formatDate(selectedUser.lastLoginAt) }}</div>
            </div>
            <div>
              <span class="text-gray-400">Входів:</span>
              <div class="text-white font-semibold">{{ selectedUser.loginCount }}</div>
            </div>
            <div>
              <span class="text-gray-400">Баланс:</span>
              <div class="text-green-400 font-semibold">{{ selectedUser.amount || 0 }} 🪙</div>
            </div>
            <div v-if="selectedUser.discount?.percent">
              <span class="text-gray-400">Знижка:</span>
              <div class="text-orange-400 font-semibold">{{ selectedUser.discount.percent }}%</div>
            </div>
          </div>

          <!-- Статистика тренувань -->
          <div class="mt-4 pt-4 border-t border-gray-700">
            <span class="text-gray-400 block font-bold mb-3">📊 Статистика тренувань:</span>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-700/30 rounded p-3">
                <img src="@/assets/trainingIcons/icon-swimming.png" alt="Плавання" class="w-6 h-6 inline mr-1" /> Плавання
                <div class="flex justify-between text-xs">
                  <span class="text-gray-400">Реєстрацій:</span>
                  <span class="text-white font-bold">{{ selectedUser.trainingStats?.swimming?.registered || 0 }}</span>
                </div>
                <div class="flex justify-between text-xs mt-1">
                  <span class="text-gray-400">Завершено:</span>
                  <span class="text-green-400 font-bold">{{ selectedUser.trainingStats?.swimming?.completed || 0 }}</span>
                </div>
              </div>
              
              <div class="bg-gray-700/30 rounded p-3">
                <img src="@/assets/trainingIcons/icon-cycling.png" alt="Велоспорт" class="w-6 h-6 inline mr-1" /> Вело
                <div class="flex justify-between text-xs">
                  <span class="text-gray-400">Реєстрацій:</span>
                  <span class="text-white font-bold">{{ selectedUser.trainingStats?.cycling?.registered || 0 }}</span>
                </div>
                <div class="flex justify-between text-xs mt-1">
                  <span class="text-gray-400">Завершено:</span>
                  <span class="text-green-400 font-bold">{{ selectedUser.trainingStats?.cycling?.completed || 0 }}</span>
                </div>
              </div>
              
              <div class="bg-gray-700/30 rounded p-3">
                <div class="text-center text-sm font-semibold text-red-400 mb-2"><img src="@/assets/trainingIcons/icon-running.png" alt="Біг" class="w-6 h-6 inline mr-1" /> Біг</div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-400">Реєстрацій:</span>
                  <span class="text-white font-bold">{{ selectedUser.trainingStats?.running?.registered || 0 }}</span>
                </div>
                <div class="flex justify-between text-xs mt-1">
                  <span class="text-gray-400">Завершено:</span>
                  <span class="text-green-400 font-bold">{{ selectedUser.trainingStats?.running?.completed || 0 }}</span>
                </div>
              </div>
              
              <div class="bg-gray-700/30 rounded p-3">
                <img src="@/assets/trainingIcons/icon-other.png" alt="Інше" class="w-6 h-6 inline mr-1" /> Інше
                <div class="flex justify-between text-xs">
                  <span class="text-gray-400">Реєстрацій:</span>
                  <span class="text-white font-bold">{{ selectedUser.trainingStats?.other?.registered || 0 }}</span>
                </div>
                <div class="flex justify-between text-xs mt-1">
                  <span class="text-gray-400">Завершено:</span>
                  <span class="text-green-400 font-bold">{{ selectedUser.trainingStats?.other?.completed || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedUser.notes" class="mt-4 pt-4 border-t border-gray-700">
            <span class="text-gray-400">Коментарі адміна:</span>
            <div class="text-white mt-2 p-3 bg-gray-700 rounded">{{ selectedUser.notes }}</div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-700">
            <label class="text-gray-400 block mb-2">Додати коментар:</label>
            <textarea 
              v-model="adminNote"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              placeholder="Ваш коментар..."
              rows="3"
            ></textarea>
            <button 
              @click="saveNote"
              class="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded transition"
            >
              Зберегти коментар
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальне вікно деталей тренувань -->
    <div 
      v-if="trainingStatsModal.show && trainingStatsModal.user"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="trainingStatsModal.show = false"
    >
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-yellow-400">📊 {{ trainingStatsModal.user.displayName || trainingStatsModal.user.email }}</h3>
          <button 
            @click="trainingStatsModal.show = false"
            class="text-2xl text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- Плавання -->
          <div class="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-lg p-4 border border-blue-600">
            <div class="text-center text-sm font-bold text-blue-300 mb-3"><img src="@/assets/trainingIcons/icon-swimming.png" alt="Плавання" class="w-6 h-6 inline mr-1" /> Плавання</div>
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-300">Реєстрацій:</span>
                <span class="bg-blue-600/50 px-2 py-1 rounded text-white font-bold">{{ trainingStatsModal.user.trainingStats?.swimming?.registered || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Вело -->
          <div class="bg-gradient-to-br from-orange-900/50 to-orange-800/30 rounded-lg p-4 border border-orange-600">
            <div class="text-center text-sm font-bold text-orange-300 mb-3"><img src="@/assets/trainingIcons/icon-cycling.png" alt="Велоспорт" class="w-6 h-6 inline mr-1" /> Вело</div>
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-300">Реєстрацій:</span>
                <span class="bg-orange-600/50 px-2 py-1 rounded text-white font-bold">{{ trainingStatsModal.user.trainingStats?.cycling?.registered || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Біг -->
          <div class="bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-lg p-4 border border-red-600">
            <div class="text-center text-sm font-bold text-red-300 mb-3"><img src="@/assets/trainingIcons/icon-running.png" alt="Біг" class="w-6 h-6 inline mr-1" /> Біг</div>
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-300">Реєстрацій:</span>
                <span class="bg-red-600/50 px-2 py-1 rounded text-white font-bold">{{ trainingStatsModal.user.trainingStats?.running?.registered || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Інше -->
          <div class="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-lg p-4 border border-purple-600">
            <div class="text-center text-sm font-bold text-purple-300 mb-3"><img src="@/assets/trainingIcons/icon-other.png" alt="Інше" class="w-6 h-6 inline mr-1" /> Інше</div>
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-300">Реєстрацій:</span>
                <span class="bg-purple-600/50 px-2 py-1 rounded text-white font-bold">{{ trainingStatsModal.user.trainingStats?.other?.registered || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Загалом -->
        <div class="mt-4 pt-4 border-t border-gray-700">
          <div class="bg-yellow-600/20 rounded-lg p-3 border border-yellow-600/50">
            <div class="flex justify-between items-center">
              <span class="text-gray-300 font-bold">Всього реєстрацій:</span>
              <span class="text-yellow-300 font-bold text-lg">{{ getTotalRegistered(trainingStatsModal.user) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Нотифікація -->
    <Notification
      :show="notification.show"
      :type="notification.type"
      :message="notification.message"
      @close="notification.show = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { db } from '@/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import Notification from '@/components/Notification.vue'
import { 
  getAllUsers, 
  getUsersStatistics, 
  approveUser as approveUserService,
  changeUserStatus,
  changeUserRole,
  addAdminNotes,
  updateUserBalance
} from '@/services/userService'

const users = ref([])
const stats = ref({
  total: 0,
  approved: 0,
  pending: 0,
  admins: 0,
  active: 0,
  blocked: 0
})
const currentAdminUid = ref('')
const searchQuery = ref('')
const filterStatus = ref('')
const selectedUser = ref(null)
const adminNote = ref('')
const trainingStatsModal = ref({
  show: false,
  user: null
})
const balanceModal = ref({
  show: false,
  user: null,
  newAmount: 0,
  previousAmount: 0
})
const confirmBalanceModal = ref({
  show: false,
  oldAmount: 0,
  newAmount: 0
})
const discountModal = ref({
  show: false,
  user: null,
  discountPercent: 0
})

const notification = ref({
  show: false,
  type: 'success',
  message: ''
})

// Фільтровані користувачі
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const searchMatch = searchQuery.value === '' || 
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (user.displayName && user.displayName.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    let statusMatch = true
    if (filterStatus.value === 'pending') {
      statusMatch = !user.isApproved
    } else if (filterStatus.value === 'approved') {
      statusMatch = user.isApproved && user.status === 'active'
    } else if (filterStatus.value === 'blocked') {
      statusMatch = user.status === 'blocked'
    }
    
    return searchMatch && statusMatch
  })
})

function getStatusBadge(isApproved, status) {
  if (status === 'blocked') {
    return 'inline-block px-2 py-1 bg-red-600/50 text-red-300 rounded text-xs font-semibold'
  }
  if (!isApproved) {
    return 'inline-block px-2 py-1 bg-orange-600/50 text-orange-300 rounded text-xs font-semibold'
  }
  return 'inline-block px-2 py-1 bg-green-600/50 text-green-300 rounded text-xs font-semibold'
}

function getStatusText(isApproved, status) {
  if (status === 'blocked') return '🚫 Заблокований'
  if (!isApproved) return '⏳ Очікує'
  return '✓ Одобрено'
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA')
}

function showUserDetails(user) {
  selectedUser.value = user
  adminNote.value = user.notes || ''
}

function showBalanceModal(user) {
  balanceModal.value.user = user
  balanceModal.value.newAmount = user.amount || 0
  balanceModal.value.previousAmount = user.amount || 0
  balanceModal.value.show = true
}

function addToBalance(sum) {
  balanceModal.value.newAmount = (balanceModal.value.newAmount || 0) + sum
}

function showBalanceConfirmation() {
  if (!balanceModal.value.user || balanceModal.value.newAmount < 0) {
    showNotification('error', 'Невірна сума')
    return
  }

  confirmBalanceModal.value = {
    show: true,
    oldAmount: balanceModal.value.previousAmount,
    newAmount: balanceModal.value.newAmount
  }
}

async function confirmSaveBalance() {
  try {
    const amount = balanceModal.value.newAmount

    await updateUserBalance(
      balanceModal.value.user.id,
      amount,
      currentAdminUid.value
    )

    // Оновлюємо локально
    const userIndex = users.value.findIndex(u => u.id === balanceModal.value.user.id)
    if (userIndex !== -1) {
      users.value[userIndex].amount = amount
    }

    showNotification('success', `Баланс оновлений на ${amount} 🪙`)
    confirmBalanceModal.value.show = false
    balanceModal.value.show = false
    await loadUsers()
  } catch (error) {
    console.error('Помилка при оновленні балансу:', error)
    showNotification('error', 'Помилка при оновленні балансу')
  }
}

function showTrainingStats(user) {
  trainingStatsModal.value.user = user
  trainingStatsModal.value.show = true
}

function showDiscountModal(user) {
  discountModal.value.user = user
  discountModal.value.discountPercent = user.discount?.percent || 0
  discountModal.value.show = true
}

async function saveDiscount() {
  if (!discountModal.value.user || discountModal.value.discountPercent < 0 || discountModal.value.discountPercent > 100) {
    showNotification('error', 'Невірний відсоток знижки')
    return
  }

  try {
    const discountPercent = discountModal.value.discountPercent

    // Якщо знижка 0, видаляємо об'єкт знижки
    if (discountPercent === 0 || discountPercent === null) {
      const userRef = doc(db, 'users', discountModal.value.user.id)
      await updateDoc(userRef, {
        discount: null,
        updatedAt: new Date().toISOString(),
        updatedBy: currentAdminUid.value
      })
    } else {
      // Оновлюємо знижку
      const userRef = doc(db, 'users', discountModal.value.user.id)
      await updateDoc(userRef, {
        discount: {
          percent: discountPercent,
          appliedAt: new Date().toISOString(),
          appliedBy: currentAdminUid.value,
          previousAmount: discountModal.value.user.amount || 0
        },
        updatedAt: new Date().toISOString(),
        updatedBy: currentAdminUid.value
      })
    }

    // Оновлюємо локально
    const userIndex = users.value.findIndex(u => u.id === discountModal.value.user.id)
    if (userIndex !== -1) {
      if (discountPercent === 0) {
        users.value[userIndex].discount = null
      } else {
        users.value[userIndex].discount = {
          percent: discountPercent,
          appliedAt: new Date().toISOString(),
          appliedBy: currentAdminUid.value,
          previousAmount: users.value[userIndex].amount || 0
        }
      }
    }

    showNotification('success', `Знижка оновлена на ${discountPercent}%`)
    discountModal.value.show = false
    await loadUsers()
  } catch (error) {
    console.error('Помилка при оновленні знижки:', error)
    showNotification('error', 'Помилка при оновленні знижки')
  }
}

function getTotalRegistered(user) {
  if (!user.trainingStats) return 0
  return (user.trainingStats.swimming?.registered || 0) +
         (user.trainingStats.cycling?.registered || 0) +
         (user.trainingStats.running?.registered || 0) +
         (user.trainingStats.other?.registered || 0)
}



async function approveUserHandler(userId) {
  try {
    await approveUserService(userId, true, currentAdminUid.value)
    
    // Оновлюємо локальний список
    const userIndex = users.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex].isApproved = true
    }
    
    showNotification('success', 'Користувач одобрен')
    await loadUsers()
  } catch (error) {
    console.error('Помилка при одобренні:', error)
    showNotification('error', 'Помилка при одобренні користувача')
  }
}

async function blockUser(userId) {
  try {
    await changeUserStatus(userId, 'blocked', currentAdminUid.value)
    showNotification('success', 'Користувач заблокований')
    await loadUsers()
  } catch (error) {
    console.error('Помилка при блокуванні:', error)
    showNotification('error', 'Помилка при блокуванні користувача')
  }
}

async function unblockUser(userId) {
  try {
    await changeUserStatus(userId, 'active', currentAdminUid.value)
    showNotification('success', 'Користувач розблокований')
    await loadUsers()
  } catch (error) {
    console.error('Помилка при розблокуванні:', error)
    showNotification('error', 'Помилка при розблокуванні користувача')
  }
}

async function makeAdmin(userId) {
  try {
    await changeUserRole(userId, 'admin', currentAdminUid.value)
    showNotification('success', 'Користувач став адміністратором')
    await loadUsers()
  } catch (error) {
    console.error('Помилка при зміні ролі:', error)
    showNotification('error', 'Помилка при зміні ролі')
  }
}

async function removeAdminRole(userId) {
  try {
    await changeUserRole(userId, 'user', currentAdminUid.value)
    showNotification('success', 'Права адміна знято')
    await loadUsers()
  } catch (error) {
    console.error('Помилка при знятті прав адміна:', error)
    showNotification('error', 'Помилка при знятті прав адміна')
  }
}

async function saveNote() {
  if (!selectedUser.value) return
  
  try {
    await addAdminNotes(selectedUser.value.id, adminNote.value, currentAdminUid.value)
    
    // Оновлюємо локально
    selectedUser.value.notes = adminNote.value
    
    showNotification('success', 'Коментар збережен')
  } catch (error) {
    console.error('Помилка при збереженні коментаря:', error)
    showNotification('error', 'Помилка при збереженні')
  }
}

function showNotification(type, message) {
  notification.value = {
    show: true,
    type,
    message
  }
}

async function loadUsers() {
  try {
    users.value = await getAllUsers()
    stats.value = await getUsersStatistics()
  } catch (error) {
    console.error('Помилка при завантаженні користувачів:', error)
    showNotification('error', 'Помилка при завантаженні користувачів')
  }
}

onMounted(() => {
  // Отримуємо ID поточного адміна
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentAdminUid.value = user.uid

      await loadUsers()
    }
  })
})

</script>
