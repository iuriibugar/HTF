<script setup>
import Header from '../components/htfHeader.vue';
import HomeView from './HomeView.vue';
import backgroundImage from '@/assets/background.png'
import foundersImage from '@/assets/main/founders_HTF.png'
import kulikalovImage from '@/assets/main/Kulikalov.png'
import { useRouter } from 'vue-router'

const router = useRouter()

function scrollDown() {
    window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth',
    });
}
</script>

<template>
    <div class="relative min-h-screen bg-cover bg-center bg-fixed" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <!-- Затемнення -->
        <div class="absolute inset-0 bg-black opacity-50"></div>

        <!-- Контент -->
        <div class="relative z-10">
            <Header />
            <main class="text-center p-4 sm:p-6 md:p-10 lg:p-40">
                <HomeView />
            </main>
        </div>

        <!-- Кнопка внизу, адаптивна -->
        <button 
            @click="scrollDown" 
            class="fixed sm:absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold py-2 px-4 sm:px-6 md:px-8 rounded-full hover:bg-yellow-500 transition text-base sm:text-lg">
            Давай знайомитись
        </button>
    </div>

    <div class="flex flex-col items-center justify-center h-auto bg-white text-black p-4 sm:p-6 md:h-80">
        <h1 class="text-xl sm:text-2xl md:text-4xl font-bold mb-4 md:mb-10">Тріатлон у задоволення</h1>
        <p class="text-sm sm:text-base md:text-lg mb-4 md:mb-0">Спорт доступний кожному, ми допоможемо тобі розпочати свій шлях у триатлоні!</p>
    </div>

    <!-- Блок із фото засновників та текстом, адаптивний -->
    <div class="flex flex-col md:flex-row items-center justify-center md:justify-between h-auto md:h-150 bg-gray-100 text-black p-8 sm:p-10 md:p-16 gap-4 md:gap-0 overflow-hidden">
        <!-- Фото засновників -->
        <img :src="foundersImage" alt="Founders" class="w-2/3 sm:w-1/2 md:w-1/3 h-auto mb-4 md:mb-0 ml-0 md:ml-20 object-contain max-h-full" />

        <!-- Текст праворуч -->
        <div class="w-full md:w-1/2 text-center md:text-left px-6 md:px-12 lg:px-16">
            <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4">Засновники HTF</h2>
            <p class="text-sm sm:text-base md:text-lg">Наша команда об'єднує ентузіастів триатлетів. Ми створили HTF, щоб надати можливість кожному розкрити свій потенціал, отримати цінний досвід та долучитися до спільноти однодумців. Разом ми будуємо майбутнє аматорського спорту України!</p>
        </div>
    </div>

    <!-- Блок із головним тренером Кулікалов, фото справа, текст зліва -->
    <div class="flex flex-col md:flex-row-reverse items-center justify-center md:justify-between h-auto md:h-150 bg-white text-black p-8 sm:p-10 md:p-16 gap-4 md:gap-0 overflow-hidden">
        <!-- Фото Кулікалов -->
        <img :src="kulikalovImage" alt="Kulikalov" class="w-2/3 sm:w-1/2 md:w-1/3 h-auto mb-4 md:mb-0 mr-0 md:mr-20 object-contain max-h-full" />

        <!-- Текст зліва -->
        <div class="w-full md:w-1/2 text-center md:text-left px-6 md:px-12 lg:px-16">
            <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4">Головний тренер Кулікалов</h2>
            <p class="text-sm sm:text-base md:text-lg">Досвідчений наставник з багаторічним стажем у сфері спорту. Денис допомагає учасникам розвивати навички, надихає на досягнення та веде команду до нових висот у світі аматорського триатлону.</p>
        </div>
    </div>
</template>

<style scoped></style>
