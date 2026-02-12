#!/usr/bin/env node

/**
 * Скрипт для оновлення версії перед розгортанням
 * 
 * Використання:
 * node update-version.js patch   # 1.0.0 → 1.0.1
 * node update-version.js minor   # 1.0.0 → 1.1.0
 * node update-version.js major   # 1.0.0 → 2.0.0
 */

const fs = require('fs')
const path = require('path')

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
}

const versionFile = path.join(__dirname, 'public', 'version.json')

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`)
}

function getVersionType() {
  const type = process.argv[2]?.toLowerCase()
  if (['patch', 'minor', 'major'].includes(type)) {
    return type
  }

  log(COLORS.yellow, '📋 Вибір типу версії:')
  console.log('  1. patch  (1.0.0 → 1.0.1) - мініи виправлення')
  console.log('  2. minor  (1.0.0 → 1.1.0) - нові фіч')
  console.log('  3. major  (1.0.0 → 2.0.0) - великі зміни')
  log(COLORS.red, '\n❌ Помилка: вкажіть тип версіонування')
  log(COLORS.cyan, 'Використання: node update-version.js [patch|minor|major]')
  process.exit(1)
}

function incrementVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number)

  switch (type) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'major':
      return `${major + 1}.0.0`
  }
}

function getNotes() {
  log(COLORS.cyan, '\n📝 Введіть примітки до цієї версії (опціонально):')
  log(COLORS.cyan, '   Приклад: "Виправлення багів, нові фічі"')
  log(COLORS.cyan, '   Для пропуску натисніть Enter\n')

  // У скрипті Node.js не можна інтерактивно читати зі stdin без додаткових пакетів
  // Тому повертаємо порожний рядок
  return ''
}

try {
  // Перевіряємо наявність файлу
  if (!fs.existsSync(versionFile)) {
    log(COLORS.red, `❌ Файл не знайдено: ${versionFile}`)
    process.exit(1)
  }

  // Читаємо поточну версію
  const currentData = JSON.parse(fs.readFileSync(versionFile, 'utf-8'))
  const currentVersion = currentData.version
  const type = getVersionType()

  // Обчислюємо нову версію
  const newVersion = incrementVersion(currentVersion, type)

  // Готуємо новий об'єкт
  const newData = {
    version: newVersion,
    timestamp: new Date().toISOString(),
    notes: `Оновлення ${type} версії`
  }

  // Записуємо файл
  fs.writeFileSync(versionFile, JSON.stringify(newData, null, 2) + '\n')

  log(COLORS.green, '✅ Версія успішно оновлена!')
  log(COLORS.cyan, `   ${currentVersion} → ${newVersion}`)
  log(COLORS.cyan, `   Тип: ${type}`)
  log(COLORS.yellow, '\n⚡ Наступні кроки:')
  log(COLORS.cyan, '   1. git add public/version.json')
  log(COLORS.cyan, '   2. git commit -m "chore: bump version to ' + newVersion + '"')
  log(COLORS.cyan, '   3. npm run deploy')
} catch (error) {
  log(COLORS.red, `❌ Помилка: ${error.message}`)
  process.exit(1)
}
