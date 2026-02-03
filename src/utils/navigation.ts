/**
 * Отримати базовий шлях з import.meta.env.BASE_URL
 * Це автоматично встановлюється Vite залежно від конфігу
 */
export function getBasePath(): string {
  return import.meta.env.BASE_URL || '/'
}

/**
 * Навігувати на кореневу сторінку
 */
export function navigateToHome(): void {
  const basePath = getBasePath()
  window.location.href = basePath
}

/**
 * Навігувати на будь-який шлях, додаючи базовий path
 */
export function navigateTo(path: string): void {
  const basePath = getBasePath()
  const fullPath = basePath === '/' ? path : `${basePath.replace(/\/$/, '')}${path}`
  window.location.href = fullPath
}
