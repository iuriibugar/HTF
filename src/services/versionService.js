/**
 * Сервіс для моніторингу версій додатку
 * Перевіряє чи доступна нова версія та повідомляє користувача
 */

// Версія додатку - ЦІННІСТЬ ВЕРСІЯ З ЯКОЮ ЙОГ ЗБУДОВАНА
// Змінюйте тільки public/version.json при деплої!
const BUILD_VERSION = '1.0.9'
const VERSION_CHECK_INTERVAL = 5 * 60 * 1000 // 5 хвилин
const VERSION_INFO_FILE = '/version.json'

class VersionService {
  constructor() {
    this.currentVersion = BUILD_VERSION
    this.newVersionAvailable = false
    this.listeners = []
    this.checkTimeout = null
  }

  /**
   * Отримує поточну версію
   */
  getCurrentVersion() {
    return this.currentVersion
  }

  /**
   * Перевіряє версію на сервері
   */
  async checkForNewVersion() {
    try {
      // Cache-busting: додаємо timestamp до URL, щоб браузер не використовував кеш
      const timestamp = new Date().getTime()
      const versionUrl = `${VERSION_INFO_FILE}?t=${timestamp}`
      
      const response = await fetch(versionUrl, {
        cache: 'no-store', // Не використовуємо кеш
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (!response.ok) {
        console.warn('Не вдалось отримати інформацію про версію')
        return false
      }

      const versionData = await response.json()
      const serverVersion = versionData.version

      console.log(`📋 Перевірка версії: Поточна=${this.currentVersion}, На сервері=${serverVersion}`)

      if (serverVersion && serverVersion !== this.currentVersion) {
        console.log(
          `🚀 Нова версія доступна! ${this.currentVersion} → ${serverVersion}`
        )
        this.newVersionAvailable = true
        this.notifyListeners(serverVersion)
        return true
      } else {
        console.log('✓ Версія актуальна')
      }

      return false
    } catch (error) {
      console.error('Помилка при перевірці версії:', error)
      return false
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
        console.log('Service Worker кеш очищена')
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
      console.log('🧹 Очищення кеш...')
      
      // 1. Очищуємо Service Worker кеш
      await this.clearServiceWorkerCache()

      // 2. Очищуємо localStorage та sessionStorage
      this.clearStorage()

      // 3. Очищуємо cookies
      this.clearCookies()

      console.log('✓ Кеш очищена. Перезавантаження сторінки...')
      
      // 4. Затримка перед перезавантаженням
      await new Promise(resolve => setTimeout(resolve, 200))

      // 5. Перезавантажуємо сторінку з очищенням кеш
      window.location.reload(true)
    } catch (error) {
      console.error('Помилка при оновленні додатку:', error)
      // Навіть якщо сталась помилка, перезавантажуємо
      window.location.reload(true)
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

  /**
   * Запускає періодичну перевірку версій
   */
  startPeriodicCheck() {
    // Першу перевірку робимо відразу
    this.checkForNewVersion()

    // Потім перевіряємо периодично
    this.checkTimeout = setInterval(() => {
      this.checkForNewVersion()
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
}

export default new VersionService()
