import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CabinetView from '../views/CabinetView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import DonationsView from '../views/DonationsView.vue'
import { getCurrentUser } from '@/services/authService'
import { getUserProfile } from '@/services/userService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/register',
      name: 'register',
      component: RegisterView
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
      path: '/user/profile',
      name: 'user-profile',
      component: CabinetView,
      meta: { requiresAuth: true },
      props: { section: 'user-profile' }
    },
    {
      path: '/user/registration',
      name: 'user-registration',
      component: CabinetView,
      meta: { requiresAuth: true },
      props: { section: 'training-registration' }
    },
    {
      path: '/user/statistics',
      name: 'user-statistics',
      component: CabinetView,
      meta: { requiresAuth: true },
      props: { section: 'statistics' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: CabinetView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: CabinetView,
      meta: { requiresAuth: true, requiresAdmin: true },
      props: { section: 'users-manager' }
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

// Список email адміністраторів (імпортуємо з userService)
import { ADMIN_EMAILS } from '@/services/userService'

// Перевірка авторизації перед переходом на сторінку
router.beforeEach(async (to: any, from: any, next: any) => {
  const requiresAuth = to.matched.some((record: any) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record: any) => record.meta.requiresAdmin)

  if (requiresAuth || requiresAdmin) {
    const user: any = await getCurrentUser()
    if (!user) {
      next('/login')
      return
    }
    try {
      const userProfile = await getUserProfile(user.uid)
      const isAdmin = userProfile && userProfile.role === 'admin'
      if (requiresAdmin) {
        if (isAdmin) {
          next()
        } else {
          next('/user')
        }
      } else if (requiresAuth) {
        next()
      } else {
        next()
      }
    } catch (error) {
      console.error('Помилка при перевірці доступу:', error)
      next('/login')
    }
  } else {
    next()
  }
})

export default router