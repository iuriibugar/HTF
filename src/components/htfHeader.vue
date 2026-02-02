<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth } from '../firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)
const userEmail = ref('')
const isMobileMenuOpen = ref(false)

const ADMIN_EMAILS = [
  'kulikalovdenis@gmail.com',
  'bugary20@gmail.com',
]

// Визначити чи користувач адмін
const isAdmin = computed(() => {
    return isAuthenticated.value && ADMIN_EMAILS.includes(userEmail.value || '')
})

// Отримати правильний шлях до кабінету
const cabinetPath = computed(() => {
    return isAdmin.value ? '/admin' : '/user'
})

onMounted(() => {
    // Відстежуємо стан авторизації
    onAuthStateChanged(auth, (user) => {
        if (user) {
            isAuthenticated.value = true
            userEmail.value = user.email
        } else {
            isAuthenticated.value = false
            userEmail.value = ''
        }
    })
})

function joinClub() {
    alert('Welcome to Happy TRI Friends!')
}

function closeMenu() {
    isMobileMenuOpen.value = false
}

async function logout() {
    try {
        await signOut(auth)
        closeMenu()
        router.push('/')
    } catch (error) {
        console.error('Помилка виходу:', error)
    }
}
</script>

<template>
    <header class="flex flex-col md:flex-row md:justify-between md:items-center text-white p-3 gap-4 md:gap-0">
        <!-- Топ рядок: Бургер + Логотип + Кнопки -->
        <div class="flex md:hidden justify-between items-center w-full relative">
            <!-- Бургер меню (залів) -->
            <button 
                @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="p-2 hover:bg-gray-700 rounded transition"
                title="Меню">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <!-- Логотип (по центру всього хедера) -->
            <router-link to="/" class="absolute left-1/2 transform -translate-x-1/2">
                <img src="../assets/logo_yellow.png" alt="Logo" class="w-10 h-auto cursor-pointer hover:opacity-80 transition" />
            </router-link>

            <!-- Кнопки справа на мобільних -->
            <div class="flex flex-row items-center gap-1 ml-auto">
                <!-- Кнопка "Увійти в кабінет" для неавторизованих -->
                <router-link 
                    v-if="!isAuthenticated"
                    to="/login" 
                    class="flex items-center justify-center p-2 bg-transparent border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </router-link>
                
                <!-- Кнопки "Кабінет" та іконка "Вийти" для авторизованих -->
                <div v-else class="flex flex-row items-center gap-1">
                    <router-link 
                        :to="cabinetPath"
                        class="flex items-center justify-center p-2 bg-transparent border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                    </router-link>
                    
                    <button
                        @click="logout"
                        title="Вийти"
                        class="p-2 bg-transparent border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:border-yellow-500 hover:text-black transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Десктопна версія -->
        <!-- Логотип (для десктопа) -->
        <div class="hidden md:flex md:justify-start md:w-48">
            <router-link to="/">
                <img src="../assets/logo_yellow.png" alt="Logo" class="w-20 h-auto cursor-pointer hover:opacity-80 transition" />
            </router-link>
        </div>

        <!-- Меню (приховане на мобільних, видимо на десктопах) -->
        <div class="hidden md:flex justify-center flex-1">
            <ul class="flex flex-wrap justify-center space-x-4 text-sm md:text-base">
                <li><router-link to="/schedule" class="menu-link font-bold hover:text-yellow-400" active-class="text-yellow-400">Розклад</router-link></li>
                <li><router-link to="/donations" class="menu-link font-bold hover:text-yellow-400" active-class="text-yellow-400">Допомога ЗСУ</router-link></li>
                <li><router-link v-if="!isAuthenticated" to="/login" class="menu-link font-bold hover:text-yellow-400" active-class="text-yellow-400">Логін</router-link></li>
            </ul>
        </div>

        <!-- Мобільне меню (видимо коли відкрито) -->
        <div v-if="isMobileMenuOpen" class="md:hidden w-full bg-opacity-95 rounded-lg p-4 space-y-3">
            <router-link 
                to="/schedule" 
                class="block menu-link font-bold hover:text-yellow-400 text-center py-2"
                active-class="text-yellow-400"
                @click="closeMenu">
                Розклад
            </router-link>
            <router-link 
                to="/donations" 
                class="block menu-link font-bold hover:text-yellow-400 text-center py-2"
                active-class="text-yellow-400"
                @click="closeMenu">
                Допомога ЗСУ
            </router-link>
            <router-link 
                v-if="!isAuthenticated"
                to="/login" 
                class="block menu-link font-bold hover:text-yellow-400 text-center py-2"
                active-class="text-yellow-400"
                @click="closeMenu">
                Логін
            </router-link>
        </div>

        <!-- Кнопки для десктопа -->
        <div class="hidden md:flex md:flex-col gap-2 items-end md:items-center md:w-48 md:justify-end">
            <button
                v-if="!isAuthenticated"
                type="button"
                @click="joinClub"
                class="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition">
                Доєднатись
            </button>
            
            <!-- Кнопка "Увійти в кабінет" для неавторизованих -->
            <router-link 
                v-if="!isAuthenticated"
                to="/login" 
                class="flex items-center justify-center gap-2 bg-transparent border-2 border-yellow-400 text-yellow-400 font-semibold py-1.5 px-4 rounded-lg hover:bg-yellow-400 hover:text-black transition text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Увійти в кабінет
            </router-link>
            
            <!-- Кнопки "Кабінет" та іконка "Вийти" для авторизованих -->
            <div v-else class="flex md:flex-col items-center md:items-end gap-3 md:gap-2">
                <router-link 
                    :to="cabinetPath"
                    class="flex items-center gap-2 bg-transparent border-2 border-yellow-400 text-yellow-400 font-semibold py-1.5 px-4 rounded-lg hover:bg-yellow-400 hover:text-black transition text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    Кабінет
                </router-link>
                
                <button
                    @click="logout"
                    title="Вийти"
                    class="p-2 bg-transparent border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:border-yellow-500 hover:text-black transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* Додаткові стилі для посилань */
.menu-link {
    text-decoration: none;
    transition: color 0.3s;
}
</style>