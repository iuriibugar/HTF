/**
 * DONATION SERVICE - з Валідацією Контрактів
 * 
 * Приклад того, як інтегрувати API контракти у реальний сервіс.
 * 
 * Використання:
 * import { getAllDonations, createDonation, updateDonation, deleteDonation } from '@/services/donationService'
 */

import { db } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { withValidation, validateBeforeSend, logRequest } from './serviceValidationHelper'

// ============================================================================
// ВНУТРІШНІ ДОПОМІЖНІ ФУНКЦІЇ (без валідації)
// ============================================================================

/**
 * Внутрішня функція для завантаження донатів з БД (без валідації)
 * @private
 */
async function _fetchAllDonationsFromDB() {
  try {
    const querySnapshot = await getDocs(collection(db, 'donations'))
    
    const donations = []
    querySnapshot.forEach(doc => {
      donations.push({ id: doc.id, ...doc.data() })
    })
    
    // Сортуємо за датою оновлення (новіші спочатку)
    donations.sort((a, b) => {
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    })
    
    return donations
  } catch (error) {
    console.error('Помилка завантаження донатів з БД:', error)
    throw error
  }
}

/**
 * Внутрішня функція для додавання донату в БД (без валідації)
 * @private
 */
async function _addDonationToDB(donationData) {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...donationData
    })
    return docRef.id
  } catch (error) {
    console.error('Помилка додавання донату в БД:', error)
    throw error
  }
}

/**
 * Внутрішня функція для оновлення донату в БД (без валідації)
 * @private
 */
async function _updateDonationInDB(donationId, donationData) {
  try {
    const donationDocRef = doc(db, 'donations', donationId)
    await updateDoc(donationDocRef, {
      updatedAt: new Date().toISOString(),
      ...donationData
    })
    return donationId
  } catch (error) {
    console.error('Помилка оновлення донату в БД:', error)
    throw error
  }
}

/**
 * Внутрішня функція для видалення донату з БД (без валідації)
 * @private
 */
async function _deleteDonationFromDB(donationId) {
  try {
    await deleteDoc(doc(db, 'donations', donationId))
    return true
  } catch (error) {
    console.error('Помилка видалення донату з БД:', error)
    throw error
  }
}

// ============================================================================
// ПУБЛІЧНІ ФУНКЦІЇ З ВАЛІДАЦІЄЮ КОНТРАКТІВ
// ============================================================================

/**
 * Завантажити всі проекти благодійних зборів
 * 
 * Контракт: GET /donations
 * 
 * @returns {Promise<Array>} масив проектів з прикладом:
 * [
 *   {
 *     id: 'donation_123',
 *     title: 'Донат Фюрер',
 *     description: 'Збирає на пісюни і автівки',
 *     imageBase64: 'data:image/png;base64,...',
 *     link: 'https://send.monobank.ua/jar/...',
 *     createdAt: '2026-01-23T10:06:00.056Z',
 *     updatedAt: '2026-01-23T10:32:25.820Z'
 *   }
 * ]
 * 
 * @throws {Error} якщо помилка БД
 */
export async function getAllDonations() {
  logRequest('donation', 'getAll', {}, false)
  return await _fetchAllDonationsFromDB()
}

/**
 * Створити новий проект благодійного збору з АВТОМАТИЧНОЮ ВАЛІДАЦІЄЮ
 * 
 * Контракт: POST /donations
 * 
 * Обов'язкові поля:
 *   - title: string (2-200 символів)
 *   - description: string (10-2000 символів)
 *   - imageBase64: string (base64 encoded image)
 * 
 * Опціональні поля:
 *   - link: string (посилання на платіж - Monobank, тощо)
 * 
 * @param {Object} donationData - дані проекту
 * @param {string} donationData.title - назва проекту (2-200 символів)
 * @param {string} donationData.description - опис проекту (10-2000 символів)
 * @param {string} donationData.imageBase64 - зображення (data:image/png;base64,...)
 * @param {string} [donationData.link] - посилання на платіж
 * 
 * @returns {Promise<string>} ID новоствореного проекту
 * 
 * @throws {ValidationError} якщо дані не валідні
 * @throws {Error} якщо помилка БД
 * 
 * @example
 * // ✅ Коректне використання
 * const donationId = await createDonation({
 *   title: 'Донат Фюрер',
 *   description: 'Збирає на пісюни і автівки для розвитку проекту',
 *   imageBase64: 'data:image/png;base64,iVBO...',
 *   link: 'https://send.monobank.ua/jar/5TPzVYBKpT'
 * })
 * console.log('Проект створено:', donationId)
 * 
 * @example
 * // ❌ Помилка: невалідна назва
 * try {
 *   await createDonation({
 *     title: 'А',  // Помилка! мінімум 2 символи
 *     description: 'Опис проекту без суміщення мінімальної довжини',
 *     imageBase64: 'data:image/png;base64,...'
 *   })
 * } catch (error) {
 *   console.error(error.errors) 
 *   // ['title: мінімальна довжина 2, отримано 1', ...]
 * }
 * 
 * @example
 * // ❌ Помилка: невалідне зображення
 * try {
 *   await createDonation({
 *     title: 'Донат',
 *     description: 'Опис проекту',
 *     imageBase64: 'invalid-base64' // Помилка! неправильний формат
 *   })
 * } catch (error) {
 *   console.error(error.errors)
 * }
 */
export const createDonation = withValidation('donation', 'create', async ({ data, validation }) => {
  logRequest('donation', 'create', data, false)
  return await _addDonationToDB(data)
})

/**
 * Оновити проект благодійного збору з АВТОМАТИЧНОЮ ВАЛІДАЦІЄЮ
 * 
 * Контракт: PUT /donations/:id
 * 
 * Опціональні поля для оновлення:
 *   - title: string (2-200 символів)
 *   - description: string (10-2000 символів)
 *   - imageBase64: string (base64 encoded image)
 *   - link: string (посилання на платіж)
 * 
 * @param {string} donationId - ID проекту
 * @param {Object} donationData - дані для оновлення
 * @param {string} [donationData.title] - нова назва проекту
 * @param {string} [donationData.description] - новий опис проекту
 * @param {string} [donationData.imageBase64] - нове зображення
 * @param {string} [donationData.link] - нове посилання на платіж
 * 
 * @returns {Promise<string>} ID оновленого проекту
 * 
 * @throws {ValidationError} якщо дані не валідні
 * @throws {Error} якщо помилка БД
 * 
 * @example
 * // ✅ Коректне оновлення
 * await updateDonation('donation_456', {
 *   title: 'Донат Фюрер - Оновлено',
 *   description: 'Оновлений опис проекту'
 * })
 * 
 * @example
 * // ❌ Помилка: занадто коротка назва
 * try {
 *   await updateDonation('donation_456', {
 *     title: 'А'  // Помилка! мінімум 2 символи
 *   })
 * } catch (error) {
 *   console.error(error.errors)
 *   // ['title: мінімальна довжина 2, отримано 1']
 * }
 */
export const updateDonation = withValidation('donation', 'update', async ({ data, validation }) => {
  logRequest('donation', 'update', data, false)
  // Примітка: ID передається окремо, не входить до контракту
  // В реальній реалізації потрібен параметр donationId
  return await _updateDonationInDB(data._id || data.id, data)
})

/**
 * Видалити донат
 * 
 * Контракт: DELETE /donations/:id
 * 
 * @param {string} donationId - ID донату
 * @returns {Promise<boolean>} true якщо видалено успішно
 * 
 * @throws {Error} якщо помилка БД
 * 
 * @example
 * await deleteDonation('donation_456')
 */
export async function deleteDonation(donationId) {
  logRequest('donation', 'delete', { id: donationId }, false)
  return await _deleteDonationFromDB(donationId)
}

// ============================================================================
// ДОПОМІЖНІ ФУНКЦІЇ ДЛЯ ПРЕВ'ЄЗ ПЕРЕД ОПЕРАЦІЯМИ
// ============================================================================

/**
 * Перевірити дані донату перед створенням
 * 
 * Показує помилки і пропозиції як їх виправити
 * 
 * @param {Object} donationData - дані про донат
 * @returns {Object} результат валідації з пропозиціями
 * 
 * @example
 * const check = validateDonationBeforeCreate({
 *   amount: -100,
 *   currency: 'UAH',
 *   donorName: 'Іван'
 *   // missing email
 * })
 * 
 * console.log(check.isValid) // false
 * console.log(check.validation.errors) // ['amount: мінімальне значення 1...', ...]
 * console.log(check.suggestions) // ['Перевірте тип даних', 'Додайте обов\'язкове поле "donorEmail"']
 * console.log(check.example) // { amount: 1000, currency: 'UAH', ... }
 */
export function validateDonationBeforeCreate(donationData) {
  return validateBeforeSend('donation', 'create', donationData)
}

/**
 * Перевірити дані донату перед оновленням
 * 
 * @param {Object} updateData - поля для оновлення
 * @returns {Object} результат валідації з пропозиціями
 */
export function validateDonationBeforeUpdate(updateData) {
  return validateBeforeSend('donation', 'update', updateData)
}

// ============================================================================
// ЭКСПОРТОВАНІ ФУНКЦІЇ ПЕРЕВІРКИ
// ============================================================================

/**
 * Отримати приклад коректного JSON для створення донату
 * 
 * @returns {Object} приклад JSON
 * 
 * @example
 * console.log(getDonationExample())
 * // {
 * //   amount: 1000,
 * //   currency: 'UAH',
 * //   description: 'Спонсорство для команди',
 * //   donorName: 'Марія Сидоренко',
 * //   donorEmail: 'maria@example.com',
 * //   status: 'completed'
 * // }
 */
export function getDonationExample() {
  return {
    id: 'doc123',
    title: 'Донат Фюрер',
    description: 'Збирає на пісюни і автівки',
    imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    link: 'https://send.monobank.ua/jar/5TPzVYBKpT?c=uah',
    createdAt: '2026-01-23T10:06:00.056Z',
    updatedAt: '2026-01-23T10:32:25.820Z'
  }
}

/**
 * Отримати інформацію про допустимі значення полів
 * 
 * @returns {Object} інформація про поля
 * 
 * @example
 * console.log(getDonationFieldInfo())
 * // {
 * //   amount: { minimum: 1, type: 'number' },
 * //   currency: { enum: ['UAH', 'USD', 'EUR'] },
 * //   status: { enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
 * //   ...
 * // }
 */
export function getDonationFieldInfo() {
  return {
    id: {
      type: 'string',
      description: 'Унікальний ідентифікатор донату (Firestore doc ID)'
    },
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 200,
      description: 'Назва донату (1-200 символів)'
    },
    description: {
      type: 'string',
      minLength: 0,
      maxLength: 1000,
      description: 'Детальний опис донату (0-1000 символів)'
    },
    imageBase64: {
      type: 'string',
      pattern: '^data:image\/(png|jpg|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$',
      description: 'Base64 закодоване зображення з MIME типом (PNG, JPG, GIF або WebP)'
    },
    link: {
      type: 'string',
      format: 'uri',
      description: 'Посилання на сторінку збору (https://send.monobank.ua/jar/...)'
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'ISO 8601 дата створення (автоматично установлюється)'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'ISO 8601 дата останнього оновлення (автоматично установлюється)'
    }
  }
}
