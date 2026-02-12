/**
 * Сервіс для моніторингу версій додатку
 * Порівнює BUILD_VERSION з збереженою в localStorage версією
 * Якщо відрізняються - показує поп-ап для оновлення
 */

// Версія додатку - БУДЬ-КОЛИ коли робите новий білд
const BUILD_VERSION = '1.0.1'
const VERSION_STORAGE_KEY = 'app-version'
const VERSION_CHECK_INTERVAL = 1 * 60 * 1000 // 5 хвилин

class VersionService {
  constructor() {
    this.currentVersion = BUILD_VERSION
    this.cachedVersion = null
    this.newVersionAvailable = false
    this.listeners = []
    this.checkTimeout = null
  }

  /**
   * Ініціалізує сервіс - перевіряє версію
   */
  initialize() {
    try {
      // Читаємо збережену версію
      this.cachedVersion = localStorage.getItem(VERSION_STORAGE_KEY)

      // Якщо це перший запуск (немає збереженої версії)
      if (!this.cachedVersion) {
        this.saveVersion()
        return
      }

      // Перевіряємо чи є нова версія
      if (this.cachedVersion !== this.currentVersion) {
        console.log(`🚀 Нова версія доступна! ${this.cachedVersion} → ${this.currentVersion}`)
        this.newVersionAvailable = true
        this.notifyListeners(this.currentVersion)
      }
    } catch (error) {
      console.error('Помилка при ініціалізації версії:', error)
    }
  }

  /**
   * Отримує поточну версію
   */
  getCurrentVersion() {
    return this.currentVersion
  }

  /**
   * Перевіряє чи є нова версія
   */
  checkForUpdate() {
    try {
      this.cachedVersion = localStorage.getItem(VERSION_STORAGE_KEY)

      if (this.cachedVersion && this.cachedVersion !== this.currentVersion) {
        console.log(`🚀 Нова версія доступна! ${this.cachedVersion} → ${this.currentVersion}`)
        this.newVersionAvailable = true
        this.notifyListeners(this.currentVersion)
        return true
      }

      return false
    } catch (error) {
      console.error('Помилка при перевірці версії:', error)
      return false
    }
  }

  /**
   * Зберігає поточну версію в localStorage
   */
  saveVersion() {
    try {
      localStorage.setItem(VERSION_STORAGE_KEY, this.currentVersion)
      this.cachedVersion = this.currentVersion
    } catch (error) {
      console.error('Помилка при збереженні версії:', error)
    }
  }

  /**
   * Очищує localStorage та sessionStorage
   */
  clearStorage() {
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch (error) {
      console.error('Помилка при очищенні сховища:', error)
    }
  }

  /**
   * Очищує cookies
   */
  clearCookies() {
    try {
      document.cookie.split(';').forEach((c) => {
        const eqIdx = c.indexOf('=')
        const name = eqIdx > -1 ? c.substr(0, eqIdx).trim() : c.trim()
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        }
      })
    } catch (error) {
      console.error('Помилка при очищенні cookies:', error)
    }
  }

  /**
   * Очищує Service Worker кеш
   */
  async clearServiceWorkerCache() {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      } catch (error) {
        console.error('Помилка при очищенні Service Worker кеш:', error)
      }
    }
  }

  /**
   * Оновлює додаток: очищує кеш, cookies та перезавантажує сторінку
   */
  async updateApp() {
    try {
      // Очищуємо Service Worker кеш
      await this.clearServiceWorkerCache()
      
      // Очищуємо localStorage та sessionStorage
      this.clearStorage()
      
      // Очищуємо cookies
      this.clearCookies()
      
      // Затримка перед перезавантаженням
      await new Promise(resolve => setTimeout(resolve, 200))

      // Перезавантажуємо сторінку з очищенням кеш
      window.location.reload(true)
    } catch (error) {
      console.error('Помилка при оновленні додатку:', error)
      window.location.reload(true)
    }
  }

  /**
   * Запускає періодичну перевірку версій
   */
  startPeriodicCheck() {
    // Першу перевірку робимо одразу
    this.checkForUpdate()

    // Потім перевіряємо периодично
    this.checkTimeout = setInterval(() => {
      this.checkForUpdate()
    }, VERSION_CHECK_INTERVAL)
  }

  /**
   * Зупиняє періодичну перевірку
   */
  stopPeriodicCheck() {
    if (this.checkTimeout) {
      clearInterval(this.checkTimeout)
      this.checkTimeout = null
    }
  }

  /**
   * Підписує слухача на новини про версію
   */
  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback)
    }
  }

  /**
   * Повідомляє всіх слухачів про нову версію
   */
  notifyListeners(newVersion) {
    this.listeners.forEach((callback) => callback(newVersion))
  }
}

export default new VersionService()
