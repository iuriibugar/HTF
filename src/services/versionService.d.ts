export function getLatestVersion(): Promise<string | null>
export function updateVersionInDatabase(version: string): Promise<boolean>
export function getLocalVersion(): string
export function setLocalVersion(version: string): void
export interface UpdateCheckResult {
  hasUpdate: boolean
  localVersion: string
  remoteVersion: string | null
}
export function checkForUpdates(): Promise<UpdateCheckResult>
