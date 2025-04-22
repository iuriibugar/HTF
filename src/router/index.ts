import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // Оновлено шлях до компонента

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView, // Використовується правильний компонент
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/HomeView.vue'), // Ліниве завантаження
    },
  ],
})

export default router