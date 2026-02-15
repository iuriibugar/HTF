/**
 * TYPE DEFINITIONS for Service Contracts
 * TypeScript типи для serviceContracts.js і serviceValidationHelper.js
 */

// ============================================================================
// CONTRACTS - ОСНОВНІ ТИПИ
// ============================================================================

export interface FieldSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'date-time' | 'email' | 'uri'
  description?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  pattern?: string
  enum?: (string | number)[]
  default?: any
  format?: 'email' | 'uri' | 'date' | 'date-time'
  items?: FieldSchema
  properties?: Record<string, FieldSchema>
}

export interface RequestSchema {
  type: 'object'
  required?: string[]
  schema: Record<string, FieldSchema>
}

export interface ResponseSchema {
  type: 'object' | 'array' | 'boolean' | 'string' | 'number'
  schema?: Record<string, FieldSchema>
}

export interface ServiceContract {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description?: string
  request: RequestSchema | null
  response: ResponseSchema
  example: {
    request?: any
    response?: any
  }
}

export interface ServiceContracts {
  [action: string]: ServiceContract
}

// ============================================================================
// DONATION SERVICE - CONTRACTS
// ============================================================================

export interface DonationCreateRequest {
  amount: number
  currency: 'UAH' | 'USD' | 'EUR'
  description?: string
  donorName: string
  donorEmail: string
  status?: 'pending' | 'completed' | 'cancelled'
}

export interface DonationUpdateRequest {
  amount?: number
  currency?: 'UAH' | 'USD' | 'EUR'
  description?: string
  status?: 'pending' | 'completed' | 'cancelled'
}

export interface Donation extends DonationCreateRequest {
  id: string
  createdAt: string
  updatedAt: string
}

export const donationContracts: {
  getAll: ServiceContract
  create: ServiceContract
  update: ServiceContract
  delete: ServiceContract
}

// ============================================================================
// USER SERVICE - CONTRACTS
// ============================================================================

export interface TrainingStats {
  swimming: { registered: number }
  cycling: { registered: number }
  running: { registered: number }
  other: { registered: number }
}

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  firstName?: string
  lastName?: string
  phone?: string
  birthDate?: string
  gender?: 'male' | 'female' | 'other'
  city?: string
  address?: string
  postalDepartment?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  bio?: string
  photoURL?: string
  emailVerified?: boolean
  role: 'user' | 'admin'
  isApproved: boolean
  status: 'active' | 'inactive' | 'banned'
  amount?: number
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  specialization?: string
  registeredAt: string
  lastLoginAt: string
  loginCount: number
  notes?: string
  deletedAt?: string
  updatedAt: string
  trainingStats: TrainingStats
  subscriptions: any[]
}

export interface UserUpdateRequest {
  firstName?: string
  lastName?: string
  phone?: string
  birthDate?: string
  gender?: 'male' | 'female' | 'other'
  city?: string
  address?: string
  postalDepartment?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  bio?: string
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  specialization?: string
}

export const userContracts: {
  createOrUpdateProfile: ServiceContract
}

// ============================================================================
// REGISTRATION SERVICE - CONTRACTS
// ============================================================================

export interface RegistrationRequest {
  trainingType: 'swimming' | 'cycling' | 'running' | 'other'
  scheduleId: string
  trainingId?: string
  notes?: string
}

export interface Registration extends RegistrationRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhoto?: string
  registeredAt: string
}

export const registrationContracts: {
  register: ServiceContract
  getUserRegistrations: ServiceContract
  getScheduleRegistrations: ServiceContract
  getTrainingRegistrations: ServiceContract
  cancelRegistration: ServiceContract
}

// ============================================================================
// SCHEDULE SERVICE - CONTRACTS
// ============================================================================

export interface Training {
  id: string
  type: 'swimming' | 'cycling' | 'running' | 'other'
  date: string
  time: string
  duration: number
  instructor?: string
  location?: string
  maxParticipants?: number
  currentParticipants?: number
}

export interface ScheduleCreateRequest {
  weekStart: string
  weekEnd: string
  trainings: Training[]
}

export interface Schedule extends ScheduleCreateRequest {
  id: string
  createdAt: string
  createdBy: string
}

export const scheduleContracts: {
  getAll: ServiceContract
  getForWeek: ServiceContract
  create: ServiceContract
}

// ============================================================================
// AUTH SERVICE - CONTRACTS
// ============================================================================

export interface AuthUser {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified: boolean
}

export const authContracts: {
  getCurrentUser: ServiceContract
  logout: ServiceContract
}

// ============================================================================
// VERSION SERVICE - CONTRACTS
// ============================================================================

export interface VersionInfo {
  version: string
  updatedAt?: string
}

export interface VersionCheckResult {
  hasUpdate: boolean
  localVersion?: string
  remoteVersion?: string
}

export const versionContracts: {
  getLatest: ServiceContract
  update: ServiceContract
  checkUpdates: ServiceContract
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  data: Record<string, any>
  timestamp?: string
}

export interface ValidateRequestResult {
  isValid: boolean
  errors: string[]
  data: Record<string, any>
}

export interface ValidationBeforeSendResult {
  isValid: boolean
  validation: ValidationResult
  suggestions: string[]
  example: any
}

export interface ValidationFixSuggestions {
  errors: string[]
  suggestions: string[]
  example: any
}

export interface ValidationErrorType extends Error {
  name: 'ValidationError'
  errors: string[]
}

export interface MultiValidationRequest {
  serviceName: ServiceName
  action: string
  data?: Record<string, any>
}

export interface MultiValidationResult {
  isAllValid: boolean
  results: Array<{
    serviceName: ServiceName
    action: string
    validation: ValidationResult
  }>
  errors: Array<{
    serviceName: ServiceName
    action: string
    validation: ValidationResult
  }>
}

export interface DetailedExample {
  method: string
  path: string
  description?: string
  requestContract: RequestSchema | null
  responseContract: ResponseSchema
  example: {
    request?: any
    response?: any
  }
  summary: {
    requiredFields: string[]
    optionalFields: string[]
  }
}

export interface WithValidationContext {
  data: Record<string, any>
  validation: ValidationResult
  original: Record<string, any>
}

// ============================================================================
// SERVICE NAMES AND ACTIONS
// ============================================================================

export type ServiceName = 'donation' | 'user' | 'registration' | 'schedule' | 'auth' | 'version'

export type DonationAction = 'getAll' | 'create' | 'update' | 'delete'
export type UserAction = 'createOrUpdateProfile'
export type RegistrationAction = 'register' | 'getUserRegistrations' | 'getScheduleRegistrations' | 'getTrainingRegistrations' | 'cancelRegistration'
export type ScheduleAction = 'getAll' | 'getForWeek' | 'create'
export type AuthAction = 'getCurrentUser' | 'logout'
export type VersionAction = 'getLatest' | 'update' | 'checkUpdates'

// ============================================================================
// MAIN CONTRACT OBJECT
// ============================================================================

export interface Contracts {
  donation: typeof donationContracts
  user: typeof userContracts
  registration: typeof registrationContracts
  schedule: typeof scheduleContracts
  auth: typeof authContracts
  version: typeof versionContracts
}

// ============================================================================
// SERVICE CONTRACTS FUNCTIONS
// ============================================================================

/**
 * Валідувати запит за контрактом сервісу
 */
export function validateRequest(
  serviceName: ServiceName,
  action: string,
  requestData?: Record<string, any>
): ValidateRequestResult

/**
 * Отримати приклад запиту для дії
 */
export function getRequestExample(
  serviceName: ServiceName,
  action: string,
  requestOnly?: boolean
): any

/**
 * Отримати контракт дії
 */
export function getContract(
  serviceName: ServiceName,
  action: string
): ServiceContract | null

/**
 * Отримати список доступних сервісів
 */
export function getAvailableServices(): ServiceName[]

/**
 * Отримати список доступних дій для сервісу
 */
export function getAvailableActions(serviceName: ServiceName): string[]

/**
 * Валідувати дані за схемою
 */
export function validateRequestData(
  data: Record<string, any>,
  schema: Record<string, FieldSchema>,
  requiredFields?: string[]
): ValidationResult

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

export class ValidationError extends Error {
  constructor(message: string, errors?: string[])
  name: 'ValidationError'
  errors: string[]
}

/**
 * Результат валідації
 */
export class ValidationResult {
  isValid: boolean
  errors: string[]
  data: Record<string, any>
  timestamp: string

  isSuccess(): boolean
  getErrorMessage(): string
  getFirstError(): string | null
}

/**
 * Валідувати та обробити помилку
 */
export function validateAndHandle(
  serviceName: ServiceName,
  action: string,
  requestData?: Record<string, any>
): ValidationResult

/**
 * Обгорнути функцію з автоматичною валідацією
 */
export function withValidation<T>(
  serviceName: ServiceName,
  action: string,
  handler: (context: WithValidationContext) => Promise<T>
): (requestData?: Record<string, any>) => Promise<T>

/**
 * Логувати запит
 */
export function logRequest(
  serviceName: ServiceName,
  action: string,
  requestData?: Record<string, any>,
  verbose?: boolean
): any

/**
 * Пропонувати виправлення
 */
export function suggestFixesForValidation(
  serviceName: ServiceName,
  action: string,
  requestData?: Record<string, any>
): ValidationFixSuggestions

/**
 * Перевірити дані перед відправленням
 */
export function validateBeforeSend(
  serviceName: ServiceName,
  action: string,
  requestData?: Record<string, any>
): ValidationBeforeSendResult

/**
 * Конвертувати помилку у user-friendly повідомлення
 */
export function formatValidationError(
  error: ValidationError | Error,
  lang?: 'uk' | 'en'
): string

/**
 * Об'єднати кілька запитів у одну валідацію
 */
export function validateMultiple(
  requests: MultiValidationRequest[]
): MultiValidationResult

/**
 * Нормалізувати дані за контрактом
 */
export function normalizeData(
  serviceName: ServiceName,
  action: string,
  data?: Record<string, any>
): Record<string, any>

/**
 * Отримати детальний приклад
 */
export function getDetailedExample(
  serviceName: ServiceName,
  action: string
): DetailedExample | null

// ============================================================================
// EXPORT ALL CONTRACTS
// ============================================================================

export const contracts: Contracts
