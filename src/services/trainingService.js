import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

// Реєстрація на тренування
export async function registerForTraining(trainingId, userName, userEmail) {
  try {
    await addDoc(collection(db, 'registrations'), {
      trainingId,
      userName,
      userEmail,
      timestamp: new Date().toISOString()
    })
    alert('Ви успішно зареєструвались на тренування!')
  } catch (error) {
    console.error('Помилка реєстрації:', error)
  }
}

// Отримання всіх реєстрацій (для адміністратора)
export async function getAllRegistrations() {
  const querySnapshot = await getDocs(collection(db, 'registrations'))
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}