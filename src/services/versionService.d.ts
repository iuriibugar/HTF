/**
 * Типи для сервісу версіонування
 */

export interface VersionInfo {
  version: string
  timestamp?: string
  notes?: string
}

export interface VersionService {
  getCurrentVersion(): string
  checkForNewVersion(): Promise<boolean>
  clearStorage(): void
  clearCookies(): void
  clearServiceWorkerCache(): Promise<void>
  updateApp(): Promise<void>
  subscribe(callback: (newVersion: string) => void): () => void
  startPeriodicCheck(): void
  stopPeriodicCheck(): void
}
