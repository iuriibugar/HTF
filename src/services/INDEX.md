# 📋 Services Folder - Index

Повний опис всіх файлів у `src/services` для управління контрактами та валідацією не базуються.

## 🎯 Структура Папки

### 🔧 Core Service Files (Основні Сервіси)

Це файли, які відповідають за роботу з БД:

| Файл | Опис | Статус |
|------|------|--------|
| **authService.js** | Аутентифікація та авторизація | ✅ |
| **donationService.js** | Управління донатами | ✅ |
| **registrationService.js** | Реєстрація на тренування | ✅ |
| **scheduleService.js** | Управління розкладами | ✅ |
| **trainingService.js** | ⚠️ Архівний файл (перенесено) | 🗂️ |
| **userService.js** | Профілі користувачів | ✅ |
| **versionService.js** | Управління версіями | ✅ |

### 📊 Contract & Validation Files (НОВІ - API Контракти)

**Ці файли ви повинні використовувати у Ваших сервіс функціях:**

| Файл | Опис | Рядків | Умовна Вага |
|------|------|--------|-------------|
| **serviceContracts.js** | 📋 API контракти + валідація | ~1200 | ⭐⭐⭐ |
| **serviceValidationHelper.js** | 🛠️ Helper для валідації | ~500 | ⭐⭐⭐ |
| **serviceContracts.d.ts** | 🔤 TypeScript типи | ~400 | ⭐⭐ |

### 📖 Documentation Files (НОВІ - Документація)

**Прочитайте ці файли для розуміння як використовувати контракти:**

| Файл | Опис | Порядок Читання |
|------|------|-----------------|
| **IMPLEMENTATION_GUIDE.md** | 📚 Повний гайд з прикладами | 1️⃣ |
| **SERVICE_CONTRACTS_README.md** | 📖 Детальна документація | 2️⃣ |
| **QUICK_REFERENCE.js** | ⚡ Швидкий довідник (cheatsheet) | 3️⃣ |
| **USAGE_EXAMPLES.js** | 📝 Приклади Vue компонентів | 4️⃣ |
| **donationService.example.js** | ✅ Приклад інтеграції | 5️⃣ |
| **README.md** | 📋 Вихідна документація сервісів | 6️⃣ |

### 🗂️ Supporting Files

| Файл | Опис |
|------|------|
| **loaderStore.js** | Vuex store для відображення завантаження |

---

## 🚀 Скорий Старт

### Перший раз тут? Почніть звідси:

```javascript
// 1. Відкрийте IMPLEMENTATION_GUIDE.md
// 2. Прочитайте SERVICE_CONTRACTS_README.md
// 3. Подивіться QUICK_REFERENCE.js
// 4. Спробуйте приклад:

import { validateRequest } from '@/services/serviceContracts'

const result = validateRequest('donation', 'create', {
  amount: 1000,
  currency: 'UAH',
  donorName: 'Іван',
  donorEmail: 'ivan@example.com'
})

console.log(result.isValid)  // true
console.log(result.errors)   // []
```

---

## 📖 Які Файли Читати для Конкретної Задачі

### Я хочу...

**Коротко ознайомитися з системою**
→ Прочитайте [QUICK_REFERENCE.js](./QUICK_REFERENCE.js)

**Розібратися детально**
→ Прочитайте [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

**Отримати повну документацію**
→ Прочитайте [SERVICE_CONTRACTS_README.md](./SERVICE_CONTRACTS_README.md)

**Проглядати приклади коду**
→ Прочитайте [USAGE_EXAMPLES.js](./USAGE_EXAMPLES.js)

**Переглядати інтеграцію у реальний сервіс**
→ Прочитайте [donationService.example.js](./donationService.example.js)

**Дивитися список всіх операцій**
→ Відкрийте [serviceContracts.js](./serviceContracts.js) та пошукайте нужне

**Написати TypeScript код з автокомплітом**
→ Використовуйте [serviceContracts.d.ts](./serviceContracts.d.ts)

---

## 🎯 Сервіси та їх Операції

### 🎁 Donation Service

```javascript
// Основні операції:
validateRequest('donation', 'getAll')     // GET /donations
validateRequest('donation', 'create', {...})  // POST /donations
validateRequest('donation', 'update', {...})  // PUT /donations/:id
validateRequest('donation', 'delete')     // DELETE /donations/:id

// Приклад:
getRequestExample('donation', 'create')
// → { amount: 1000, currency: 'UAH', donorName: '...', ... }
```

**Обов'язкові поля:**
- `amount` (number, > 0)
- `currency` ('UAH' | 'USD' | 'EUR')
- `donorName` (string, 2-100 символів)
- `donorEmail` (valid email)

**Опціональні поля:**
- `description` (max 500 символів)
- `status` ('pending' | 'completed' | 'cancelled')

---

### 👤 User Service

```javascript
// Основні операції:
validateRequest('user', 'createOrUpdateProfile', {...})

// Приклад:
getRequestExample('user', 'createOrUpdateProfile')
// → { firstName: 'Іван', lastName: 'Петренко', phone: '...', ... }
```

**Основні поля:**
- `firstName`, `lastName`
- `phone`, `email`
- `birthDate`, `gender`, `city`
- `experienceLevel` ('beginner' | 'intermediate' | 'advanced' | 'professional')
- `notifications` (email, push, trainingReminders)

---

### 📝 Registration Service

```javascript
// Основні операції:
validateRequest('registration', 'register', {...})
validateRequest('registration', 'getUserRegistrations')
validateRequest('registration', 'getScheduleRegistrations')
validateRequest('registration', 'getTrainingRegistrations')
validateRequest('registration', 'cancelRegistration')

// Приклад:
getRequestExample('registration', 'register')
// → { trainingType: 'swimming', scheduleId: '...', ... }
```

**Основні поля:**
- `trainingType` ('swimming' | 'cycling' | 'running' | 'other')
- `scheduleId`
- `trainingId`
- `notes` (optional)

---

### 📅 Schedule Service

```javascript
// Основні операції:
validateRequest('schedule', 'getAll')
validateRequest('schedule', 'getForWeek', { monday: '...', sunday: '...' })
validateRequest('schedule', 'create', {...})

// Приклад:
getRequestExample('schedule', 'create')
```

**Основні поля:**
- `weekStart`, `weekEnd` (dates)
- `trainings` (array of training objects)

---

### 🔐 Auth Service

```javascript
// Основні операції:
validateRequest('auth', 'getCurrentUser')
validateRequest('auth', 'logout')
```

---

### 🔄 Version Service

```javascript
// Основні операції:
validateRequest('version', 'getLatest')
validateRequest('version', 'update', { version: '1.2.3' })
validateRequest('version', 'checkUpdates')
```

---

## 🛠️ Утіліти

### Функції для Валідації

```javascript
import { validateRequest, getContract, getRequestExample } from '@/services/serviceContracts'
import { validateBeforeSend, withValidation, normalizeData } from '@/services/serviceValidationHelper'

// Базова валідація
validateRequest(serviceName, action, data)
// → { isValid: boolean, errors: string[], data: {} }

// Валідація з пропозиціями та прикладом
validateBeforeSend(serviceName, action, data)
// → { isValid: boolean, validation: {...}, suggestions: [...], example: {...} }

// Отримати інформацію про контракт
getContract(serviceName, action)
// → { method, path, request, response, example }

// Отримати приклад запиту
getRequestExample(serviceName, action)
// → {...}

// Обгорнути функцію з автоматичною валідацією
withValidation(serviceName, action, handler)
// → обгорнута функція

// Видалити зайві поля з об'єкту
normalizeData(serviceName, action, data)
// → {...}
```

---

## 🎓 Приклади

### Приклад 1: Валідація перед створенням

```javascript
import { validateRequest } from '@/services/serviceContracts'

const data = {
  amount: 1000,
  currency: 'UAH',
  donorName: 'Іван',
  donorEmail: 'ivan@example.com'
}

const result = validateRequest('donation', 'create', data)

if (result.isValid) {
  console.log('✅ Дані валідні!')
  await createDonation(result.data)
} else {
  console.error('❌ Помилки:', result.errors)
}
```

### Приклад 2: З пропозиціями

```javascript
import { validateBeforeSend } from '@/services/serviceValidationHelper'

const check = validateBeforeSend('donation', 'create', {
  amount: -100,  // ПОМИЛКА!
  currency: 'UAH',
  donorName: 'Іван'
  // missing: email
})

if (!check.isValid) {
  console.log('Помилки:', check.validation.errors)
  // Помилки: ['amount: мінімальне значення 1', 'Обов\'язкове поле "donorEmail"']
  
  console.log('Пропозиції:', check.suggestions)
  // Пропозиції: ['Перевірте тип даних', 'Додайте обов\'язкове поле "donorEmail"']
  
  console.log('Приклад:', check.example)
  // Приклад: { amount: 1000, currency: 'UAH', ... }
}
```

### Приклад 3: Обгортання сервісу

```javascript
import { withValidation } from '@/services/serviceValidationHelper'

export const createDonation = withValidation('donation', 'create', 
  async ({ data, validation }) => {
    const docRef = await addDoc(collection(db, 'donations'), data)
    return docRef.id
  }
)

// Використання:
try {
  const id = await createDonation({
    amount: 1000,
    currency: 'UAH',
    donorName: 'Іван',
    donorEmail: 'ivan@example.com'
  })
  console.log('✅ Створено:', id)
} catch (error) {
  console.error('❌ Помилка:', error.errors)
}
```

---

## 🚨 Частові Помилки

| Помилка | Рішення |
|---------|---------|
| "Невідомий сервіс" | Перевірте список: `getAvailableServices()` |
| "Невідома дія" | Отримайте список: `getAvailableActions(serviceName)` |
| "Помилки валідації" | Дивіться `result.errors` для деталей |
| "Неправильний тип" | Передайте правильний тип (number, string, etc.) |
| "Обов'язкове поле" | Додайте всі обов'язкові поля з контракту |

---

## 📞 Довідка

### Де знайти інформацію про конкретний сервіс?

```
Донати  → IMPLEMENTATION_GUIDE.md → Donation Service
Користувачі → SERVICE_CONTRACTS_README.md → User Service
Реєстрація → QUICK_REFERENCE.js → Registration Service
Розклади → USAGE_EXAMPLES.js → Schedule Service
```

### Як отримати приклад JSON?

```javascript
import { getRequestExample } from '@/services/serviceContracts'

getRequestExample('donation', 'create')
// Повертає приклад всіх полів з правильними типами
```

### Як отримати список всіх операцій?

```javascript
import { getAvailableServices, getAvailableActions } from '@/services/serviceContracts'

// Всі сервіси
getAvailableServices()
// ['donation', 'user', 'registration', 'schedule', 'auth', 'version']

// Операції для сервісу
getAvailableActions('donation')
// ['getAll', 'create', 'update', 'delete']
```

---

## ✅ Checklist для початку роботи

- [ ] Прочитайте IMPLEMENTATION_GUIDE.md
- [ ] Прочитайте SERVICE_CONTRACTS_README.md
- [ ] Розберітеся зі структурою serviceContracts.js
- [ ] Протестуйте validateRequest() в console
- [ ] Спробуйте getRequestExample()
- [ ] Обгорніть перший сервіс з withValidation
- [ ] Напишіть тести для контрактів
- [ ] Інтегруйте у Vue компоненти
- [ ] Розширте на решту сервісів

---

## 📚 Links

- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Повний гайд
- [SERVICE_CONTRACTS_README.md](./SERVICE_CONTRACTS_README.md) - Документація
- [QUICK_REFERENCE.js](./QUICK_REFERENCE.js) - Cheatsheet
- [USAGE_EXAMPLES.js](./USAGE_EXAMPLES.js) - Приклади
- [donationService.example.js](./donationService.example.js) - Інтеграція
- [serviceContracts.js](./serviceContracts.js) - Контракти (основний файл)
- [serviceValidationHelper.js](./serviceValidationHelper.js) - Helper утіліти

---

**Версія:** 1.0.0  
**Останнє оновлення:** 2026-02-13  
**Статус:** ✅ Готово до використання
