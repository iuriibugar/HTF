<script setup>
import Header from '../components/htfHeader.vue';
import HomeView from './HomeView.vue';
import backgroundImage from '@/assets/background.png'
import timurImage from '@/assets/timur.png'
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
            <main class="text-center p-10 md:p-40">
                <HomeView />
            </main>
        </div>

        <!-- Кнопка внизу -->
        <button 
            @click="scrollDown" 
            class="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold py-2 px-4 md:px-8 rounded-full hover:bg-yellow-500 transition">
            Давай знайомитись
        </button>
    </div>

    <div class="flex flex-col items-center justify-center h-auto bg-white text-black p-4 md:h-80">
        <h1 class="text-2xl md:text-4xl font-bold mb-4 md:mb-10">Всі люди як люди, а Юрій молодець!</h1>
        <p class="text-base md:text-lg mb-4 md:mb-0">Якщо потрібне наповнення я можу продовжити. Внизу по суті якась інфа про кемпи змагання, лігу і тд.</p>
    </div>

    <!-- Блок із фото Тимура та текстом -->
    <div class="flex flex-col md:flex-row items-center justify-center md:justify-between h-auto md:h-150 bg-gray-100 text-black p-4">
        <!-- Фото Тимура -->
        <img :src="timurImage" alt="Timur" class="w-2/3 md:w-1/3 h-auto mb-4 md:mb-0 ml-0 md:ml-20" />

        <!-- Текст праворуч -->
        <div class="w-full md:w-1/2 text-center md:text-left">
            <h2 class="text-xl md:text-2xl font-bold mb-2 md:mb-4">Тимур</h2>
            <p class="text-base md:text-lg">Тимур любитель попєтушитись</p>
        </div>
    </div>
</template>

<style scoped></style>
