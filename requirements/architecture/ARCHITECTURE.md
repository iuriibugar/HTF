# Архітектура даних - Організація сервісів

## Поточна структура

```
src/
├── services/                          ← Усі операції з БД
│   ├── scheduleService.js            (Розклади)
│   ├── registrationService.js        (Реєстрації на тренування)
│   ├── donationService.js            (Донати)
│   ├── authService.js                (Авторизація)
│   ├── trainingService.js            (архів)
│   ├── README.md                     (Документація сервісів)
│   └── *.d.ts                        (TypeScript декларації)
│
├── views/                             ← Сторінки
│   ├── LoginView.vue                 → Firebase Auth (напряму)
│   ├── ScheduleView.vue              → scheduleService, registrationService
│   ├── DonationsView.vue             → donationService
│   ├── CabinetView.vue               → authService
│   └── cabinet/
│       ├── user/
│       │   └── TrainingRegistration.vue  → scheduleService, registrationService
│       └── admin/
│           ├── FormSchedule.vue      → scheduleService
│           └── DonationsManager.vue  → donationService
│
├── components/
│   └── htfHeader.vue                 → authService
│
├── router/
│   └── index.ts                      → authService
│
└── firebase.js                        (Ініціалізація Firebase)
```

## Потік даних

### Реєстрація на тренування

```
TrainingRegistration.vue
├─ import { getScheduleForWeek } from scheduleService
├─ import { registerForTraining, cancelRegistration } from registrationService
│
└─ Користувач натискає "Записатися"
   ├─ registerForTraining() → Firestore
   ├─ Оновлення локального стану
   └─ Показ нотифікації
```

### Управління розкладом

```
FormSchedule.vue
├─ import { getAllSchedules, saveSchedule } from scheduleService
│
└─ Адмін створює розклад
   ├─ saveSchedule() → Firestore
   ├─ loadAllSchedules() → Firestore
   └─ Показ повідомлення про успіх
```

### Управління донатами

```
DonationsManager.vue
├─ import { getAllDonations, createDonation, updateDonation, deleteDonation } from donationService
│
└─ Адмін керує донатами
   ├─ getAllDonations() → Firestore
   ├─ createDonation() → Firestore
   ├─ updateDonation() → Firestore
   └─ deleteDonation() → Firestore
```

### Авторизація

```
Будь-який компонент
├─ import { getCurrentUser, logout, isAdminUser } from authService
│
└─ Перевірка стану користувача
   ├─ getCurrentUser() → Firebase Auth
   ├─ isAdminUser() → логіка
   └─ logout() → Firebase Auth
```

## Колекції Firestore та сервіси

| Колекція | Сервіс | Операції |
|----------|--------|----------|
| `schedules` | scheduleService | read, create |
| `registrations` | registrationService | create, read, delete |
| `donations` | donationService | create, read, update, delete |
| `auth` | authService | read, signout |

## Типи помилок та обробка

Усі сервіси викидають помилки, які потім обробляються у компонентах:

```javascript
try {
  await registerForTraining(data)
} catch (error) {
  // Показати нотифікацію користувачу
  showNotification('error', error.message, 'Помилка')
}
```

## Інтеграція з Firebase SDK

Сервіси використовують:
- `firebase/firestore` - для операцій з БД
- `firebase/auth` - для авторизації

## Переваги цієї структури

✅ Single Responsibility Principle (SRP)  
✅ DRY (Don't Repeat Yourself)  
✅ Простота тестування  
✅ Легкість розширення  
✅ Чіткі залежності (imports)  
✅ Type Safety (TypeScript .d.ts)  

## Недоліки та як їх вирішити

❌ Немає кешування даних → розглянути use-query або pinia
❌ Нема повторних спроб при помилках → додати retry logic
❌ Нема оптимізації запитів → використовувати pagination
