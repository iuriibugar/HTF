
/**
 * Типи для userService.js
 */

interface UserNotifications {
  email?: boolean
  push?: boolean
  trainingReminders?: boolean
}

interface TrainingStats {
  registered: number
  completed: number
}

interface TrainingStatistics {
  swimming: TrainingStats
  cycling: TrainingStats
  running: TrainingStats
  other: TrainingStats
}

interface AdditionalUserData {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  experienceLevel?: string
  specialization?: string
  notifications?: UserNotifications
}

interface UserProfile {
  id?: string
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  
  // Контроль доступу
  isApproved: boolean
  role: 'user' | 'admin'
  
  // Персональна інформація
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  
  // Інформація про триатлон
  experienceLevel: string | null
  specialization: string
  
  // Дані про реєстрацію
  emailVerified: boolean
  status: 'active' | 'inactive' | 'blocked'
  notes: string | null
  
  // Статистика тренувань по видах
  trainingStats: TrainingStatistics
  
  // Налаштування
  notifications: UserNotifications
  
  // Системні дані
  registeredAt: string
  lastLoginAt: string
  loginCount: number
  updatedAt: string
  updatedBy: string | null
  deletedAt: string | null
}

interface UsersStatistics {
  total: number
  approved: number
  pending: number
  admins: number
  active: number
  blocked: number
}

declare function createOrUpdateUserProfile(
  uid: string,
  additionalData?: AdditionalUserData
): Promise<Partial<UserProfile>>

declare function getUserProfile(
  uid: string
): Promise<UserProfile | null>

declare function approveUser(
  uid: string,
  isApproved: boolean,
  adminUid: string
): Promise<boolean>

declare function changeUserRole(
  uid: string,
  role: 'user' | 'admin',
  adminUid: string
): Promise<boolean>

declare function changeUserStatus(
  uid: string,
  status: 'active' | 'inactive' | 'blocked',
  adminUid: string
): Promise<boolean>

declare function getAllUsers(): Promise<UserProfile[]>

declare function getPendingUsers(): Promise<UserProfile[]>

declare function getAdmins(): Promise<UserProfile[]>

declare function updateUserProfile(
  uid: string,
  updateData: Partial<AdditionalUserData>
): Promise<boolean>

declare function addAdminNotes(
  uid: string,
  notes: string,
  adminUid: string
): Promise<boolean>

declare function deleteUser(
  uid: string,
  adminUid: string
): Promise<boolean>

declare function isUserApproved(
  uid: string
): Promise<boolean>

declare function getUsersStatistics(): Promise<UsersStatistics>

export {
  UserNotifications,
  AdditionalUserData,
  UserProfile,
  UsersStatistics,
  createOrUpdateUserProfile,
  getUserProfile,
  approveUser,
  changeUserRole,
  changeUserStatus,
  getAllUsers,
  getPendingUsers,
  getAdmins,
  updateUserProfile,
  ADMIN_EMAILS,
  addAdminNotes,
  deleteUser,
  isUserApproved,
  getUsersStatistics
}
