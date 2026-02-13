import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

/**
 * Назва колекції для версій
 */
const VERSIONS_COLLECTION = 'app_versions'
const VERSION_DOC_ID = 'current'

/**
 * Отримати поточну версію з Firebase
 */
export async function getLatestVersion() {
  try {
    const versionDocRef = doc(db, VERSIONS_COLLECTION, VERSION_DOC_ID)
    const versionDoc = await getDoc(versionDocRef)
    
    if (versionDoc.exists()) {
      return versionDoc.data().version
    }
    
    return '1.0.0'
  } catch (error) {
    // Removed unnecessary console logging
    return null
  }
}

/**
 * Оновити версію в Firebase
 */
export async function updateVersionInDatabase(version) {
  try {
    const versionDocRef = doc(db, VERSIONS_COLLECTION, VERSION_DOC_ID)
    await setDoc(versionDocRef, {
      version: version,
      updatedAt: new Date(),
      updatedBy: 'admin'
    })
    return true
  } catch (error) {
    return false
  }
}

/**
 * Отримати версію з localStorage
 */
export function getLocalVersion() {
  return localStorage.getItem('appVersion') || '1.0.0'
}

/**
 * Зберегти версію в localStorage
 */
export function setLocalVersion(version) {
  localStorage.setItem('appVersion', version)
}

/**
 * Ініціалізувати версію — завжди синхронізувати з БД
 */
export async function initializeVersion() {
  try {
    const remoteVersion = await getLatestVersion()
    
    if (remoteVersion) {
      setLocalVersion(remoteVersion)
    }
  } catch (error) {
    console.error('Помилка при ініціалізації версії:', error)
  }
}

/**
 * Перевірити чи є оновлення доступні
 */
export async function checkForUpdates() {
  try {
    const localVersion = getLocalVersion()
    const remoteVersion = await getLatestVersion()
    
    const hasUpdate = remoteVersion && localVersion !== remoteVersion
    
    return {
      hasUpdate,
      localVersion,
      remoteVersion
    }
  } catch (error) {
    console.error('Помилка при перевірці оновлень:', error)
    return {
      hasUpdate: false,
      localVersion: getLocalVersion(),
      remoteVersion: null
    }
  }
}
