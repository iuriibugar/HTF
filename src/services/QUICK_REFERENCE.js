/**
 * API SERVICE CONTRACTS - QUICK REFERENCE
 * Швидкий довідник для використання контрактів
 */

// ============================================================================
// 🚀 НАЙЧ ПРОСТІШІ ПРИКЛАДИ
// ============================================================================

/*
// 1️⃣ ВАЛІДУВАТИ ДАНІ ПЕД ВІДПРАВЛЕННЯМ
import { validateRequest } from '@/services/serviceContracts'

const { isValid, errors, data } = validateRequest('donation', 'create', {
  amount: 1000,
  currency: 'UAH',
  donorName: 'Іван',
  donorEmail: 'ivan@example.com'
})

if (!isValid) {
  console.error('Помилки:', errors)
  // Помилки: ['Обов\'язкове поле "donorEmail" відсутнє', ...]
}


// 2️⃣ ОТРИМАТИ ПРИКЛАД JSON
import { getRequestExample } from '@/services/serviceContracts'

const example = getRequestExample('donation', 'create')
console.log('Приклад:', example)


// 3️⃣ ОТРИМАТИ ВСІ ОПЕРАЦІЇ СЕРВІСУ
import { getAvailableActions } from '@/services/serviceContracts'

const actions = getAvailableActions('donation')
// ['getAll', 'create', 'update', 'delete']


// 4️⃣ ВАЛІДУВАТИ З ПРОПОЗИЦІЯМИ
import { validateBeforeSend } from '@/services/serviceValidationHelper'

const result = validateBeforeSend('donation', 'create', {
  amount: -100  // ПОМИЛКА!
})

console.log(result.validation.errors)  // Помилки
console.log(result.suggestions)        // Як виправити
console.log(result.example)            // Приклад коректного JSON


// 5️⃣ ОБГОРНУТИ ФУНКЦІЮ З АВТОМАТИЧНОЮ ВАЛІДАЦІЄЮ
import { withValidation } from '@/services/serviceValidationHelper'

export const createDonation = withValidation('donation', 'create', async ({ data }) => {
  // data уже валідовані!
  return await addDoc(collection(db, 'donations'), data)
})

// Використання:
await createDonation({
  amount: 1000,
  currency: 'UAH',
  donorName: 'Іван',
  donorEmail: 'ivan@example.com'
})
*/

// ============================================================================
// 📋 ТАБЛИЦЯ СЕРВІСІВ
// ============================================================================

/*
┌─────────────┬──────────────────────────┬───────────────────────────────────┐
│ СЕРВІС      │ ОПЕРАЦІЇ                 │ ОСНОВНІ ПОЛЯ                      │
├─────────────┼──────────────────────────┼───────────────────────────────────┤
│ DONATION    │ getAll                   │ amount, currency, donorName,      │
│             │ create ✅                 │ donorEmail, description, status   │
│             │ update                   │                                   │
│             │ delete                   │                                   │
├─────────────┼──────────────────────────┼───────────────────────────────────┤
│ USER        │ createOrUpdateProfile ✅ │ firstName, lastName, phone,       │
│             │                          │ city, experienceLevel             │
├─────────────┼──────────────────────────┼───────────────────────────────────┤
│ REGISTRATION│ register ✅               │ trainingType, scheduleId,         │
│             │ getUserRegistrations     │ trainingId, notes                 │
│             │ getScheduleRegistrations │                                   │
│             │ getTrainingRegistrations │                                   │
│             │ cancelRegistration       │                                   │
├─────────────┼──────────────────────────┼───────────────────────────────────┤
│ SCHEDULE    │ getAll                   │ weekStart, weekEnd, trainings     │
│             │ getForWeek ✅             │                                   │
│             │ create                   │                                   │
├─────────────┼──────────────────────────┼───────────────────────────────────┤
│ AUTH        │ getCurrentUser ✅         │ uid, email, displayName           │
│             │ logout                   │                                   │
├─────────────┼──────────────────────────┼───────────────────────────────────┤
│ VERSION     │ getLatest                │ version, updatedAt                │
│             │ update                   │                                   │
│             │ checkUpdates ✅          │                                   │
└─────────────┴──────────────────────────┴───────────────────────────────────┘
✅ = Мають обов'язкові поля
*/

// ============================================================================
// 🎯 ТИПИ ПОМИЛОК ВАЛІДАЦІЇ І ЯК ЇХ ВИПРАВИТИ
// ============================================================================

/*
ПОМИЛКА                                │ ПРИЧИНА                 │ ВИПРАВКА
────────────────────────────────────────┼─────────────────────────┼─────────────────
"Обов'язкове поле \"email\" відсутнє"   │ Забули поле             │ Додайте email
"amount: мінімальне значення 1"         │ Число занадто мале      │ amount >= 1
"currency: невідоме значення \"XYZ\"    │ Неправильна валюта      │ UAH, USD або EUR
"donorName: мінімальна довжина 2"       │ Ім'я занадто коротке    │ Мінімум 2 символи
"Невідоме поле \"unknownField\""        │ Зайве поле              │ Видаліть це поле
"очікувалося string, отримано number"   │ Неправильний тип        │ Передайте строку
*/

// ============================================================================
// 📚 ПОСИЛАННЯ НА ДОКУМЕНТАЦІЮ
// ============================================================================

/*
SERVICE CONTRACT FUNCTIONS:
  validateRequest(serviceName, action, data)
  getContract(serviceName, action)
  getRequestExample(serviceName, action, requestOnly)
  getAvailableServices()
  getAvailableActions(serviceName)

VALIDATION HELPER FUNCTIONS:
  validateBeforeSend(serviceName, action, data)
  validateAndHandle(serviceName, action, data)
  withValidation(serviceName, action, handler)
  formatValidationError(error, lang)
  normalizeData(serviceName, action, data)
  validateMultiple(requests)
  getDetailedExample(serviceName, action)
  suggestFixesForValidation(serviceName, action, data)
  logRequest(serviceName, action, data, verbose)
*/

// ============================================================================
// ✨ КОРИСНІ КОМБІНАЦІЇ
// ============================================================================

/*
// 🔄 ПОЛНИЙ ЦИКЛ: Валідація → Нормалізація → Відправлення
import { 
  validateRequest, 
  normalizeData, 
  withValidation 
} from '@/services/serviceContracts'
import { validateBeforeSend } from '@/services/serviceValidationHelper'

// 1. Валідуємо формові дані
const check = validateBeforeSend('donation', 'create', formData)

// 2. Якщо помилки - показуємо користувачу
if (!check.isValid) {
  showError(check.suggestions)
  return
}

// 3. Нормалізуємо (видаляємо зайві поля)
const clean = normalizeData('donation', 'create', formData)

// 4. Відправляємо
await createDonation(clean)


// 🎓 ДИНАМІЧНА ВАЛІДАЦІЯ ФОРМИ
const field = 'email'
const value = event.target.value

// Валідуємо тільки це поле
const result = validateRequest('donation', 'create', {
  ...form,
  [field]: value
})

// Фільтруємо помилки для цього поля
const fieldErrors = result.errors.filter(e => e.includes(field))

if (fieldErrors.length > 0) {
  showFieldError(field, fieldErrors[0])
}


// 📤 ОБРОБКА ПОМИЛОК ТА ПРОПОЗИЦІЇ
import { suggestFixesForValidation } from '@/services/serviceValidationHelper'

const fixes = suggestFixesForValidation('donation', 'create', badData)

console.log('Помилки:')
fixes.errors.forEach(err => console.error('  -', err))

console.log('Як виправити:')
fixes.suggestions.forEach(sug => console.log('  -', sug))

console.log('Приклад:')
console.log(fixes.example)


// 🔍 ПЕРЕГЛЯД КОНТРАКТУ
import { getContract } from '@/services/serviceContracts'

const contract = getContract('donation', 'create')
console.log('Метод:', contract.method)           // POST
console.log('Шлях:', contract.path)              // /donations
console.log('Обов'язкові:', contract.request.required)  // ['amount', ...]
console.log('Приклад:', contract.example.request)       // {...}
*/

// ============================================================================
// 🗂️ СТРУКТУРА ФАЙЛІВ
// ============================================================================

/*
src/services/
├── serviceContracts.js              📋 Контракти + валідація
├── serviceValidationHelper.js        🛠️ Утіліти для валідації
├── SERVICE_CONTRACTS_README.md       📖 Детальна документація
├── donationService.example.js        ✅ Приклад інтеграції
├── USAGE_EXAMPLES.js                 📝 Приклади для компонентів
└── QUICK_REFERENCE.js                ⚡ Цей файл
*/

// ============================================================================
// 🚨 ЧАСТОВІ ПОМИЛКИ (ТА ЯК ЇХ УНИКНУТИ)
// ============================================================================

/*
❌ НЕПРАВИЛЬНО:
const result = validateRequest('user', 'invalid_action', data)

✅ ПРАВИЛЬНО:
const result = validateRequest('user', 'createOrUpdateProfile', data)
// Отримайте список дій через getAvailableActions('user')


❌ НЕПРАВИЛЬНО:
const data = { amount: '1000' }  // STRING замість NUMBER
await createDonation(data)

✅ ПРАВИЛЬНО:
const data = { amount: 1000 }    // NUMBER
await createDonation(data)


❌ НЕПРАВИЛЬНО:
// Забули обов'язкові поля
await createDonation({ amount: 1000 })

✅ ПРАВИЛЬНО:
await createDonation({
  amount: 1000,
  currency: 'UAH',
  donorName: 'Іван',
  donorEmail: 'ivan@example.com'
})


❌ НЕПРАВИЛЬНО:
// Не перевіряємо помилки валідації
const result = validateRequest('donation', 'create', data)
// ... просто виконуємо без перевірки

✅ ПРАВИЛЬНО:
const result = validateRequest('donation', 'create', data)
if (!result.isValid) {
  console.error('Помилки:', result.errors)
  return
}
*/

// ============================================================================
// 🎁 БОНУС: ГОТОВІ ФРАГМЕНТИ КОДУ
// ============================================================================

/*
// 📋 Вивести всю інформацію про сервіс
import { getAvailableServices, getAvailableActions, getContract } from '@/services/serviceContracts'

getAvailableServices().forEach(service => {
  console.group(`📦 ${service}`)
  
  getAvailableActions(service).forEach(action => {
    const contract = getContract(service, action)
    console.log(`  📌 ${contract.method} ${contract.path}`)
  })
  
  console.groupEnd()
})


// 🔍 Пошук лип помилок у всіх запитах
import { validateMultiple } from '@/services/serviceValidationHelper'

const requests = [
  { serviceName: 'donation', action: 'create', data: donationData },
  { serviceName: 'user', action: 'createOrUpdateProfile', data: userData },
  { serviceName: 'registration', action: 'register', data: regData }
]

const { isAllValid, errors } = validateMultiple(requests)

if (!isAllValid) {
  errors.forEach(({ serviceName, action, validation }) => {
    console.error(`❌ ${serviceName}/${action}:`)
    validation.errors.forEach(err => console.error(`   - ${err}`))
  })
}


// 📝 Генерувати HTML для відображення помилок
import { formatValidationError } from '@/services/serviceValidationHelper'

try {
  await createDonation(data)
} catch (error) {
  const message = formatValidationError(error, 'uk')
  document.getElementById('errors').innerHTML = `
    <div class="alert alert-danger">
      ${message.replace(/\n/g, '<br>')}
    </div>
  `
}
*/

// ============================================================================
// 🎯 РЕКОМЕНДОВАНА ПОСЛІДОВНІСТЬ ІНТЕГРАЦІЇ
// ============================================================================

/*
1️⃣ ДЕНЬ 1: Розуміння контрактів
   - Прочитайте SERVICE_CONTRACTS_README.md
   - Розібраніть структуру serviceContracts.js
   - Протестуйте validateRequest у console

2️⃣ ДЕНЬ 2: Інтеграція в один сервіс
   - Додайте vallidation в donationService.js
   - Тестуйте з createDonation

3️⃣ ДЕНЬ 3: Інтеграція у Vue компоненти
   - Використайте валідацію у формах
   - Показуйте помилки користувачам

4️⃣ ДЕНЬ 4: Інтеграція у решту сервісів
   - Обгорніть інші сервіси з withValidation
   - Протестуйте всі операції

5️⃣ ДЕНЬ 5: Документація і тести
   - Напишіть тести для контрактів
   - Створіть документацію для команди
*/

export default {
  // Cheatsheet для швидкого доступу
  info: 'Дивіться кодові зміни у цьому файлі для швидких рішень'
}
