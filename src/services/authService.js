import { auth } from '@/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { createOrUpdateUserProfile } from './userService'

/**
 * Отримати поточного користувача
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe()
      
      if (user) {
        try {
          // При вході користувача, зберігаємо/оновлюємо його дані у БД
          await createOrUpdateUserProfile(user.uid, {})
        } catch (error) {
          console.error('Помилка при збереженні профілю користувача:', error)
          // Не прериваємо процес, якщо помилка зберігання
        }
      }
      
      resolve(user)
    }, reject)
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
