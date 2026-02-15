/**
 * Валідація зображень для кабінету користувача
 */

// Константи
export const IMAGE_VALIDATION = {
  MAX_SIZE_MB: 2,
  MAX_SIZE_BYTES: 2 * 1024 * 1024, // 2MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png']
}

/**
 * Валідація зображення (тип та розмір)
 * @param {File} file - файл для валідації
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export function validateImage(file) {
  if (!file) {
    return {
      isValid: false,
      error: 'Файл не вибраний'
    }
  }

  // Перевіряємо тип файлу
  if (!IMAGE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Невірний формат файлу. Дозволені тільки: JPEG, PNG. Ви вибрали: ${file.type}`
    }
  }

  // Перевіряємо розширення файлу (додатковий контроль)
  const fileName = file.name.toLowerCase()
  const hasValidExtension = IMAGE_VALIDATION.ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext))
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Невірне розширення файлу. Дозволені: ${IMAGE_VALIDATION.ALLOWED_EXTENSIONS.join(', ')}`
    }
  }

  // Перевіряємо розмір файлу
  if (file.size > IMAGE_VALIDATION.MAX_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return {
      isValid: false,
      error: `Файл занадто великий. Максимум: ${IMAGE_VALIDATION.MAX_SIZE_MB}MB, ваш розмір: ${sizeMB}MB`
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Отримати інформацію про файл в зрозумілому форматі
 * @param {File} file - файл
 * @returns {Object} інформація про файл
 */
export function getImageInfo(file) {
  if (!file) return null

  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    lastModified: new Date(file.lastModified).toLocaleString('uk-UA')
  }
}

/**
 * Форматування розміру файлу в зрозумілий вигляд
 * @param {number} bytes - розмір в байтах
 * @returns {string} форматований розмір
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Перевірка, чи файл є завантажённим (для попередження переwrite)
 * @param {File} newFile - новий файл
 * @param {File} oldFile - старий файл
 * @returns {boolean} true якщо файли різні
 */
export function isFileChanged(newFile, oldFile) {
  if (!newFile && !oldFile) return false
  if (!newFile || !oldFile) return true
  
  return newFile.name !== oldFile.name || 
         newFile.size !== oldFile.size || 
         newFile.lastModified !== oldFile.lastModified
}
