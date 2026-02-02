# Рефакторинг - Організація операцій БД у сервіси

## Дата: 2024
## Опис: Винесення всієї роботи з базою даних Firebase у окремі сервіси за типами операцій

---

## Структура сервісів

Усі операції з базою даних перенесені з Vue компонентів у окремі сервіси:

### 📁 `/src/services/`

1. **authService.js** - Авторизація користувачів
   - `getCurrentUser()` - отримати поточного користувача
   - `logout()` - вийти з системи
   - `isAdminUser()` - перевірити чи адмін

2. **scheduleService.js** - Управління розкладами
   - `getAllSchedules()` - отримати всі розклади
   - `getScheduleForWeek()` - отримати розклад для тижня
   - `saveSchedule()` - зберегти розклад

3. **registrationService.js** - Управління реєстраціями
   - `registerForTraining()` - зареєструватись на тренування
   - `getUserRegistrations()` - мої реєстрації
   - `getScheduleRegistrations()` - реєстрації розкладу
   - `getTrainingRegistrations()` - реєстрації тренування
   - `cancelRegistration()` - скасувати реєстрацію

4. **donationService.js** - Управління донатами
   - `getAllDonations()` - отримати всі донати
   - `createDonation()` - створити донат
   - `updateDonation()` - оновити донат
   - `deleteDonation()` - видалити донат

---

## Оновлені файли

### Vue компоненти
- ✅ **LoginView.vue** - використовує Firebase Auth напряму
- ✅ **ScheduleView.vue** - рефакторено на `scheduleService`, `registrationService`
- ✅ **DonationsView.vue** - рефакторено на `donationService`
- ✅ **CabinetView.vue** - рефакторено на `authService`
- ✅ **TrainingRegistration.vue** - рефакторено на `scheduleService`, `registrationService`
- ✅ **FormSchedule.vue** - рефакторено на `scheduleService`
- ✅ **DonationsManager.vue** - рефакторено на `donationService`

### Компоненти
- ✅ **htfHeader.vue** - рефакторено на `authService`

### Роутер
- ✅ **router/index.ts** - рефакторено на `authService`

---

## Переваги рефакторингу

1. **Розділення відповідальності (SoC)** - кожен сервіс відповідає за одну область
2. **Переиспользование** - одна функція може використовуватись у кількох компонентах
3. **Тестування** - легше писати unit-тести для окремих функцій
4. **Підтримка коду** - зміни в БД логіці в одному місці
5. **Type Safety** - додані .d.ts файли для TypeScript

---

## Приклади використання

### Отримати розклад
```javascript
import { getScheduleForWeek } from '@/services/scheduleService'

const schedule = await getScheduleForWeek(monday, sunday)
```

### Зареєструватись на тренування
```javascript
import { registerForTraining } from '@/services/registrationService'

await registerForTraining({
  trainingId: 'id',
  scheduleId: 'schedule_id',
  trainingDate: '2024-01-15',
  trainingTime: '10:00'
})
```

### Отримати донати
```javascript
import { getAllDonations } from '@/services/donationService'

const donations = await getAllDonations()
```

### Перевірити авторизацію
```javascript
import { getCurrentUser, isAdminUser } from '@/services/authService'

const user = await getCurrentUser()
const isAdmin = isAdminUser(user.email, ADMIN_EMAILS)
```

---

## Архівні файли

- **trainingService.js** - старий файл, більше не використовується

---

## TypeScript декларації

Для всіх сервісів створені .d.ts файли:
- authService.d.ts
- scheduleService.d.ts
- registrationService.d.ts
- donationService.d.ts

---

## Наступні кроки (опційно)

1. Міграція на TypeScript для сервісів (.ts замість .js)
2. Додання error handling у UI нотифікаціях
3. Кешування даних (caching)
4. Unit-тести для сервісів
