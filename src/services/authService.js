import { auth } from '@/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { createOrUpdateUserProfile } from './userService'

/**
 * Отримати поточного користувача з повторними спробами
 */
export function getCurrentUser(retries = 3) {
  return new Promise((resolve, reject) => {
    let attempts = 0
    let unsubscribe = null
    
    const checkAuth = () => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (unsubscribe) {
          unsubscribe()
        }
        
        // Якщо є user або скінчилися спроби
        if (user) {
          try {
            // При вході користувача, зберігаємо/оновлюємо його дані у БД
            await createOrUpdateUserProfile(user.uid, {})
          } catch (error) {
            console.error('Помилка при збереженні профілю користувача:', error)
            // Не прериваємо процес, якщо помилка зберігання
          }
          resolve(user)
        } else if (attempts < retries) {
          // Firebase ще не ініціалізувався, повторимо спробу
          attempts++
          unsubscribe() // Відписуємось від попередньої перевірки
          setTimeout(checkAuth, 300)
        } else {
          // Користувач не авторизований
          resolve(null)
        }
      }, reject)
    }
    
    checkAuth()
  })
}

/**
 * Вийти з системи
 */
export async function logout() {
  try {
    await signOut(auth)
    return true
  } catch (error) {
    console.error('Помилка виходу:', error)
    throw error
  }
}

/**
 * Визначити чи користувач адмін
 * @param {string} userEmail - email користувача
 * @param {Array} adminEmails - список email адміністраторів
 */
export function isAdminUser(userEmail, adminEmails) {
  return adminEmails.includes(userEmail || '')
}
