# Services - Структура сервісів

Цей каталог містить всі сервіси для роботи з базою даних Firebase, розділені за функціональністю.

## Структура сервісів

### 📋 scheduleService.js
Операції з розкладами тренувань

**Функції:**
- `getAllSchedules()` - отримати всі розклади з БД
- `getScheduleForWeek(monday, sunday)` - отримати розклад для конкретного тижня
- `saveSchedule(weekStart, weekEnd, trainings, userEmail)` - зберегти новий розклад

**Використання:**
```javascript
import { getAllSchedules, getScheduleForWeek } from '@/services/scheduleService'
```

---

### 📝 registrationService.js
Операції з реєстраціями учасників на тренування

**Функції:**
- `registerForTraining(trainingData)` - зареєструвати користувача на тренування
- `getUserRegistrations(userId)` - отримати реєстрації одного користувача
- `getScheduleRegistrations(scheduleId)` - отримати всі реєстрації розкладу
- `getTrainingRegistrations(trainingId)` - отримати реєстрації конкретного тренування
- `cancelRegistration(userId, trainingId)` - скасувати реєстрацію

**Використання:**
```javascript
import { registerForTraining, cancelRegistration } from '@/services/registrationService'
```

---

### 💰 donationService.js
Операції з донатами

**Функції:**
- `getAllDonations()` - отримати всі донати
- `createDonation(donationData)` - створити новий донат
- `updateDonation(donationId, donationData)` - оновити донат
- `deleteDonation(donationId)` - видалити донат

**Використання:**
```javascript
import { getAllDonations, createDonation, updateDonation, deleteDonation } from '@/services/donationService'
```

---

### 🔐 authService.js
Операції з авторизацією

**Функції:**
- `getCurrentUser()` - отримати поточного користувача
- `logout()` - вийти з системи
- `isAdminUser(userEmail, adminEmails)` - перевірити чи користувач адмін

**Використання:**
```javascript
import { getCurrentUser, logout, isAdminUser } from '@/services/authService'
```

---

## Де використовуються сервіси

### Views (Сторінки)
- **LoginView.vue** - використовує `authService` (Firebase OAuth)
- **ScheduleView.vue** - використовує `scheduleService`, `registrationService`
- **DonationsView.vue** - використовує `donationService`
- **CabinetView.vue** - використовує `authService`
- **TrainingRegistration.vue** - використовує `scheduleService`, `registrationService`
- **FormSchedule.vue** - використовує `scheduleService`
- **DonationsManager.vue** - використовує `donationService`

### Components
- **htfHeader.vue** - використовує `authService`

### Router
- **index.ts** - використовує `authService`

---

## Типи данних

### Schedule
```javascript
{
  id: string,
  weekStart: string (YYYY-MM-DD),
  weekEnd: string (YYYY-MM-DD),
  trainings: Training[],
  createdAt: string (ISO),
  createdBy: string
}
```

### Training
```javascript
{
  date: string (YYYY-MM-DD),
  dayName: string,
  type: string,
  name: string,
  difficulty: string,
  time: string (HH:MM),
  isPaid: boolean,
  address: string
}
```

### Registration
```javascript
{
  userId: string,
  userEmail: string,
  userName: string,
  userPhoto: string | null,
  trainingId: string,
  scheduleId: string,
  trainingDate: string,
  trainingTime: string,
  trainingName: string,
  registeredAt: string (ISO)
}
```

### Donation
```javascript
{
  id: string,
  title: string,
  description: string,
  link: string,
  imageBase64: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

---

## Помилки та обробка

Усі сервіси кидають помилки, які можна обробити за допомогою try-catch:

```javascript
try {
  const schedules = await getAllSchedules()
} catch (error) {
  console.error('Помилка:', error)
}
```

---

## Архівні файли

- **trainingService.js** - старий файл, функціональність перенесена на `registrationService` та `scheduleService`
