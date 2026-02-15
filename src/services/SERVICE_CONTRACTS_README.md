# API Service Contracts

Система контрактів для валідації API запитів із примерами JSON та автоматичною перевіркою.

## 📋 Структура

- **`serviceContracts.js`** - Контракти для всіх сервісів з JSON прикладами та схемами
- **`serviceValidationHelper.js`** - Helper функції для валідації та обробки помилок
- **`README.md`** - Цей файл з інструкціями та прикладами

## 🎯 Використання

### 1. Валідувати запит перед відправленням

```javascript
import { validateRequest, validateBeforeSend } from '@/services/serviceContracts'

// Простої перевірці
const result = validateRequest('donation', 'create', {
  amount: 1000,
  currency: 'UAH',
  donorName: 'Іван Петренко',
  donorEmail: 'ivan@example.com'
})

console.log(result.isValid) // true
console.log(result.errors) // []
console.log(result.data) // валідовані дані

// Детальнішої перевірці з пропозиціями
const checkResult = validateBeforeSend('donation', 'create', {
  amount: 1000,
  currency: 'UAH',
  donorName: 'Іван'
  // missing: donorEmail
})

// Результат містить errors і suggestions
```

### 2. Отримати приклад запиту

```javascript
import { getRequestExample, getContract } from '@/services/serviceContracts'

// Отримати JSON приклад
const example = getRequestExample('donation', 'create')
console.log(example)
// {
//   amount: 1000,
//   currency: 'UAH',
//   description: 'Спонсорство для команди',
//   donorName: 'Марія Сидоренко',
//   donorEmail: 'maria@example.com',
//   status: 'completed'
// }

// Отримати весь контракт
const contract = getContract('donation', 'create')
console.log(contract.method) // 'POST'
console.log(contract.path) // '/donations'
```

### 3. Отримати список доступних сервісів та операцій

```javascript
import { getAvailableServices, getAvailableActions } from '@/services/serviceContracts'

// Список сервісів
const services = getAvailableServices()
// ['donation', 'user', 'registration', 'schedule', 'auth', 'version']

// Операції для сервісу
const actions = getAvailableActions('donation')
// ['getAll', 'create', 'update', 'delete']
```

### 4. Обгорнути функцію сервісу з валідацією

```javascript
import { withValidation } from '@/services/serviceValidationHelper'
import { db } from '@/firebase'
import { addDoc, collection } from 'firebase/firestore'

// До:
export async function createDonation(donationData) {
  const docRef = await addDoc(collection(db, 'donations'), {
    createdAt: new Date().toISOString(),
    ...donationData
  })
  return docRef.id
}

// Після з автоматичною валідацією:
export const createDonation = withValidation('donation', 'create', async ({ data }) => {
  const docRef = await addDoc(collection(db, 'donations'), {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data
  })
  return docRef.id
})

// Тепер при виклику з неправильними даними буде помилка:
try {
  await createDonation({ amount: -100 }) // помилка! мінімум 1
} catch (error) {
  console.error(error.errors) // ['amount: мінімальне значення 1, отримано -100']
}
```

### 5. Валідувати кілька запитів

```javascript
import { validateMultiple } from '@/services/serviceValidationHelper'

const results = validateMultiple([
  { serviceName: 'donation', action: 'create', data: { amount: 500, ... } },
  { serviceName: 'user', action: 'createOrUpdateProfile', data: { firstName: 'Іван', ... } },
  { serviceName: 'registration', action: 'register', data: { trainingType: 'swimming', ... } }
])

if (results.isAllValid) {
  console.log('✅ Всі запити валідні!')
} else {
  console.log('❌ Помилки в запитах:')
  results.errors.forEach(({ serviceName, action, validation }) => {
    console.log(`${serviceName}/${action}:`, validation.errors)
  })
}
```

### 6. Нормалізувати дані (видалити зайві поля)

```javascript
import { normalizeData } from '@/services/serviceValidationHelper'

const rawData = {
  amount: 1000,
  currency: 'UAH',
  donorName: 'Іван',
  donorEmail: 'ivan@example.com',
  unknownField: 'потрібно видалити'
}

const normalized = normalizeData('donation', 'create', rawData)
// { amount: 1000, currency: 'UAH', donorName: 'Іван', donorEmail: 'ivan@example.com' }
```

### 7. Отримати детальний приклад

```javascript
import { getDetailedExample } from '@/services/serviceValidationHelper'

const example = getDetailedExample('donation', 'create')
console.log(example)
// {
//   method: 'POST',
//   path: '/donations',
//   requestContract: { type: 'object', required: [...], schema: {...} },
//   responseContract: { type: 'object', schema: {...} },
//   example: { request: {...}, response: {...} },
//   summary: {
//     requiredFields: ['amount', 'currency', 'donorName', 'donorEmail'],
//     optionalFields: ['description', 'status']
//   }
// }
```

## 📚 Доступні Сервіси

### 1. **Donation Service** 🎁

```javascript
validateRequest('donation', 'getAll')     // GET /donations
validateRequest('donation', 'create', data) // POST /donations
validateRequest('donation', 'update', data) // PUT /donations/:id
validateRequest('donation', 'delete')      // DELETE /donations/:id
```

**Приклад JSON:**
```json
{
  "id": "donation_123",
  "amount": 500,
  "currency": "UAH",
  "description": "Пожертва на тренування",
  "donorName": "Іван Петренко",
  "donorEmail": "ivan@example.com",
  "status": "completed",
  "createdAt": "2026-02-13T10:30:00Z",
  "updatedAt": "2026-02-13T10:30:00Z"
}
```

### 2. **User Service** 👤

```javascript
validateRequest('user', 'createOrUpdateProfile', data) // PUT /users/:uid
```

**Приклад JSON:**
```json
{
  "uid": "user_uid_123",
  "email": "ivan@example.com",
  "firstName": "Іван",
  "lastName": "Петренко",
  "phone": "+380671234567",
  "birthDate": "1990-05-15",
  "gender": "male",
  "city": "Київ",
  "role": "user",
  "isApproved": true,
  "status": "active",
  "trainingStats": {
    "swimming": { "registered": 3 },
    "cycling": { "registered": 5 },
    "running": { "registered": 2 },
    "other": { "registered": 1 }
  }
}
```

### 3. **Registration Service** 📝

```javascript
validateRequest('registration', 'register', data) // POST /registrations
validateRequest('registration', 'getUserRegistrations') // GET /registrations/user/:userId
validateRequest('registration', 'getScheduleRegistrations') // GET /registrations/schedule/:scheduleId
validateRequest('registration', 'getTrainingRegistrations') // GET /registrations/training/:trainingId
validateRequest('registration', 'cancelRegistration') // DELETE /registrations/:id
```

**Приклад JSON:**
```json
{
  "id": "registration_001",
  "userId": "user_123",
  "userName": "Іван Петренко",
  "userEmail": "ivan@example.com",
  "trainingType": "swimming",
  "scheduleId": "schedule_789",
  "trainingId": "training_001",
  "registeredAt": "2026-02-13T10:30:00Z"
}
```

### 4. **Schedule Service** 📅

```javascript
validateRequest('schedule', 'getAll') // GET /schedules
validateRequest('schedule', 'getForWeek', data) // GET /schedules/week
validateRequest('schedule', 'create', data) // POST /schedules
```

**Приклад JSON:**
```json
{
  "id": "schedule_001",
  "weekStart": "2026-02-09",
  "weekEnd": "2026-02-15",
  "trainings": [
    {
      "id": "training_001",
      "type": "swimming",
      "date": "2026-02-10",
      "time": "09:00",
      "duration": 60,
      "instructor": "Петро Водолазац",
      "location": "Басейн Олімпійський",
      "maxParticipants": 20
    }
  ],
  "createdAt": "2026-02-08T10:30:00Z",
  "createdBy": "admin@example.com"
}
```

### 5. **Auth Service** 🔐

```javascript
validateRequest('auth', 'getCurrentUser') // GET /auth/current-user
validateRequest('auth', 'logout') // POST /auth/logout
```

### 6. **Version Service** 🔄

```javascript
validateRequest('version', 'getLatest') // GET /version/latest
validateRequest('version', 'update', data) // PUT /version/update
validateRequest('version', 'checkUpdates') // GET /version/check-updates
```

## 🔍 Типи Валідації

### Типи даних
- `string` - текст
- `number` - число
- `boolean` - істина/хибність
- `array` - масив
- `object` - об'єкт
- `date` - дата (YYYY-MM-DD)
- `date-time` - дата-час (ISO 8601)
- `email` - email адреса
- `uri` - URL

### Правила валідації
- `minLength` - мінімальна довжина строки
- `maxLength` - максимальна довжина строки
- `minimum` - мінімальне значення числа
- `maximum` - максимальне значення числа
- `pattern` - регулярний вираз
- `enum` - допустимі значення
- `required` - обов'язкові поля
- `default` - значення за замовчуванням

## ❌ Обробка Помилок

```javascript
import { validateBeforeSend, formatValidationError } from '@/services/serviceValidationHelper'

try {
  const check = validateBeforeSend('donation', 'create', {
    amount: -100, // помилка!
    currency: 'UAH',
    donorName: 'Іван'
    // missing: donorEmail
  })
  
  if (!check.isValid) {
    console.error(formatValidationError(new Error(...)))
    console.log('Пропозиції:', check.suggestions)
    // Пропозиції: [
    //   'мінімальне значення 1, отримано -100',
    //   'Додайте обов\'язкове поле "donorEmail"'
    // ]
  }
} catch (error) {
  console.error(formatValidationError(error))
}
```

## 📊 Логування

```javascript
import { logRequest } from '@/services/serviceValidationHelper'

// Простий лог
logRequest('donation', 'create', { amount: 1000, ... })

// Розширений лог з прикладами
logRequest('donation', 'create', { amount: 1000, ... }, true)
```

## 🎓 Вправи

### Вправа 1: Валідація донату
```javascript
// Спробуйте створити донат із помилками
const badDonation = {
  amount: -500,
  currency: 'XYZ',
  donorName: 'А',
  // missing: donorEmail
}

const result = validateRequest('donation', 'create', badDonation)
// Знайдіть всі помилки валідації
```

### Вправа 2: Автоматова валідація
```javascript
// Додайте валідацію до функції
export const updateDonation = withValidation('donation', 'update', async ({ data }) => {
  // use data that's pre-validated
  return await updateDoc(doc(db, 'donations', id), data)
})
```

### Вправа 3: Кілька запитів
```javascript
// Перевірте кілька операцій одночасно
const multiValidation = validateMultiple([
  { serviceName: 'donation', action: 'create', data: {...} },
  { serviceName: 'user', action: 'createOrUpdateProfile', data: {...} }
])
```

## 💡 Best Practices

1. **Завжди валідуйте перед відправленням на сервер**
   ```javascript
   const check = validateBeforeSend('donation', 'create', data)
   if (!check.isValid) {
     showError(check.suggestions)
     return
   }
   ```

2. **Використовуйте withValidation для обгортання сервісів**
   - Автоматична валідація
   - Кращий error handling
   - Логування операцій

3. **Нормалізуйте дані перед збереженням**
   ```javascript
   const normalized = normalizeData('donation', 'create', formData)
   await createDonation(normalized)
   ```

4. **Показуйте приклади користувачам**
   ```javascript
   const example = getRequestExample('donation', 'create')
   console.log('Приклад:', example)
   ```

5. **Обробляйте помилки валідації gracefully**
   ```javascript
   const { suggestions } = validateBeforeSend('donation', 'create', data)
   showUserMessage(`Виправте помилки: ${suggestions.join(', ')}`)
   ```

## 🔗 Зв'язки между Сервісами

```
┌─────────────────────────────────────────┐
│         User Registration Flow           │
└─────────────────────────────────────────┘
         ↓
    User Service (створити профіль)
         ↓
    Auth Service (отримати користувача)
         ↓
    Registration Service (зареєструватися)
         ↓
    Schedule Service (отримати розклади)
         ↓
    Donation Service (опціонально - пожертва)
```

## 📝 Notes

- Всі дати у ISO 8601 форматі
- Email адреси повинні бути валідними
- Телефонні номери подібні Patterns (+380XXXXXXXXX або (XXX) XXX-XXXX)
- Суми донатів мають бути позитивними числами
- Статуси - це фіксовані перелічення (enum)

## 🚀 Наступні Кроки

1. Інтегрувати контракти в усі сервіси
2. Додати TypeScript типи на основі контрактів
3. Створити UI компоненти для валідації форм
4. Додати Swagger документацію
5. Написати тести для всіх контрактів
