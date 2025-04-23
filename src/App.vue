<script setup>
import Header from './components/htfHeader.vue';
import HomeView from './views/HomeView.vue';
import backgroundImage from '@/assets/background.png'
import timurImage from '@/assets/timur.png'

function scrollDown() {
    window.scrollBy({
        top: window.innerHeight, // Скролить вниз на висоту одного екрану
        behavior: 'smooth', // Плавний скрол
    });
}
</script>

<template>
    <div class="relative min-h-screen bg-cover bg-center bg-fixed"
        :style="{ backgroundImage: `url(${backgroundImage})` }">
        <!-- Затемнення -->
        <div class="absolute inset-0 bg-black opacity-50"></div>

        <!-- Контент -->
        <div class="relative z-10">
            <Header />
            <main class="text-center p-40">
                <HomeView />
            </main>
        </div>


        <!-- Кнопка внизу -->
        <button @click="scrollDown"
            class="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold py-2 px-8 rounded-full">
            Давай знайомитись
        </button>
    </div>

    <div class="flex flex-col items-center justify-center h-80 bg-white text-black">
        <h1 class="text-4xl font-bold mb-10">Всі люди як люди, а Юрій молодець!</h1>
        <p class="text-lg mb-0">Якщо потрібне наповнення я можу продовжити. Внизу по суті якась інфа про кемпи змагання,
            лігу і тд.</p>
    </div>

    <!-- Блок із фото Тимура та текстом -->
    <div class="flex items-center justify-between h-150 text-black">
        <!-- Фото Тимура -->
        <img :src="timurImage" alt="Timur" class="w-1/3 h-auto ml-20" />

        <!-- Текст праворуч -->
        <div class="w-1/2 text-center">
            <h2 class="text-2xl font-bold mb-4">Тимур</h2>
            <p class="text-lg">Тимур любитель попєтушитись</p>
        </div>
    </div>
</template>


<style scoped></style>