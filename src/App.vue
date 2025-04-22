<script setup>
import Header from './components/htfHeader.vue';
import HomeView from './views/HomeView.vue';

function scrollDown() {
    window.scrollBy({
        top: window.innerHeight, // Скролить вниз на висоту одного екрану
        behavior: 'smooth', // Плавний скрол
    });
}
</script>

<template>
    <div class="relative min-h-screen bg-cover bg-center bg-fixed" style="background-image: url('/src/assets/background.png');">
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
        <button 
            @click="scrollDown" 
            class="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold py-2 px-8 rounded-full">
            Давай знайомитись
        </button>
    </div>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <h1 class="text-4xl font-bold mb-4">Happy TRI Friends</h1>
        <p class="text-lg mb-8">HTF любить тебе</p>
        </div>
    </template>


<style scoped>

</style>