<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HeaderWrapper from '../components/HeaderWrapper.vue';
import Footer from '../components/htfFooter.vue';
import HomeView from './HomeView.vue';
import backgroundImage from '@/assets/background.png'
import backgroundMob from '@/assets/backgroundMob.png'
import foundersImage from '@/assets/main/founders_HTF.png'
import kulikalovImage from '@/assets/main/Kulikalov.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const showArrow = ref(true)
const heroRef = ref(null)
let _observer = null
const isMobile = ref(false)
const viewportW = ref(0)
const viewportH = ref(0)
const bgImage = computed(() => isMobile.value ? backgroundMob : backgroundImage)

function _checkMobile() {
    viewportW.value = window.innerWidth
    viewportH.value = window.innerHeight
    isMobile.value = viewportW.value < 768
}
function scrollDown() {
                window.scrollBy({
                                top: window.innerHeight,
                                behavior: 'smooth',
                });
}

function _onScroll() {
  // hide arrow as soon as user scrolls past one viewport height
  showArrow.value = window.scrollY < window.innerHeight
}

onMounted(() => {
    // IntersectionObserver fallback (keeps behavior if layout changes)
    _observer = new IntersectionObserver((entries) => {
        const e = entries[0]
        // Only set true when hero is intersecting; do not override hide caused by scrolling past viewport
        if (e && e.isIntersecting) showArrow.value = true
    }, { threshold: 0.15 })

    if (heroRef.value) {
        _observer.observe(heroRef.value)
    }

    _checkMobile()
    window.addEventListener('resize', _checkMobile)

    // Listen to scroll and hide once scrolled one viewport down
    _onScroll()
    window.addEventListener('scroll', _onScroll, { passive: true })
})

onUnmounted(() => {
    if (_observer) _observer.disconnect()
    window.removeEventListener('scroll', _onScroll)
    window.removeEventListener('resize', _checkMobile)
})
</script>

<template>
    <div ref="heroRef" class="relative min-h-screen bg-cover bg-center bg-fixed" :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: isMobile ? (viewportW + 'px ' + viewportH + 'px') : 'cover' }">
        <!-- Затемнення -->
        <div class="absolute inset-0 bg-black opacity-50"></div>

        <!-- Контент -->
        <div class="relative z-10">
            <HeaderWrapper />
            <main class="text-center p-4 sm:p-6 md:p-10 lg:p-40">
                <HomeView />
                <!-- Нижня жовта стрілочка (desktop only) -->
                <button
                    v-if="showArrow"
                    @click="scrollDown"
                    class="hidden sm:flex fixed z-50 bottom-5 left-1/2 transform -translate-x-1/2 transition w-20 h-20 items-center justify-center hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </main>
        </div>
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

    <Footer />
</template>

<style scoped></style>
