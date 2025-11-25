<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth } from '../firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)
const userEmail = ref('')

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

async function logout() {
    try {
        await signOut(auth)
        router.push('/')
    } catch (error) {
        console.error('Помилка виходу:', error)
    }
}
</script>

<template>
    <header class="flex flex-col items-center md:flex-row md:justify-between text-white p-4">
        <!-- Логотип -->
        <router-link to="/">
            <img src="../assets/logo_yellow.png" alt="Logo" class="w-20 h-auto mb-4 md:mb-0 cursor-pointer hover:opacity-80 transition" />
        </router-link>

        <!-- Меню -->
        <ul class="flex flex-wrap justify-center space-x-4 text-sm md:text-base">
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Пробний період</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Членство</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Тренувальні програми</a></li>
            <li><router-link to="/schedule" class="menu-link font-bold hover:text-yellow-400">Розклад</router-link></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Види спорту</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Календар</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Про нас</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Допомога ЗСУ</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Клубний мерч</a></li>
            <li><router-link v-if="!isAuthenticated" to="/login" class="menu-link font-bold hover:text-yellow-400">Логін</router-link></li>
        </ul>

        <!-- Кнопки -->
        <div class="flex flex-col gap-2 items-end">
            <button
                type="button"
                @click="joinClub"
                class="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition">
                Доєднатись
            </button>
            
            <!-- Кнопка "Увійти в кабінет" для неавторизованих -->
            <router-link 
                v-if="!isAuthenticated"
                to="/login" 
                class="flex items-center gap-2 bg-transparent border-2 border-white text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-white hover:text-black transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Увійти в кабінет
            </router-link>
            
            <!-- Кнопки "Кабінет" та іконка "Вийти" для авторизованих -->
            <div v-else class="flex items-center gap-3">
                <router-link 
                    :to="cabinetPath"
                    class="flex items-center gap-2 bg-transparent border-2 border-white text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-white hover:text-black transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    Кабінет
                </router-link>
                
                <button
                    @click="logout"
                    title="Вийти"
                    class="p-2 bg-transparent border-2 border-white text-white rounded-lg hover:bg-red-500 hover:border-red-500 transition">
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