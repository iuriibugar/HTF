import { db, auth } from '@/firebase'
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore'

/**
 * Зареєструватися на тренування
 * @param {Object} trainingData - дані про реєстрацію (має містити trainingType)
 */
export async function registerForTraining(trainingData) {
  try {
    const userId = auth.currentUser.uid
    
    // Додаємо реєстрацію
    const docRef = await addDoc(collection(db, 'registrations'), {
      userId: userId,
      userEmail: auth.currentUser.email,
      userName: auth.currentUser.displayName || auth.currentUser.email,
      userPhoto: auth.currentUser.photoURL || null,
      registeredAt: new Date().toISOString(),
      ...trainingData
    })
    
    // Оновлюємо статистику користувача
    const trainingType = trainingData.trainingType || 'other' // swimming, cycling, running, other
    const userRef = doc(db, 'users', userId)
    
    try {
      await updateDoc(userRef, {
        [`trainingStats.${trainingType}.registered`]: increment(1),
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.warn('Помилка оновлення статистики (можливо, користувач новий):', error)
      // Не критично, якщо помилка - користувач може бути новим
    }
    
    return docRef.id
  } catch (error) {
    console.error('Помилка реєстрації на тренування:', error)
    throw error
  }
}

/**
 * Завантажити всі реєстрації користувача
 * @param {string} userId - ID користувача
 */
export async function getUserRegistrations(userId) {
  try {
    const q = query(collection(db, 'registrations'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => doc.data().trainingId)
  } catch (error) {
    console.error('Помилка завантаження реєстрацій користувача:', error)
    throw error
  }
}

/**
 * Завантажити всі реєстрації для розкладу
 * @param {string} scheduleId - ID розкладу
 */
export async function getScheduleRegistrations(scheduleId) {
  try {
    const q = query(collection(db, 'registrations'), where('scheduleId', '==', scheduleId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Помилка завантаження реєстрацій розкладу:', error)
    throw error
  }
}

/**
 * Завантажити всі реєстрації для тренування
 * @param {string} trainingId - ID тренування
 */
export async function getTrainingRegistrations(trainingId) {
  try {
    const q = query(collection(db, 'registrations'), where('trainingId', '==', trainingId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Помилка завантаження реєстрацій тренування:', error)
    throw error
  }
}

/**
 * Скасувати реєстрацію на тренування
 * @param {string} userId - ID користувача
 * @param {string} trainingId - ID тренування
 * @param {string} trainingType - тип тренування (для оновлення статистики)
 */
export async function cancelRegistration(userId, trainingId, trainingType = 'other') {
  try {
    const q = query(
      collection(db, 'registrations'),
      where('userId', '==', userId),
      where('trainingId', '==', trainingId)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0]
      const registrationData = docToDelete.data()
      
      await deleteDoc(docToDelete.ref)
      
      // Оновлюємо статистику користувача (зменшуємо на 1)
      const type = registrationData.trainingType || trainingType || 'other'
      const userRef = doc(db, 'users', userId)
      
      try {
        await updateDoc(userRef, {
          [`trainingStats.${type}.registered`]: increment(-1),
          updatedAt: new Date().toISOString()
        })
      } catch (error) {
        console.warn('Помилка оновлення статистики при скасуванні:', error)
      }
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Помилка скасування реєстрації:', error)
    throw error
  }
}
