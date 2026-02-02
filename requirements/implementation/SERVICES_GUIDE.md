# Гайд - Як додати нову операцію з БД у сервіс

## 1. Визначити тип операції

Спочатку визначте, до якого сервісу належить ваша операція:

- **scheduleService** - операції з розкладами
- **registrationService** - операції з реєстраціями  
- **donationService** - операції з донатами
- **authService** - операції з авторизацією

## 2. Додати функцію у сервіс

Приклад для `scheduleService.js`:

```javascript
/**
 * Отримати розклад за ID
 * @param {string} scheduleId - ID розкладу
 * @returns {Promise<Object>} - дані розкладу
 */
export async function getScheduleById(scheduleId) {
  try {
    const scheduleDoc = await getDoc(doc(db, 'schedules', scheduleId))
    
    if (scheduleDoc.exists()) {
      return { id: scheduleDoc.id, ...scheduleDoc.data() }
    } else {
      throw new Error('Розклад не знайдено')
    }
  } catch (error) {
    console.error('Помилка завантаження розкладу:', error)
    throw error
  }
}
```

## 3. Додати TypeScript декларацію

Оновіть файл `*.d.ts`:

```typescript
// scheduleService.d.ts
export declare function getScheduleById(scheduleId: string): Promise<any>
```

## 4. Використовувати у компоненті

```javascript
import { getScheduleById } from '@/services/scheduleService'

// У компоненті
try {
  const schedule = await getScheduleById('schedule-123')
  console.log(schedule)
} catch (error) {
  showNotification('error', error.message, 'Помилка')
}
```

## 5. Примітки

- Завжди обгортайте код у `try-catch`
- Логуйте помилки за допомогою `console.error`
- Кидайте помилки, щоб компонент їх обробляв
- Додавайте JSDoc коментарі до функцій
- Оновлюйте .d.ts файл для TypeScript підтримки

## Типові операції Firestore

### Читання (Read)

```javascript
// Один документ
import { getDoc, doc } from 'firebase/firestore'
const docSnapshot = await getDoc(doc(db, 'schedules', scheduleId))

// Колекція
import { getDocs, collection } from 'firebase/firestore'
const querySnapshot = await getDocs(collection(db, 'schedules'))

// З фільтром
import { query, where } from 'firebase/firestore'
const q = query(collection(db, 'registrations'), where('userId', '==', userId))
const querySnapshot = await getDocs(q)
```

### Створення (Create)

```javascript
import { addDoc, collection } from 'firebase/firestore'
const docRef = await addDoc(collection(db, 'donations'), {
  title: 'Example',
  createdAt: new Date().toISOString()
})
```

### Оновлення (Update)

```javascript
import { updateDoc, doc } from 'firebase/firestore'
await updateDoc(doc(db, 'donations', donationId), {
  title: 'Updated',
  updatedAt: new Date().toISOString()
})
```

### Видалення (Delete)

```javascript
import { deleteDoc, doc } from 'firebase/firestore'
await deleteDoc(doc(db, 'donations', donationId))
```

## Перевірка помилок

Запустіть у терміналі:

```bash
npm run type-check  # Перевірка TypeScript помилок
npm run lint        # Перевірка ESLint помилок
```

## Потім тестуйте у компоненті

Переконайтесь, що все працює правильно з користувачем.
