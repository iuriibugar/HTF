# Система управління користувачами

## Огляд

При авторизації користувача через Google OAuth, його дані автоматично зберігаються у колекції `users` в Firestore. Система включає контроль доступу через булеве поле `isApproved`, яке адміністратори можуть змінювати.

## Автоматичне зберігання при авторизації

### Потік даних

1. **Користувач натискає "Вхід через Google"** → Google OAuth Popup
2. **Firebase Auth** → Аутентифікує користувача та повертає user object
3. **authService.getCurrentUser()** → Викликає `createOrUpdateUserProfile()`
4. **userService.createOrUpdateUserProfile()** → Записує/оновлює документ у `users/{uid}`
5. **Маршрут** → Перевіряє `isApproved` перед доступом до защищених сторінок

### Код в authService.js

```javascript
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe()
      
      if (user) {
        try {
          // При вході користувача, зберігаємо/оновлюємо його дані у БД
          await createOrUpdateUserProfile(user.uid, {})
        } catch (error) {
          console.error('Помилка при збереженні профілю користувача:', error)
        }
      }
      
      resolve(user)
    }, reject)
  })
}
```

## Структура колекції users

### Документ користувача

```javascript
{
  // Базові дані від Google (auto-populated)
  uid: "abc123def456",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  
  // Контроль доступу (admin-only)
  isApproved: false,  // Нові користувачі мають false
  role: "user",       // "user" або "admin"
  status: "active",   // "active", "inactive", "blocked"
  
  // Персональна інформація (user input)
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+380123456789",
  
  // Триатлон інформація (user input)
  experienceLevel: "beginner", // "beginner", "intermediate", "advanced"
  specialization: "swimming",  // "all", "swimming", "cycling", "running"
  
  // Реєстрація
  emailVerified: true,
  registeredAt: "2024-01-15T10:30:00Z",
  lastLoginAt: "2024-01-20T15:45:00Z",
  loginCount: 5,
  
  // Статистика
  trainingRegistrationsCount: 3,
  completedTrainings: 1,
  
  // Налаштування
  notifications: {
    email: true,
    push: false,
    trainingReminders: true
  },
  
  // Управління (admin-only)
  notes: "Новий користувач, потребує перевірки",
  updatedAt: "2024-01-20T15:45:00Z",
  updatedBy: "admin-uid-123",
  deletedAt: null
}
```

## Контроль доступу

### Дозвіл доступу для звичайних користувачів

Перед доступом до `/user`, `/user/registration`, `/cabinet` маршрутів, система перевіряє:

```typescript
if (userProfile && userProfile.isApproved && userProfile.status === 'active') {
  // Доступ дозволено
} else if (!userProfile.isApproved) {
  // Показати повідомлення "Очікує одобрення адміном"
} else if (userProfile.status === 'blocked') {
  // Показати повідомлення "Ваш акаунт заблокований"
}
```

### Статус користувача в cabinets

У `CabinetView.vue` користувач бачить свій статус:

```vue
<div v-if="isApproved" class="px-3 py-1 bg-green-600/50 text-green-300 rounded-full text-xs font-semibold">
  ✓ Одобрено
</div>
<div v-else class="px-3 py-1 bg-yellow-600/50 text-yellow-300 rounded-full text-xs font-semibold">
  ⏳ Очікує одобрення
</div>
```

## Компонент управління користувачами

### UsersManager.vue

Розташування: `src/views/cabinet/admin/UsersManager.vue`

Адміни можуть:

1. **Переглядати список користувачів** з фільтрацією та пошуком
2. **Статистика**: загальна кількість, одобрено, очікує, адмінів, активних, заблокованих
3. **Одобрити користувача** (одноразово) → `isApproved = true`
4. **Заблокувати користувача** → `status = "blocked"` 
5. **Розблокувати користувача** → `status = "active"`
6. **Зробити адміном** → `role = "admin"` (з автоматичним одобренням)
7. **Переглядати деталі** → модальне вікно з всією інформацією
8. **Додавати коментарі** → `notes` поле для адміністративних нотаток

### Інтеграція в CabinetView

```vue
<button 
  @click="router.push('/admin/users')"
  :class="[..., activeSection === 'users-manager' ? 'active' : '']"
>
  👥 Управління користувачами
</button>
```

Маршрут: `/admin/users`

## Функції userService

### Для створення/оновлення профілю

```javascript
// При реєстрації/вході
await createOrUpdateUserProfile(uid, {
  firstName: "John",
  phoneNumber: "+380...",
  experienceLevel: "beginner",
  notifications: { email: true, ... }
})
```

### Для адміністраторів

```javascript
// Одобрити користувача
await approveUser(uid, true, adminUid)

// Змінити роль
await changeUserRole(uid, 'admin', adminUid)

// Змінити статус
await changeUserStatus(uid, 'blocked', adminUid)

// Додати коментар
await addAdminNotes(uid, 'Коментар', adminUid)

// Видалити (soft delete)
await deleteUser(uid, adminUid)

// Перевірити чи користувач має доступ
const hasAccess = await isUserApproved(uid)

// Отримати всіх користувачів
const allUsers = await getAllUsers()

// Отримати користувачів, очікуючих одобрення
const pendingUsers = await getPendingUsers()

// Отримати всіх адміністраторів
const admins = await getAdmins()

// Отримати статистику
const stats = await getUsersStatistics()
```

## Безпека

### Firestore Security Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Функції помічники
    function isAdmin(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role == 'admin';
    }
    
    function isOwnProfile(uid) {
      return request.auth.uid == uid;
    }
    
    // Колекція users
    match /users/{uid} {
      // Кожен користувач може читати свій профіль
      allow read: if isOwnProfile(uid);
      
      // Кожен користувач може оновлювати свій профіль
      // але тільки non-admin поля
      allow update: if isOwnProfile(uid) 
        && !request.resource.data.diff(resource.data).affectedKeys()
          .hasAny(['isApproved', 'role', 'status', 'notes', 'updatedBy']);
      
      // Адміни можуть читати, писати та оновлювати всі профілі
      allow read, write: if isAdmin(request.auth.uid);
      
      // Новий користувач при реєстрації
      allow create: if request.auth.uid == uid
        && request.resource.data.isApproved == false
        && request.resource.data.role == 'user';
    }
  }
}
```

## Залежності

### userService.js використовує

- `firebase/firestore` → setDoc, getDoc, updateDoc, getDocs, query, where
- `firebase.js` → db, auth (Firebase instances)

### Компоненти

- `UsersManager.vue` → userService
- `CabinetView.vue` → getUserProfile
- `router/index.ts` → getUserProfile

## План впровадження

1. ✅ Створено `userService.js` з функціями для управління користувачами
2. ✅ Інтегровано в `authService.js` → автоматичне збереження при вході
3. ✅ Оновлено router guard → перевірка `isApproved`
4. ✅ Оновлено `CabinetView.vue` → показ статусу користувача
5. ✅ Створено `UsersManager.vue` → інтерфейс управління для адмінів
6. ⏳ Розпорядити Firestore Security Rules (потім)
7. ⏳ Створити форму для вибору персональної інформації при реєстрації (потім)

## Приклад робочого сценарію

1. Новий користувач натискає "Вхід через Google"
2. Після авторизації його дані записуються в `users/{uid}` з `isApproved: false`
3. Користувач видить повідомлення "⏳ Очікує одобрення"
4. Адмін ходить на `/admin/users`, видить користувача в списку
5. Адмін натискає "Одобрити" → `isApproved: true`
6. Користувач може тепер доступити до `/user` маршрутів
7. Адмін може додати коментарій, блокувати, або зробити адміном за потребою

## Майбутні розширення

- Email нотифікації при одобренні/відхиленні
- Форма для введення персональної інформації при реєстрації
- SMS напередження про тренування
- Механізм експорту даних для користувача (GDPR)
- Аналітика активності користувачів
