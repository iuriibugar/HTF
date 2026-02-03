# Firebase Hosting Deploy

## Першорядна установка (один раз):

```bash
# 1. Встановіть Firebase CLI глобально
npm install -g firebase-tools

# 2. Логін в Firebase
firebase login

# Відкриється браузер - виберіть Google Account під яким зареєстрований ваш Firebase проект
```

## Деплой на Firebase Hosting:

```bash
# Команда автоматично будує проект та деплоїть
npm run deploy:firebase
```

Або вручну:
```bash
npm run build
firebase deploy
```

## Де буде сайт?

Після першого деплою Firebase дасть вам URL типу:
```
https://your-project-id.web.app
https://your-project-id.firebaseapp.com
```

Перевірте в Firebase Console → Hosting → URL

## Переваги Firebase Hosting:

✅ HTTPS автоматично  
✅ Швидкий CDN по всьому світу  
✅ Безкоштовно (5GB storage, 360MB/день)  
✅ Прямо деплоїться з вашого комп'ютера  
✅ Оновлюється за 30 секунд  

## Проблеми?

Якщо `firebase login` не працює:
```bash
firebase login --no-localhost
```

Якщо проект не знайдений:
```bash
firebase use --add
# Виберіть проект зі списку
```
