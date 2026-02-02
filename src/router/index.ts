import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import LoginView from '../views/LoginView.vue'
import CabinetView from '../views/CabinetView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import DonationsView from '../views/DonationsView.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: ScheduleView,
    },
    {
      path: '/donations',
      name: 'donations',
      component: DonationsView,
    },
    {
      path: '/user',
      name: 'user',
      component: CabinetView,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/registration',
      name: 'user-registration',
      component: CabinetView,
      meta: { requiresAuth: true },
      props: { section: 'training-registration' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: CabinetView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/schedule',
      name: 'admin-schedule',
      component: CabinetView,
      meta: { requiresAuth: true, requiresAdmin: true },
      props: { section: 'form-schedule' }
    },
    {
      path: '/admin/donations',
      name: 'admin-donations',
      component: CabinetView,
      meta: { requiresAuth: true, requiresAdmin: true },
      props: { section: 'donations-manager' }
    },
    {
      path: '/cabinet',
      name: 'cabinet',
      component: CabinetView,
      meta: { requiresAuth: true }
    },
  ],
})

// Список email адміністраторів
const ADMIN_EMAILS = [
  'kulikalovdenis@gmail.com',
  'bugary20@gmail.com',
]

// Функція для отримання поточного користувача
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

// Перевірка авторизації перед переходом на сторінку
router.beforeEach(async (to: any, from: any, next: any) => {
  const requiresAuth = to.matched.some((record: any) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record: any) => record.meta.requiresAdmin)

  if (requiresAuth || requiresAdmin) {
    const user: any = await getCurrentUser()
    
    if (requiresAuth && !user) {
      next('/login')
    } else if (requiresAdmin && user) {
      if (ADMIN_EMAILS.includes(user.email || '')) {
        next()
      } else {
        next('/user')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router