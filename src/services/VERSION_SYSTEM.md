# Система версіонування додатку

Комплексне рішення для моніторингу версій та уведомлення користувачів про оновлення.

## Компоненти системи

### 1. **versionService.js** - Сервіс для моніторингу версій
Основний сервіс, який:
- Перевіряє наявність нової версії на сервері
- Детектує оновлення для користувачів
- Очищує кеш, cookies та localStorage при оновленні
- Перезавантажує додаток

### 2. **UpdateNotification.vue** - Компонент ялого повідомлення
- Красивий popup з інформацією про оновлення
- Кнопка "Оновити зараз" для негайного оновлення
- Кнопка "Пізніше" для відкладення

### 3. **version.json** - Файл з версією на сервері
Публічний файл, який містить поточну версію додатку.

## Як це працює

```
┌─────────────────────────────────────────────────┐
│ Користувач завантажує додаток                  │
│ (currentVersion = "1.0.0")                      │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Запускається periodic check що 5 хвилин        │
│ (від checkForNewVersion)                        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Запит на /version.json (без кеш!)              │
└─────────────────┬───────────────────────────────┘
                  │
               ┌──┴──┐
        Версія │     │ Нова версія
        однак  │     │ (1.0.1)
          ▼    │     ▼
    Ніч не      │   Показуємо popup
    сталось     │
                │   Користувач натиснув
                │   "Оновити зараз"
                │
                ▼
    ┌──────────────────────────────┐
    │ updateApp():                 │
    │ 1. Очищуємо Service Worker   │
    │ 2. Очищуємо localStorage      │
    │ 3. Очищуємо cookies           │
    │ 4. Перезавантажуємо сторінку  │
    └──────────────────────────────┘
```

## Розгортання та оновлення

### На Firebase та GitHub Pages

Коли ви робите новий деплой:

1. **Оновіть версію у файлі**
```bash
# Відредагуйте public/version.json
{
  "version": "1.0.1",  # ← Збільшуємо версію
  "timestamp": "2026-02-12T10:30:00Z",
  "notes": "Виправлення багів, нові функції"
}
```

2. **Розгорніть на сервер**
```bash
# Firebase
npm run deploy:firebase

# GitHub Pages
npm run deploy
```

3. **Система автоматично**
- За 5 хвилин користувачі побачать popup про оновлення
- Можуть оновити в улюблений момент 
- Весь кеш буде очищений

## Налаштування

### Змінити інтервал перевірки версії
У файлі `src/services/versionService.js`:

```javascript
// Поточне значення: 5 хвилин
const VERSION_CHECK_INTERVAL = 5 * 60 * 1000

// Змініть на 1 хвилину:
const VERSION_CHECK_INTERVAL = 1 * 60 * 1000

// Або на 10 хвилин:
const VERSION_CHECK_INTERVAL = 10 * 60 * 1000
```

### Змінити поточну версію запасу
У файлі `src/services/versionService.js`:

```javascript
// Поточне значення
const VERSION = '1.0.0'

//務必синхронізуйте з version.json!
```

## Що очищується при оновленні

1. **Service Worker Cache** - весь кеш браузера
2. **localStorage** - всі залишені дані
3. **sessionStorage** - дані сесії
4. **Cookies** - всі cookies для домену

Це забезпечує повне оновлення додатку без артефактів старої версії.

## Функції versionService

### `getCurrentVersion()`
Повертає поточну версію додатку.

```javascript
import versionService from '@/services/versionService'
console.log(versionService.getCurrentVersion()) // "1.0.0"
```

### `checkForNewVersion()`
Вручну перевіряє чи є нова версія на сервері.

```javascript
await versionService.checkForNewVersion()
```

### `subscribe(callback)`
Підписується на оновлення версії.

```javascript
const unsubscribe = versionService.subscribe((newVersion) => {
  console.log(`⬆️ Нова версія: ${newVersion}`)
})

// Відписатись:
unsubscribe()
```

### `updateApp()`
Оновлює додаток (очищає кеш та перезавантажує).

```javascript
await versionService.updateApp()
```

### `startPeriodicCheck()` / `stopPeriodicCheck()`
Запускає/зупиняє періодичну перевірку.

```javascript
versionService.startPeriodicCheck()
// ... пізніше
versionService.stopPeriodicCheck()
```

## Примітки

- ✅ Автоматично інтегровано через `App.vue`
- ✅ Перша перевірка відбувається відразу при завантаженні
- ✅ Потім перевіряється кожні 5 хвилин
- ✅ В попапі показується версія для оновлення
- ✅ Видаляються ALL cookies, localStorage та Service Worker cache
- ✅ Браузер автоматично завантажує нову версію без артефактів

## Тестування

Для тестування в режимі розробки:

1. Змініть версію у `public/version.json`
2. Відкрийте DevTools (F12)
3. Чекайте 5 хвилин або вручну викличте:
```javascript
// У console:
import versionService from '/src/services/versionService.js'
versionService.checkForNewVersion()
```

4. Повинен з'явиться popup з новою версією
