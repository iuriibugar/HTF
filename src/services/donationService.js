import { db } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

/**
 * Завантажити всі донати
 */
export async function getAllDonations() {
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
    console.error('Помилка завантаження донатів:', error)
    throw error
  }
}

/**
 * Створити новий донат
 * @param {Object} donationData - дані про донат
 */
export async function createDonation(donationData) {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...donationData
    })
    
    return docRef.id
  } catch (error) {
    console.error('Помилка створення донату:', error)
    throw error
  }
}

/**
 * Оновити донат
 * @param {string} donationId - ID донату
 * @param {Object} donationData - оновлені дані
 */
export async function updateDonation(donationId, donationData) {
  try {
    const donationDocRef = doc(db, 'donations', donationId)
    await updateDoc(donationDocRef, {
      updatedAt: new Date().toISOString(),
      ...donationData
    })
    
    return donationId
  } catch (error) {
    console.error('Помилка оновлення донату:', error)
    throw error
  }
}

/**
 * Видалити донат
 * @param {string} donationId - ID донату
 */
export async function deleteDonation(donationId) {
  try {
    await deleteDoc(doc(db, 'donations', donationId))
    return true
  } catch (error) {
    console.error('Помилка видалення донату:', error)
    throw error
  }
}
