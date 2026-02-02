import { db } from '@/firebase'
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore'

/**
 * Завантажити всі розклади
 */
export async function getAllSchedules() {
  try {
    const schedulesQuery = query(collection(db, 'schedules'))
    const querySnapshot = await getDocs(schedulesQuery)
    
    const schedules = []
    querySnapshot.forEach(doc => {
      schedules.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return schedules.sort((a, b) => {
      return new Date(b.weekStart) - new Date(a.weekStart)
    })
  } catch (error) {
    console.error('Помилка завантаження розкладів:', error)
    throw error
  }
}

/**
 * Завантажити розклад для поточного тижня
 * @param {Date} monday - понеділок поточного тижня
 * @param {Date} sunday - неділя поточного тижня
 */
export async function getScheduleForWeek(monday, sunday) {
  try {
    const mondayStr = monday.toISOString().split('T')[0]
    const sundayStr = sunday.toISOString().split('T')[0]
    
    const allSchedulesQuery = query(collection(db, 'schedules'))
    const allSchedulesSnapshot = await getDocs(allSchedulesQuery)
    
    const validSchedules = []
    allSchedulesSnapshot.forEach(doc => {
      const data = doc.data()
      const scheduleStart = data.weekStart
      const scheduleEnd = data.weekEnd
      
      if (scheduleStart >= mondayStr && scheduleEnd <= sundayStr) {
        validSchedules.push({ id: doc.id, ...data })
      }
    })
    
    if (validSchedules.length > 0) {
      validSchedules.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      return validSchedules[0]
    }
    
    return null
  } catch (error) {
    console.error('Помилка завантаження розкладу:', error)
    throw error
  }
}

/**
 * Сохранити новий розклад в БД
 * @param {string} weekStart - дата початку тижня
 * @param {string} weekEnd - дата кінця тижня
 * @param {Array} trainings - масив тренувань
 * @param {string} userEmail - email користувача
 */
export async function saveSchedule(weekStart, weekEnd, trainings, userEmail) {
  try {
    const docRef = await addDoc(collection(db, 'schedules'), {
      weekStart,
      weekEnd,
      trainings,
      createdAt: new Date().toISOString(),
      createdBy: userEmail || 'unknown'
    })
    
    return docRef.id
  } catch (error) {
    console.error('Помилка збереження розкладу:', error)
    throw error
  }
}
