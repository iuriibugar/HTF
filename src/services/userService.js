import { db, auth } from '@/firebase'
import { collection, doc, setDoc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore'

// Список email адміністраторів (замовчувані адміни)
const ADMIN_EMAILS = [
  'kulikalovdenis@gmail.com',
  'bugary20@gmail.com',
]

/**
 * Створити/оновити профіль користувача при реєстрації
 * @param {string} uid - User ID з Firebase Auth
 * @param {Object} additionalData - додаткові дані від користувача
 */
export async function createOrUpdateUserProfile(uid, additionalData = {}) {
  try {
    const user = auth.currentUser
    
    if (!user) {
      throw new Error('Користувач не авторизований')
    }
    
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)
    
    // Визначаємо чи користувач адмін за email
    const isAdminUser = ADMIN_EMAILS.includes(user.email || '')
    
    // При першому вході - СТВОРЮЄМО новий профіль
    if (!userDoc.exists()) {
      const userData = {
        uid: uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        
        // Контроль доступу
        isApproved: isAdminUser ? true : false,
        role: isAdminUser ? 'admin' : 'user',
        
        // Дані про реєстрацію
        emailVerified: user.emailVerified || false,
        status: 'active',
        
        // Віртуальні монети (для платежів, підписок, реєстрацій)
        amount: 0,
        
        // Налаштування
        notifications: {
          email: additionalData.notifications?.email ?? true,
          push: additionalData.notifications?.push ?? false,
          trainingReminders: additionalData.notifications?.trainingReminders ?? true
        },
        
        // Персональні дані
        firstName: additionalData.firstName || null,
        lastName: additionalData.lastName || null,
        phone: additionalData.phone || null,
        birthDate: additionalData.birthDate || null,
        gender: additionalData.gender || null,
        city: additionalData.city || null,
        address: additionalData.address || null,
        postalDepartment: additionalData.postalDepartment || null,
        emergencyContactName: additionalData.emergencyContactName || null,
        emergencyContactPhone: additionalData.emergencyContactPhone || null,
        phoneNumber: additionalData.phoneNumber || null,
        bio: additionalData.bio || null,
        experienceLevel: additionalData.experienceLevel || null,
        specialization: additionalData.specialization || null,
        
        // Системні дані
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1,
        notes: null,
        deletedAt: null,
        updatedAt: new Date().toISOString(),
        
        // Статистика тренувань
        trainingStats: {
          swimming: { registered: 0 },
          cycling: { registered: 0 },
          running: { registered: 0 },
          other: { registered: 0 }
        }
      }
      
      // Зберігаємо новий профіль
      await setDoc(userRef, userData, { merge: false })
      
      return userData
    } else {
      // При повторному вході - ОНОВЛЮЄМО ТІЛЬКИ останній вхід і кількість входів
      const existingData = userDoc.data()
      const updateData = {
        lastLoginAt: new Date().toISOString(),
        loginCount: (existingData.loginCount || 0) + 1,
        updatedAt: new Date().toISOString()
      }
      
      // Оновлюємо ТІЛЬКИ поля останнього входу, всі інші дані залишаються
      await setDoc(userRef, updateData, { merge: true })
      
      // Повертаємо оновлені дані з DB
      return { ...existingData, ...updateData }
    }
  } catch (error) {
    console.error('Помилка при создании/обновлении профиля:', error)
    throw error
  }
}

/**
 * Отримати профіль користувача
 * @param {string} uid - User ID
 */
export async function getUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    
    if (userDoc.exists()) {
      const profileData = { id: userDoc.id, ...userDoc.data() }
      return profileData
    } else {
      return null
    }
  } catch (error) {
    console.error('Помилка завантаження профілю:', error)
    throw error
  }
}

/**
 * Оновити дозвіл доступу користувача (только для адміна)
 * @param {string} uid - User ID
 * @param {boolean} isApproved - дозвіл на доступ
 * @param {string} adminUid - UID адміна, який змінює
 */
export async function approveUser(uid, isApproved, adminUid) {
  try {
    const userRef = doc(db, 'users', uid)
    
    await updateDoc(userRef, {
      isApproved: isApproved,
      updatedAt: new Date().toISOString(),
      updatedBy: adminUid
    })
    
    return true
  } catch (error) {
    console.error('Помилка при одобренні користувача:', error)
    throw error
  }
}

/**
 * Змінити роль користувача (только для адміна)
 * @param {string} uid - User ID
 * @param {string} role - нова роль ('user' або 'admin')
 * @param {string} adminUid - UID адміна, який змінює
 */
export async function changeUserRole(uid, role, adminUid) {
  try {
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Невідома роль')
    }
    
    const userRef = doc(db, 'users', uid)
    
    await updateDoc(userRef, {
      role: role,
      updatedAt: new Date().toISOString(),
      updatedBy: adminUid
    })
    
    return true
  } catch (error) {
    console.error('Помилка при зміні ролі:', error)
    throw error
  }
}

/**
 * Змінити статус користувача (только для адміна)
 * @param {string} uid - User ID
 * @param {string} status - новий статус ('active', 'inactive', 'blocked')
 * @param {string} adminUid - UID адміна, який змінює
 */
export async function changeUserStatus(uid, status, adminUid) {
  try {
    if (!['active', 'inactive', 'blocked'].includes(status)) {
      throw new Error('Невідомий статус')
    }
    
    const userRef = doc(db, 'users', uid)
    
    await updateDoc(userRef, {
      status: status,
      updatedAt: new Date().toISOString(),
      updatedBy: adminUid
    })
    
    return true
  } catch (error) {
    console.error('Помилка при зміні статусу:', error)
    throw error
  }
}

/**
 * Отримати всіх користувачів (только для адміна)
 */
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'users')))
    
    const users = []
    querySnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() })
    })
    
    // Сортуємо за датою реєстрації (новіші спочатку)
    return users.sort((a, b) => {
      return new Date(b.registeredAt) - new Date(a.registeredAt)
    })
  } catch (error) {
    console.error('Помилка завантаження користувачів:', error)
    throw error
  }
}

/**
 * Отримати користувачів, очікуючих одобрення
 */
export async function getPendingUsers() {
  try {
    const q = query(collection(db, 'users'), where('isApproved', '==', false))
    const querySnapshot = await getDocs(q)
    
    const users = []
    querySnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() })
    })
    
    return users.sort((a, b) => {
      return new Date(a.registeredAt) - new Date(b.registeredAt)  // Старіші спочатку
    })
  } catch (error) {
    console.error('Помилка завантаження очікуючих користувачів:', error)
    throw error
  }
}

/**
 * Отримати всіх адміністраторів
 */
export async function getAdmins() {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'admin'))
    const querySnapshot = await getDocs(q)
    
    const admins = []
    querySnapshot.forEach(doc => {
      admins.push({ id: doc.id, ...doc.data() })
    })
    
    return admins
  } catch (error) {
    console.error('Помилка завантаження адміністраторів:', error)
    throw error
  }
}

/**
 * Обновити профіль користувача (сам користувач)
 * @param {string} uid - User ID
 * @param {Object} updateData - дані для обновлення
 */
export async function updateUserProfile(uid, updateData) {
  try {
    const userRef = doc(db, 'users', uid)
    
    // Дозволяємо оновлювати тільки певні поля
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'birthDate',
      'gender',
      'city',
      'address',
      'postalDepartment',
      'emergencyContactName',
      'emergencyContactPhone',
      'experienceLevel',
      'specialization',
      'bio',
      'phoneNumber',
      'notifications'
    ]
    
    const filteredData = {}
    
    allowedFields.forEach(field => {
      if (field in updateData) {
        filteredData[field] = updateData[field]
      }
    })
    
    filteredData.updatedAt = new Date().toISOString()
    
    // Використовуємо setDoc з merge: true замість updateDoc
    // Це дозволяє створити документ якщо його немає
    await setDoc(userRef, filteredData, { merge: true })
    
    return true
  } catch (error) {
    console.error('Помилка при обновленні профілю:', error)
    throw error
  }
}

/**
 * Додати коментар адміна про користувача
 * @param {string} uid - User ID
 * @param {string} notes - коментар
 * @param {string} adminUid - UID адміна
 */
export async function addAdminNotes(uid, notes, adminUid) {
  try {
    const userRef = doc(db, 'users', uid)
    
    await updateDoc(userRef, {
      notes: notes,
      updatedAt: new Date().toISOString(),
      updatedBy: adminUid
    })
    
    return true
  } catch (error) {
    console.error('Помилка при добавленні коментарю:', error)
    throw error
  }
}

/**
 * Оновити баланс користувача
 * @param {string} uid - User ID
 * @param {number} amount - нова сума балансу
 * @param {string} adminUid - UID адміна
 * @param {object} discountInfo - інформація про знижку (опціонально)
 */
export async function updateUserBalance(uid, amount, adminUid, discountInfo = null) {
  try {
    const userRef = doc(db, 'users', uid)
    
    const updateData = {
      amount: Math.max(0, parseFloat(amount) || 0), // Не дозволяємо негативний баланс
      balanceUpdatedAt: new Date().toISOString(),
      balanceUpdatedBy: adminUid,
      updatedAt: new Date().toISOString()
    }

    // Знижка записується як окремо поле, не впливає на баланс
    if (discountInfo && discountInfo.percent > 0) {
      updateData.discount = {
        percent: discountInfo.percent,
        appliedAt: new Date().toISOString(),
        appliedBy: adminUid,
        previousAmount: discountInfo.previousAmount
      }
    }
    
    await setDoc(userRef, updateData, { merge: true })
    
    return true
  } catch (error) {
    console.error('Помилка при оновленні балансу:', error)
    throw error
  }
}

/**
 * Видалити користувача (soft delete - помічуємо як видаленого)
 * @param {string} uid - User ID
 * @param {string} adminUid - UID адміна
 */
export async function deleteUser(uid, adminUid) {
  try {
    const userRef = doc(db, 'users', uid)
    
    await updateDoc(userRef, {
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: adminUid,
      status: 'inactive'
    })
    
    return true
  } catch (error) {
    console.error('Помилка при видаленні користувача:', error)
    throw error
  }
}

/**
 * Перевірити чи користувач має доступ
 * @param {string} uid - User ID
 */
export async function isUserApproved(uid) {
  try {
    const userProfile = await getUserProfile(uid)
    
    if (!userProfile) {
      return false
    }
    
    return userProfile.isApproved === true && userProfile.status === 'active'
  } catch (error) {
    console.error('Помилка при перевірці доступу:', error)
    return false
  }
}

/**
 * Отримати статистику користувачів
 */
export async function getUsersStatistics() {
  try {
    const allUsers = await getAllUsers()
    
    const stats = {
      total: allUsers.length,
      approved: allUsers.filter(u => u.isApproved).length,
      pending: allUsers.filter(u => !u.isApproved).length,
      admins: allUsers.filter(u => u.role === 'admin').length,
      active: allUsers.filter(u => u.status === 'active').length,
      blocked: allUsers.filter(u => u.status === 'blocked').length
    }
    
    return stats
  } catch (error) {
    console.error('Помилка при отримані статистики:', error)
    throw error
  }
}

/**
 * Зареєструвати нового користувача при реєстрації (без авторизації)
 * @param {Object} userData - Дані користувача
 * @param {string} userData.uid - User ID з Firebase Auth
 * @param {string} userData.email - Email з Google
 * @param {string} userData.displayName - Ім'я з Google
 * @param {string} userData.photoURL - Фото з Google
 * @param {Object} userData.additionalData - Додаткові дані з форми
 */
export async function registerNewUser(userData) {
  try {
    const { uid, email, displayName, photoURL, additionalData = {} } = userData
    
    if (!uid || !email) {
      throw new Error('UID та Email є обов\'язковими')
    }
    
    // Визначаємо чи користувач адмін за email
    const isAdminUser = ADMIN_EMAILS.includes(email || '')
    
    // Записуємо дані нового користувача в Firestore
    const userRef = doc(db, 'users', uid)
    
    const newUserData = {
      // Базові дані з Google та форми
      uid: uid,
      email: email,
      displayName: displayName || null,
      photoURL: photoURL || null,
      
      // Контроль доступу
      isApproved: isAdminUser ? true : false,
      role: isAdminUser ? 'admin' : 'user',
      status: 'active',
      
      // Дані з форми реєстрації
      firstName: additionalData.firstName || undefined,
      lastName: additionalData.lastName || undefined,
      phone: additionalData.phone || undefined,
      city: additionalData.city || undefined,
      experienceLevel: additionalData.experienceLevel || undefined,
      bio: additionalData.bio || undefined,
      
      // Налаштування
      notifications: {
        email: true,
        push: false,
        trainingReminders: true
      },
      
      // Дати
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Системні дані
      emailVerified: false,
      loginCount: 1,
      notes: null,
      deletedAt: null,
      
      // Віртуальні монети (для платежів, підписок, реєстрацій)
      amount: 0,
      
      // Інформація про триатлон
      trainingStats: {
        swimming: { registered: 0 },
        cycling: { registered: 0 },
        running: { registered: 0 },
        other: { registered: 0 }
      }
    }
    
    // Видаляємо поля з undefined значеннями
    Object.keys(newUserData).forEach(key => {
      if (newUserData[key] === undefined) {
        delete newUserData[key]
      }
    })
    
    // Записуємо в Firestore
    await setDoc(userRef, newUserData)
    
    return newUserData
  } catch (error) {
    console.error('Помилка при реєстрації користувача:', error)
    throw error
  }
}
