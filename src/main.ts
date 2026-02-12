import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import versionService from './services/versionService'

const app = createApp(App)

// Експортуємо сервіс версії в глобальний об'єкт для дебагування
window.__versionService = versionService

app.use(router)

app.mount('#app')

// Регістрація Service Worker для PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(registration => {
      console.log('Service Worker зареєстрований:', registration)
    })
    .catch(error => {
      console.error('Помилка реєстрації Service Worker:', error)
    })
}

