<script>
export default {
    data() {
        return {
            HTF: {
                title: 'Happy TRI Friends',
                description: 'HTF любить тебе',
                joinClub: 'Приєднатися',
            },
        };
    },
    methods: {
        joinClub() {
            alert('Welcome to Happy TRI Friends!');
        },
    },
};
</script>

<template>
    <header class="flex flex-col items-center md:flex-row md:justify-between text-white p-4">
        <!-- Логотип -->
        <img src="../assets/logo_yellow.png" alt="Logo" class="w-20 h-auto mb-4 md:mb-0" />

        <!-- Меню -->
        <ul class="flex flex-wrap justify-center space-x-4 text-sm md:text-base">
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Пробний період</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Членство</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Тренувальні програми</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Види спорту</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Календар</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Про нас</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Допомога ЗСУ</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Клубний мерч</a></li>
            <li><a href="#" class="menu-link font-bold hover:text-yellow-400">Логін</a></li>
        </ul>

        <!-- Кнопка -->
        <button
            type="button"
            @click="joinClub"
            class="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition">
            Доєднатись
        </button>
    </header>
</template>

<style scoped>
/* Додаткові стилі для посилань */
.menu-link {
    text-decoration: none;
    transition: color 0.3s;
}
</style>