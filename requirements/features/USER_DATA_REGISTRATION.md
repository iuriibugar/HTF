# Дані користувача при реєстрації через Google

## Отримані дані від Firebase Auth (Google OAuth)

При успішному логіну через Google за допомогою `signInWithPopup()`, Firebase повертає об'єкт користувача з наступними полями:

```javascript
// Отримані дані від Firebase
const result = await signInWithPopup(auth, googleProvider)
const user = result.user

// Доступні властивості користувача:
{
  uid: string,                    // Унікальний ID користувача в Firebase
  email: string,                  // Email адреса (наприклад: user@gmail.com)
  displayName: string | null,     // Ім'я користувача (з профілю Google)
  photoURL: string | null,        // URL до фото профілю користувача
  emailVerified: boolean,         // Чи підтвердив користувач email
  isAnonymous: boolean,           // Чи анонімний користувач (завжди false для Google)
  metadata: {
    createdAt: string,            // ISO дата першої реєстрації
    lastSignInTime: string        // ISO дата останнього входу
  },
  providerData: Array,            // Список провайдерів (Google в нашому випадку)
  phoneNumber: string | null,     // Номер телефону (якщо доступно)
  tenantId: string | null,        // ID тенанта (null за замовчуванням)
}
```

---

## Дані, які ми зберігаємо у Firestore

### При реєстрації на тренування
```javascript
// registrationService.js → registerForTraining()
{
  userId: auth.currentUser.uid,                              // ID користувача
  userEmail: auth.currentUser.email,                         // Email адреса
  userName: auth.currentUser.displayName || email,           // Ім'я або email
  userPhoto: auth.currentUser.photoURL || null,              // Фото профілю
  registeredAt: new Date().toISOString(),                    // Час реєстрації
  
  // + додаткові дані про тренування (передаються як параметр)
  trainingId: string,
  scheduleId: string,
  trainingDate: string,
  trainingTime: string,
  trainingName: string
}
```

### При створенні розкладу
```javascript
// formSchedule.vue
{
  weekStart: string,
  weekEnd: string,
  trainings: Array,
  createdAt: new Date().toISOString(),
  createdBy: auth.currentUser?.email || 'unknown'  // Email автора
}
```

---

## Де використовуються ці дані у проекті

### 1. CabinetView.vue
```javascript
onAuthStateChanged(auth, (user) => {
  if (user) {
    userName.value = user.displayName || ''       // Ім'я в кабінеті
    userEmail.value = user.email || ''            // Email в кабінеті
    userPhoto.value = user.photoURL || ''         // Фото в кабінеті
    isAdmin.value = isAdminUser(user.email, ADMIN_EMAILS)  // Перевірка адміна
  }
})
```

### 2. TrainingRegistration.vue
```javascript
// Під час реєстрації на тренування
await registerForTraining({
  userId: auth.currentUser.uid,
  userEmail: auth.currentUser.email,
  userName: auth.currentUser.displayName || auth.currentUser.email,
  userPhoto: auth.currentUser.photoURL || null,
  // ...
})
```

### 3. htfHeader.vue
```javascript
onAuthStateChanged(auth, (user) => {
  if (user) {
    isAuthenticated.value = true
    userEmail.value = user.email              // Для перевірки прав адміна
  }
})
```

---

## Які дані НЕ отримуємо автоматично від Google

❌ Прізвище (окремо від displayName)  
❌ Номер телефону (якщо не вказаний у Google Account)  
❌ Адреса проживання  
❌ Дата народження  
❌ Інші особисті дані  

Ці дані можна отримати тільки якщо користувач їх поділився при настройці дозволів.

---

## Структура ADMIN_EMAILS

```javascript
// Перевіряємо чи користувач адмін за email
const ADMIN_EMAILS = [
  'kulikalovdenis@gmail.com',
  'bugary20@gmail.com',
]

// У authService.js
export function isAdminUser(userEmail, adminEmails) {
  return adminEmails.includes(userEmail || '')
}

// Використання
isAdmin.value = isAdminUser(user.email, ADMIN_EMAILS)
```

---

## Безпека та приватність

- ✅ Email заблокований - користувач не може змінити email
- ✅ UID генерується Firebase - унікальний і безпечний
- ✅ Password не зберігається - використовується OAuth 2.0
- ✅ Фото URL - публічне посилання від Google
- ✅ Display Name - може бути null, потребує обробки

---

## Потенціальні поля для розширення

Якщо в майбутньому потребуватиметься зберегти додаткові дані:

```javascript
// Можна створити окрему колекцію 'users' з розширеним профілем
{
  uid: auth.currentUser.uid,
  email: auth.currentUser.email,
  displayName: auth.currentUser.displayName,
  photoURL: auth.currentUser.photoURL,
  
  // Додаткові поля для збереження в Firestore
  createdAt: new Date().toISOString(),
  registrationType: 'google',
  notificationSettings: { /* ... */ },
  preferences: { /* ... */ }
}
```
