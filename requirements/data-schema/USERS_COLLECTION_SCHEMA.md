# Структура колекції Users у Firestore

## 📋 Схема користувача

```javascript
// Firestore: users/{uid}
{
  // ═══════════════════════════════════════════════
  // ОСНОВНІ ДАНІ (від Google OAuth)
  // ═══════════════════════════════════════════════
  uid: string,                      // Унікальний ID (first name, зберігається у doc ID)
  email: string,                    // Email адреса (unique)
  displayName: string | null,       // Ім'я з Google
  photoURL: string | null,          // Фото профілю з Google
  
  // ═══════════════════════════════════════════════
  // КОНТРОЛЬ ДОСТУПУ
  // ═══════════════════════════════════════════════
  isApproved: boolean,              // Чи дозволено користувачу доступ (по замовчуванню false)
  role: 'admin' | 'user',           // Роль користувача
  
  // ═══════════════════════════════════════════════
  // ПЕРСОНАЛЬНА ІНФОРМАЦІЯ
  // ═══════════════════════════════════════════════
  firstName: string | null,         // Ім'я
  lastName: string | null,          // Прізвище
  phoneNumber: string | null,       // Номер телефону
  
  // ═══════════════════════════════════════════════
  // ІНФОРМАЦІЯ ПРО ТРИАТЛОН
  // ═══════════════════════════════════════════════
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | null,  // Рівень досвіду
  specialization: 'swimming' | 'cycling' | 'running' | 'all',        // Спеціалізація
  
  // ═══════════════════════════════════════════════
  // ДАНІ ПРО РЕЄСТРАЦІЮ
  // ═══════════════════════════════════════════════
  registeredAt: string,             // ISO дата реєстрації
  lastLoginAt: string,              // ISO дата останнього входу
  loginCount: number,               // Кількість входів
  
  // ═══════════════════════════════════════════════
  // ІНШІ ДАНІ
  // ═══════════════════════════════════════════════
  emailVerified: boolean,           // Чи підтвердив email
  status: 'active' | 'inactive' | 'blocked',  // Статус користувача
  notes: string | null,             // Примітки адміна про користувача
  
  // ═══════════════════════════════════════════════
  // СТАТИСТИКА
  // ═══════════════════════════════════════════════
  trainingRegistrationsCount: number,  // Кількість реєстрацій на тренування
  completedTrainings: number,          // Кількість завершених тренувань
  
  // ═══════════════════════════════════════════════
  // НАЛАШТУВАННЯ
  // ═══════════════════════════════════════════════
  notifications: {
    email: boolean,                 // Отримувати email повідомлення
    push: boolean,                  // Отримувати push повідомлення
    trainingReminders: boolean      // Нагадування про тренування
  },
  
  // ═══════════════════════════════════════════════
  // СИСТЕМА УПРАВЛІННЯ
  // ═══════════════════════════════════════════════
  updatedAt: string,                // ISO дата останнього оновлення
  updatedBy: string | null,         // UID адміна, який змінив профіль
  deletedAt: string | null,         // ISO дата видалення (null = активний)
}
```

---

## 📊 Приклад документа користувача

### Звичайний користувач

```javascript
{
  uid: "user123abc",
  email: "john.doe@gmail.com",
  displayName: "John Doe",
  photoURL: "https://lh3.googleusercontent.com/...",
  
  isApproved: true,                 // ✅ Дозволено
  role: "user",
  
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+380671234567",
  
  experienceLevel: "intermediate",
  specialization: "swimming",
  
  registeredAt: "2024-02-01T10:00:00Z",
  lastLoginAt: "2024-02-02T10:30:00Z",
  loginCount: 15,
  
  emailVerified: true,
  status: "active",
  notes: null,
  
  trainingRegistrationsCount: 12,
  completedTrainings: 10,
  
  notifications: {
    email: true,
    push: true,
    trainingReminders: true
  },
  
  updatedAt: "2024-02-02T10:30:00Z",
  updatedBy: null,
  deletedAt: null
}
```

### Адміністратор

```javascript
{
  uid: "admin456def",
  email: "admin@happytrifriends.com",
  displayName: "Admin User",
  photoURL: "https://lh3.googleusercontent.com/...",
  
  isApproved: true,                 // ✅ Дозволено
  role: "admin",                    // 👨‍💼 Адміністратор
  
  firstName: "Admin",
  lastName: "User",
  phoneNumber: "+380672000000",
  
  experienceLevel: "advanced",
  specialization: "all",
  
  registeredAt: "2024-01-01T10:00:00Z",
  lastLoginAt: "2024-02-02T14:30:00Z",
  loginCount: 250,
  
  emailVerified: true,
  status: "active",
  notes: "Основний адміністратор системи",
  
  trainingRegistrationsCount: 50,
  completedTrainings: 45,
  
  notifications: {
    email: true,
    push: true,
    trainingReminders: false
  },
  
  updatedAt: "2024-02-01T10:00:00Z",
  updatedBy: null,
  deletedAt: null
}
```

### Користувач без доступу (очікує одобрення)

```javascript
{
  uid: "user789ghi",
  email: "new.user@gmail.com",
  displayName: "New User",
  photoURL: null,
  
  isApproved: false,                // ❌ Очікує одобрення
  role: "user",
  
  firstName: null,
  lastName: null,
  phoneNumber: null,
  
  experienceLevel: null,
  specialization: "running",
  
  registeredAt: "2024-02-02T12:00:00Z",
  lastLoginAt: "2024-02-02T12:00:00Z",
  loginCount: 1,
  
  emailVerified: true,
  status: "active",
  notes: null,
  
  trainingRegistrationsCount: 0,
  completedTrainings: 0,
  
  notifications: {
    email: true,
    push: false,
    trainingReminders: false
  },
  
  updatedAt: "2024-02-02T12:00:00Z",
  updatedBy: null,
  deletedAt: null
}
```

---

## 🔑 Ключові поля

### Обов'язкові при реєстрації

- ✅ `uid` - з Firebase Auth
- ✅ `email` - з Firebase Auth
- ✅ `displayName` - з Firebase Auth (може бути null)
- ✅ `photoURL` - з Firebase Auth (може бути null)
- ✅ `isApproved` - завжди `false` при реєстрації
- ✅ `role` - завжди `"user"` при реєстрації
- ✅ `registeredAt` - час реєстрації
- ✅ `lastLoginAt` - час першого входу
- ✅ `loginCount` - завжди `1` при реєстрації
- ✅ `emailVerified` - з Firebase Auth
- ✅ `status` - `"active"`
- ✅ `updatedAt` - час реєстрації

### Опціональні при реєстрації

- ❌ `firstName`, `lastName`, `phoneNumber` - можна запросити у формі
- ❌ `experienceLevel`, `specialization` - можна запросити у формі
- ❌ `notes`, `deletedAt`, `updatedBy` - заповнює тільки адмін

---

## 📝 Дані для запиту у користувача при реєстрації

### Обов'язкові від Google
```javascript
// Отримуємо автоматично
{
  uid,
  email,
  displayName,
  photoURL,
  emailVerified
}
```

### Корисно запросити у формі
```javascript
// Пропонуємо заповнити
{
  firstName: string,            // Ім'я
  lastName: string,             // Прізвище
  phoneNumber: string,          // Номер телефону
  experienceLevel: enum,        // Рівень досвіду
  specialization: enum,         // Спеціалізація
  notifications: object         // Налаштування сповіщень
}
```

---

## 🔐 Правила доступу (Firestore Security Rules)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Користувачі можуть читати/писати тільки свій профіль
    match /users/{userId} {
      allow read: if request.auth.uid == userId || 
                     isAdmin(request.auth.uid);
      allow update: if request.auth.uid == userId ||
                       isAdmin(request.auth.uid);
      allow delete: if isAdmin(request.auth.uid);
      allow create: if request.auth.uid == userId;
    }
    
    // Функція для перевірки адміна
    function isAdmin(uid) {
      return get(/databases/$(database)/documents/users/$(uid))
        .data.role == 'admin';
    }
  }
}
```

---

## 📊 Поля за категоріями

### По замовчуванню (не потребує вибору користувача)
- `uid`
- `email`
- `displayName`
- `photoURL`
- `isApproved`
- `role`
- `registeredAt`
- `lastLoginAt`
- `loginCount`
- `emailVerified`
- `status`
- `updatedAt`
- `deletedAt`

### По бажанню користувача (у формі реєстрації)
- `firstName`
- `lastName`
- `phoneNumber`
- `experienceLevel`
- `specialization`
- `notifications`

### Тільки для адміна (в адміністративній панелі)
- `isApproved` (змінити на true/false)
- `role` (змінити з user на admin)
- `status` (змінити на blocked/inactive)
- `notes`
- `updatedBy`
