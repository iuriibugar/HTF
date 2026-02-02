# Таблиця даних користувача при реєстрації

## 📊 Дані, отримані від Google

| Поле | Тип | Обов'язкове | Опис | Приклад |
|------|-----|-----------|------|---------|
| **uid** | string | ✅ | Унікальний ID користувача в Firebase | `"abc123xyz"` |
| **email** | string | ✅ | Email адреса користувача | `"user@gmail.com"` |
| **displayName** | string \| null | ❌ | Ім'я з профілю Google | `"John Doe"` або `null` |
| **photoURL** | string \| null | ❌ | URL до фото профілю | `"https://lh3.googleusercontent.com/..."` |
| **emailVerified** | boolean | ✅ | Чи підтверджено email | `true` |
| **isAnonymous** | boolean | ✅ | Чи анонімний | `false` |
| **phoneNumber** | string \| null | ❌ | Номер телефону | `"+38067..."` або `null` |
| **createdAt** | string | ✅ | ISO дата реєстрації | `"2024-02-02T10:00:00Z"` |
| **lastSignInTime** | string | ✅ | ISO дата останнього входу | `"2024-02-02T10:30:00Z"` |

---

## 📝 Дані, які ми зберігаємо у Firestore

### 🔐 registrations (реєстрація на тренування)

| Поле | Обов'язкове | Де беремо | Приклад |
|------|-----------|-----------|---------|
| **userId** | ✅ | `auth.currentUser.uid` | `"abc123xyz"` |
| **userEmail** | ✅ | `auth.currentUser.email` | `"user@gmail.com"` |
| **userName** | ✅ | `auth.currentUser.displayName \|\| email` | `"John Doe"` |
| **userPhoto** | ❌ | `auth.currentUser.photoURL \|\| null` | `"https://..."` або `null` |
| **registeredAt** | ✅ | `new Date().toISOString()` | `"2024-02-02T10:30:00Z"` |
| **trainingId** | ✅ | параметр функції | `"sched_001_2024-02-05_10:00"` |
| **scheduleId** | ✅ | параметр функції | `"sched_001"` |
| **trainingDate** | ✅ | параметр функції | `"2024-02-05"` |
| **trainingTime** | ✅ | параметр функції | `"10:00"` |
| **trainingName** | ✅ | параметр функції | `"Плавання"` |

---

## 📋 Дані, які ми показуємо у UI

### Кабінет користувача (CabinetView)

| Элемент UI | Джерело | Тип | Обов'язкове |
|-----------|--------|-----|-----------|
| Ім'я користувача | `user.displayName` | string | ❌ (показуємо email як fallback) |
| Email | `user.email` | string | ✅ |
| Фото профілю | `user.photoURL` | string | ❌ (стандартна іконка) |
| Rolle (адмін/юзер) | `isAdminUser(email, ADMIN_EMAILS)` | boolean | ✅ |

### Список реєстрацій на тренування

| Колонка | Джерело | Тип |
|---------|--------|-----|
| Ім'я учасника | `registration.userName` | string |
| Час реєстрації | `registration.registeredAt` | datetime |
| Email | `registration.userEmail` | string |
| Фото | `registration.userPhoto` | string \| null |

---

## 🔄 Де використовуються дані користувача

### Компонент: LoginView.vue

```javascript
// Отримуємо
const user = result.user  // Firebase User Object

// Використовуємо
if (ADMIN_EMAILS.includes(user.email)) {
  router.push('/admin')
} else {
  router.push('/user')
}
```

### Компонент: CabinetView.vue

```javascript
// Отримуємо
onAuthStateChanged(auth, (user) => {
  userName.value = user.displayName || ''
  userEmail.value = user.email || ''
  userPhoto.value = user.photoURL || ''
  isAdmin.value = isAdminUser(user.email, ADMIN_EMAILS)
})
```

### Компонент: TrainingRegistration.vue

```javascript
// Використовуємо для реєстрації на тренування
await registerForTraining({
  userId: auth.currentUser.uid,
  userEmail: auth.currentUser.email,
  userName: auth.currentUser.displayName,
  userPhoto: auth.currentUser.photoURL,
  trainingId: 'id',
  // ... інші дані
})
```

### Компонент: htfHeader.vue

```javascript
// Слухаємо оновлення
onAuthStateChanged(auth, (user) => {
  if (user) {
    isAuthenticated.value = true
    userEmail.value = user.email  // Для перевірки прав
  }
})
```

### Сервіс: authService.js

```javascript
// Отримуємо користувача
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

// Перевіряємо адміна
export function isAdminUser(userEmail, adminEmails) {
  return adminEmails.includes(userEmail || '')
}
```

---

## 📌 Ключові константи

### ADMIN_EMAILS (у різних файлах)

```javascript
// Адміністратори системи
const ADMIN_EMAILS = [
  'kulikalovdenis@gmail.com',
  'bugary20@gmail.com',
]

// Де визначено:
// - LoginView.vue
// - CabinetView.vue
// - router/index.ts
// - htfHeader.vue
```

---

## ✅ Перевірка - Які дані потребуємо

### Обов'язкові дані від Google

- ✅ **email** - для ідентифікації та перевірки прав
- ✅ **uid** - для зв'язку з іншими документами

### Рекомендовані дані від Google

- ⚠️ **displayName** - для зручності (показу в кабінеті)
- ⚠️ **photoURL** - для кращого UX

### Дані, що генеруються нашим кодом

- 🔧 **registeredAt** - час реєстрації на тренування
- 🔧 **createdAt** - час створення розкладу
- 🔧 **createdBy** - хто створив розклад

---

## 🚀 Як розширити дані користувача?

### Варіант 1: Зберегти у окремій колекції

```javascript
// Firestore: users/{uid}
{
  uid: "abc123xyz",
  email: "user@gmail.com",
  displayName: "John Doe",
  photoURL: "https://...",
  
  // Додаткові поля
  phone: "+380123456789",
  city: "Kyiv",
  experience: "beginner",
  createdAt: "2024-02-02T10:00:00Z"
}
```

**Сервіс:**
```javascript
export async function getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid))
  return userDoc.data()
}
```

### Варіант 2: Запросити у формі при першому вході

```javascript
// Компонент для заповнення додаткового профілю
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const city = ref('')

async function saveUserProfile() {
  await setDoc(doc(db, 'users', auth.currentUser.uid), {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    displayName: auth.currentUser.displayName,
    photoURL: auth.currentUser.photoURL,
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value,
    city: city.value,
    createdAt: new Date().toISOString()
  })
}
```

### Варіант 3: Збогатити дані при реєстрації

```javascript
// registrationService.js
export async function registerForTraining(trainingData) {
  const userProfile = await getUserProfile(auth.currentUser.uid)
  
  await addDoc(collection(db, 'registrations'), {
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email,
    userName: auth.currentUser.displayName,
    userPhone: userProfile?.phone,  // З додаткового профілю
    userCity: userProfile?.city,    // З додаткового профілю
    registeredAt: new Date().toISOString(),
    ...trainingData
  })
}
```

---

## 📋 Контрольний список

- ✅ Отримуємо email при логіну
- ✅ Отримуємо uid при логіну
- ✅ Отримуємо displayName при логіну (якщо є)
- ✅ Отримуємо photoURL при логіну (якщо є)
- ✅ Зберігаємо в registrations при реєстрації на тренування
- ✅ Показуємо в кабінеті користувача
- ✅ Використовуємо для перевірки адміна
- ✅ Протоколюємо час реєстрації (createdAt)
