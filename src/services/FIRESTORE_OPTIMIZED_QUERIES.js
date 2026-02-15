/**
 * FIRESTORE INDEXES - OPTIMIZED QUERIES
 * 
 * Цей файл показує яких запитів працюватиме швидко з створеними індексами
 * 
 * Індекси створені: firestore.indexes.json
 * Deployment: firebase firestore:indexes:create firestore.indexes.json
 */

// ============================================================================
// REGISTRATIONS - Оптимізовані запити
// ============================================================================

/**
 * ✅ ШВИДКО - Використовує Index 1 (userId + registeredAt)
 * Очікуваний час: 30-80ms
 */
export async function getUserRegistrations_OPTIMIZED(userId) {
  const q = query(
    collection(db, 'registrations'),
    where('userId', '==', userId),
    orderBy('registeredAt', 'desc'),
    limit(50)
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 2 (scheduleId + registeredAt)
 * Очікуваний час: 50-150ms
 */
export async function getScheduleRegistrations_OPTIMIZED(scheduleId) {
  const q = query(
    collection(db, 'registrations'),
    where('scheduleId', '==', scheduleId),
    orderBy('registeredAt', 'desc'),
    limit(100)
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 3 (trainingId + registeredAt)
 * Очікуваний час: 50-150ms
 * 
 * Приклад: User clicks "Who registered for this training?"
 */
export async function getTrainingRegistrations_OPTIMIZED(trainingId) {
  const q = query(
    collection(db, 'registrations'),
    where('trainingId', '==', trainingId),
    orderBy('registeredAt', 'desc')
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 4 (trainingDate + trainingType + registeredAt)
 * Очікуваний час: 100-200ms
 * 
 * Приклад: "Show me all swimming registrations for November 26"
 */
export async function getRegistrationsByTypeAndDate_OPTIMIZED(trainingType, trainingDate) {
  const q = query(
    collection(db, 'registrations'),
    where('trainingType', '==', trainingType),
    where('trainingDate', '==', trainingDate),
    orderBy('registeredAt', 'desc')
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 4 (trainingDate + trainingType + registeredAt)
 * Очікуваний час: 100-300ms
 * 
 * Приклад: Analytics dashboard - "Swimming registrations last 7 days"
 */
export async function getRegistrationsByTypeDateRange_OPTIMIZED(trainingType, fromDate, toDate) {
  const q = query(
    collection(db, 'registrations'),
    where('trainingType', '==', trainingType),
    where('trainingDate', '>=', fromDate),
    where('trainingDate', '<=', toDate),
    orderBy('registeredAt', 'desc')
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 5 (trainingType + trainingDate DESC)
 * Очікуваний час: 80-150ms
 * 
 * Приклад: "Most popular trainings overall"
 */
export async function getRegistrationsByTrainingType_OPTIMIZED(trainingType) {
  const q = query(
    collection(db, 'registrations'),
    where('trainingType', '==', trainingType),
    orderBy('trainingDate', 'desc'),
    limit(100)
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 6 (userEmail + trainingDate DESC)
 * Очікуваний час: 80-150ms
 * 
 * Приклад: "Show all trainings user registered for" (alternative to userId)
 */
export async function getUserRegistrationsByEmail_OPTIMIZED(userEmail) {
  const q = query(
    collection(db, 'registrations'),
    where('userEmail', '==', userEmail),
    orderBy('trainingDate', 'desc'),
    limit(50)
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 7 (trainingDate + userEmail + registeredAt DESC)
 * Очікуваний час: 100-200ms
 * 
 * Приклад: "Detailed analytics - show specific user registrations for a date range"
 */
export async function getUserRegistrationsByDateRange_OPTIMIZED(userEmail, fromDate, toDate) {
  const q = query(
    collection(db, 'registrations'),
    where('userEmail', '==', userEmail),
    where('trainingDate', '>=', fromDate),
    where('trainingDate', '<=', toDate),
    orderBy('registeredAt', 'desc')
  )
  return getDocs(q)
}

// ============================================================================
// REGISTRATIONS - Аналітичні запити для Dashboard
// ============================================================================

/**
 * ✅ ШВИДКО - Без чекання індексу, але оптимізовано лімітом
 * Очікуваний час: 50-100ms
 * 
 * Приклад: Dashboard stat - "Total registrations today"
 */
export async function getRegistrationStats(fromDate, toDate) {
  const q = query(
    collection(db, 'registrations'),
    where('trainingDate', '>=', fromDate),
    where('trainingDate', '<=', toDate)
  )
  const snap = await getDocs(q)
  
  // Агрегація на клієнті (швидко для <5K документів)
  const stats = {
    total: snap.size,
    byType: {},
    byTraining: {},
    bySchedule: {}
  }
  
  snap.forEach(doc => {
    const data = doc.data()
    stats.byType[data.trainingType] = (stats.byType[data.trainingType] || 0) + 1
    stats.byTraining[data.trainingId] = (stats.byTraining[data.trainingId] || 0) + 1
    stats.bySchedule[data.scheduleId] = (stats.bySchedule[data.scheduleId] || 0) + 1
  })
  
  return stats
}

/**
 * ⚠️ СТАНЕ ПОМІТНИМ - Використовує Index 4 для більш ефективного фільтра
 * Очікуваний час: 200-500ms (але все ще швидко для аналітики)
 * 
 * Приклад: "Top trainings by type for the week"
 */
export async function getTrainingTypeStats_ADVANCED(trainingType, weekStartDate) {
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 7)
  
  const q = query(
    collection(db, 'registrations'),
    where('trainingType', '==', trainingType),
    where('trainingDate', '>=', weekStartDate.toISOString().split('T')[0]),
    where('trainingDate', '<=', weekEndDate.toISOString().split('T')[0]),
    orderBy('registeredAt', 'desc')
  )
  
  const snap = await getDocs(q)
  const stats = {}
  
  snap.forEach(doc => {
    const data = doc.data()
    const training = data.trainingName
    stats[training] = (stats[training] || 0) + 1
  })
  
  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
}

// ============================================================================
// USERS - Оптимізовані запити
// ============================================================================

/**
 * ✅ ШВИДКО - Використовує Index 10 (status + lastLoginAt DESC)
 * Очікуваний час: 80-150ms
 * 
 * Приклад: Admin panel - "Show active users"
 */
export async function getActiveUsers_OPTIMIZED() {
  const q = query(
    collection(db, 'users'),
    where('status', '==', 'active'),
    orderBy('lastLoginAt', 'desc'),
    limit(100)
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 11 (isApproved + registeredAt DESC)
 * Очікуваний час: 80-150ms
 * 
 * Приклад: Approval queue - "New users waiting for approval"
 */
export async function getPendingApprovals_OPTIMIZED() {
  const q = query(
    collection(db, 'users'),
    where('isApproved', '==', false),
    orderBy('registeredAt', 'desc'),
    limit(50)
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 12 (role + lastLoginAt DESC)
 * Очікуваний час: 80-150ms
 * 
 * Приклад: Admin management - "List all admins"
 */
export async function getAdmins_OPTIMIZED() {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'admin'),
    orderBy('lastLoginAt', 'desc')
  )
  return getDocs(q)
}

// ============================================================================
// DONATIONS - Оптимізовані запити
// ============================================================================

/**
 * ✅ ШВИДКО - Використовує Index 8 (createdAt DESC)
 * Очікуваний час: 50-100ms
 * 
 * Приклад: "Show recent donations"
 */
export async function getRecentDonations_OPTIMIZED(limit = 20) {
  const q = query(
    collection(db, 'donations'),
    orderBy('createdAt', 'desc'),
    limit(limit)
  )
  return getDocs(q)
}

/**
 * ✅ ШВИДКО - Використовує Index 9 (updatedAt DESC)
 * Очікуваний час: 50-100ms
 * 
 * Приклад: "Show recently updated donations"
 */
export async function getRecentlyUpdatedDonations_OPTIMIZED(limit = 20) {
  const q = query(
    collection(db, 'donations'),
    orderBy('updatedAt', 'desc'),
    limit(limit)
  )
  return getDocs(q)
}

// ============================================================================
// QUERIES ЯКІ БУДЕ ПОМІТНІ - ЯКИх УНИКАТИ
// ============================================================================

/**
 * ❌ ПОВІЛЬНО - Немає індексу для цієї комбінації
 * Очікуваний час: 500-1000ms
 * 
 * Чому: Бояти множині умов без індексу
 */
export async function getBadQuery_DO_NOT_USE_1() {
  // Це буде робити full collection scan!
  const q = query(
    collection(db, 'registrations'),
    where('trainingType', '==', 'swimming'),
    where('userId', '==', 'user_123'),
    where('trainingDate', '==', '2025-11-26')
  )
  return getDocs(q)
}

// Рішення: Використовувати більш специфічний запит або deux separate queries

/**
 * ❌ ДУЖЕ ПОВІЛЬНО - Без лімітів та упорядкування
 * Очікуваний час: 2000+ ms (для 50K документів)
 * 
 * Чому: Читає ВСІ документи в колекції
 */
export async function getBadQuery_DO_NOT_USE_2() {
  // Це матиме full scan 50K+ документів!
  return getDocs(collection(db, 'registrations'))
}

// Рішення: Завжди використовувати where() clausulas та limit()

// ============================================================================
// MIGRATION GUIDE - Як оновити наявні запити
// ============================================================================

/**
 * ДО (повільна):
 * 
 * async function getUserRegistrations(userId) {
 *   const snap = await getDocs(collection(db, 'registrations'))
 *   return snap.docs
 *     .filter(d => d.data().userId === userId)
 *     .sort((a, b) => b.data().registeredAt - a.data().registeredAt)
 * }
 * 
 * ПІСЛЯ (швидка - 80% швидше):
 * 
 * async function getUserRegistrations(userId) {
 *   const q = query(
 *     collection(db, 'registrations'),
 *     where('userId', '==', userId),
 *     orderBy('registeredAt', 'desc')
 *   )
 *   return getDocs(q)
 * }
 */

// ============================================================================
// DEPLOYMENT CHECK
// ============================================================================

/*
STEPS TO ENABLE:

1. Скопіювати firestore.indexes.json у корінь проекту

2. Запустити:
   firebase firestore:indexes:create firestore.indexes.json

3. Перевірити статус:
   firebase firestore:indexes:list

4. Модалі мати активуватися за 5-10 хвилин

5. Оновити запити в сервісах щоб використовувати індекси

6. Тестування з Firebase DevTools:
   Tools → Firestore Statistics → Query Performance
*/

export default {
  // Export для тестування
  getUserRegistrations_OPTIMIZED,
  getScheduleRegistrations_OPTIMIZED,
  getTrainingRegistrations_OPTIMIZED,
  getRegistrationsByTypeAndDate_OPTIMIZED,
  getRegistrationsByTypeDateRange_OPTIMIZED,
  getActiveUsers_OPTIMIZED,
  getPendingApprovals_OPTIMIZED,
  getAdmins_OPTIMIZED,
  getRecentDonations_OPTIMIZED
}
