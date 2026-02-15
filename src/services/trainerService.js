import { db } from '@/firebase'
import { 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from 'firebase/firestore'

/**
 * Тренерський сервіс
 * 
 * Тренери зберігаються як окремі документи в колекції 'trainers'
 */

const TRAINERS_COLLECTION = 'trainers'

/**
 * Отримати всіх тренерів
 * @returns {Promise<Array>} Масив тренерів
 */
export async function getAllTrainers() {
  try {
    const collectionRef = collection(db, TRAINERS_COLLECTION)
    const q = query(collectionRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const trainers = []
    querySnapshot.forEach((doc) => {
      trainers.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return trainers
  } catch (error) {
    console.error('Помилка при завантаженні тренерів:', error)
    throw error
  }
}

/**
 * Створити нового тренера
 * @param {Object} trainerData - Дані тренера
 * @returns {Promise<Object>} Новий тренер з ID
 */
export async function createTrainer(trainerData) {
  try {
    // Генеруємо унікальний ID
    const trainerId = 'trainer_' + Date.now()
    
    // Новий тренер
    const newTrainer = {
      firstName: trainerData.firstName,
      lastName: trainerData.lastName,
      imageBase64: trainerData.imageBase64,
      description: trainerData.description,
      instagramLink: trainerData.instagramLink || null,
      order: trainerData.order || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Записуємо в Firestore
    const docRef = doc(db, TRAINERS_COLLECTION, trainerId)
    await setDoc(docRef, newTrainer)
    
    return {
      id: trainerId,
      ...newTrainer
    }
  } catch (error) {
    console.error('Помилка при створенні тренера:', error)
    throw error
  }
}

/**
 * Оновити тренера
 * @param {string} trainerId - ID тренера
 * @param {Object} updateData - Дані для оновлення
 * @returns {Promise<Object>} Оновлений тренер
 */
export async function updateTrainer(trainerId, updateData) {
  try {
    const updateFields = {
      updatedAt: new Date().toISOString()
    }
    
    if (updateData.firstName !== undefined) updateFields.firstName = updateData.firstName
    if (updateData.lastName !== undefined) updateFields.lastName = updateData.lastName
    if (updateData.imageBase64 !== undefined) updateFields.imageBase64 = updateData.imageBase64
    if (updateData.description !== undefined) updateFields.description = updateData.description
    if (updateData.instagramLink !== undefined) updateFields.instagramLink = updateData.instagramLink
    if (updateData.order !== undefined) updateFields.order = updateData.order
    
    const docRef = doc(db, TRAINERS_COLLECTION, trainerId)
    await updateDoc(docRef, updateFields)
    
    return {
      id: trainerId,
      ...updateFields
    }
  } catch (error) {
    console.error('Помилка при оновленні тренера:', error)
    throw error
  }
}

/**
 * Видалити тренера
 * @param {string} trainerId - ID тренера
 * @returns {Promise<boolean>} Успіх
 */
export async function deleteTrainer(trainerId) {
  try {
    const docRef = doc(db, TRAINERS_COLLECTION, trainerId)
    await deleteDoc(docRef)
    
    return true
  } catch (error) {
    console.error('Помилка при видаленні тренера:', error)
    throw error
  }
}

/**
 * Конвертувати зображення в base64
 * @param {File} file - Файл зображення
 * @returns {Promise<string>} Base64 рядок
 */
export function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
