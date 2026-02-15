/**
 * SERVICE VALIDATION HELPER
 * 
 * Допоміжні функції для валідації запитів у сервісах
 * та обробки помилок валідації.
 * 
 * Використання:
 * import { withValidation, validateAndHandle } from '@/services/serviceValidationHelper'
 * 
 * // Автоматична валідація
 * export const createDonation = withValidation('donation', 'create', async (data) => {
 *   // ваш код...
 * })
 */

import { validateRequest, getRequestExample, getContract } from './serviceContracts'

/**
 * Результат валідації
 */
export class ValidationResult {
  constructor(isValid, errors = [], data = {}) {
    this.isValid = isValid
    this.errors = errors
    this.data = data
    this.timestamp = new Date().toISOString()
  }
  
  /**
   * Перевірити чи валідація пройшла успішно
   */
  isSuccess() {
    return this.isValid && this.errors.length === 0
  }
  
  /**
   * Отримати повідомлення про помилки
   */
  getErrorMessage() {
    return this.errors.join('\n')
  }
  
  /**
   * Отримати перший помилку
   */
  getFirstError() {
    return this.errors[0] || null
  }
}

/**
 * Помилка валідації
 */
export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

/**
 * Валідувати та обробити помилку
 * 
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @param {Object} requestData - дані запиту
 * @returns {ValidationResult}
 */
export function validateAndHandle(serviceName, action, requestData = {}) {
  const result = validateRequest(serviceName, action, requestData)
  return new ValidationResult(result.isValid, result.errors, result.data)
}

/**
 * Обгорнути функцію сервісу з автоматичною валідацією
 * 
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @param {Function} handler - функція обробника
 * @returns {Function} обгорнута функція
 * 
 * @example
 * export const createDonation = withValidation('donation', 'create', async (validated) => {
 *   const { data, validation } = validated
 *   // use data that's already validated
 *   return await addDoc(collection(db, 'donations'), data)
 * })
 */
export function withValidation(serviceName, action, handler) {
  return async function wrappedFunction(requestData = {}) {
    const validation = validateAndHandle(serviceName, action, requestData)
    
    if (!validation.isSuccess()) {
      const error = new ValidationError(
        `Помилка валідації ${serviceName}/${action}:`,
        validation.errors
      )
      console.error('❌ Помилка валідації:', {
        service: serviceName,
        action: action,
        errors: validation.errors,
        receivedData: requestData
      })
      throw error
    }
    
    try {
      const result = await handler({
        data: validation.data,
        validation: validation,
        original: requestData
      })
      
      console.log('✅ Успішна операція:', {
        service: serviceName,
        action: action,
        timestamp: validation.timestamp
      })
      
      return result
    } catch (error) {
      console.error('❌ Помилка під час виконання:', {
        service: serviceName,
        action: action,
        error: error.message
      })
      throw error
    }
  }
}

/**
 * Логувати запит для дебагування
 * 
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @param {Object} requestData - дані запиту
 * @param {boolean} verbose - користуватися розширеним логуванням
 */
export function logRequest(serviceName, action, requestData = {}, verbose = false) {
  const contract = getContract(serviceName, action)
  const validation = validateAndHandle(serviceName, action, requestData)
  
  const log = {
    timestamp: new Date().toISOString(),
    service: serviceName,
    action: action,
    method: contract?.method || 'UNKNOWN',
    path: contract?.path || 'UNKNOWN',
    validation: {
      isValid: validation.isValid,
      errorCount: validation.errors.length,
      errors: validation.errors
    }
  }
  
  if (verbose) {
    log.requestData = requestData
    log.contract = contract
    log.example = {
      request: getRequestExample(serviceName, action, true),
      response: getRequestExample(serviceName, action, false)?.response
    }
  }
  
  console.group(`📋 Запит: ${serviceName}/${action}`)
  console.log(JSON.stringify(log, null, 2))
  console.groupEnd()
  
  return log
}

/**
 * Пропонувати виправлення для помилок валідації
 * 
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @param {Object} requestData - дані запиту
 * @returns {Object} { errors: Array, suggestions: Array, example: Object }
 */
export function suggestFixesForValidation(serviceName, action, requestData = {}) {
  const validation = validateAndHandle(serviceName, action, requestData)
  const example = getRequestExample(serviceName, action, true)
  const contract = getContract(serviceName, action)
  
  const suggestions = []
  
  if (!validation.isSuccess()) {
    validation.errors.forEach(error => {
      // Простiші пропозиції на основі помилок
      if (error.includes('мінімальна довжина')) {
        suggestions.push('Збільшіть довжину тексту')
      } else if (error.includes('максимальна довжина')) {
        suggestions.push('Зменшіть довжину тексту')
      } else if (error.includes('невідоме значення')) {
        const fieldName = error.split(':')[0]
        const schema = contract?.request?.schema?.[fieldName]
        if (schema?.enum) {
          suggestions.push(`Використайте одне з допустимих значень: ${schema.enum.join(', ')}`)
        }
      } else if (error.includes('очікувалося')) {
        suggestions.push('Перевірте тип даних')
      } else if (error.includes('Обов\'язкове поле')) {
        const fieldName = error.match(/\"([^"]+)\"/)?.[1]
        if (fieldName && example) {
          suggestions.push(`Додайте обов'язкове поле "${fieldName}". Приклад: ${JSON.stringify(example[fieldName])}`)
        }
      }
    })
  }
  
  return {
    errors: validation.errors,
    suggestions: [...new Set(suggestions)], // Видаляємо дублікати
    example: example
  }
}

/**
 * Перевірити дані перед відправленням на сервер
 * Керує помилками та пропонує виправлення
 * 
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @param {Object} requestData - дані запиту
 * @returns {Object} { isValid: boolean, validation: ValidationResult, suggestions: Array }
 */
export function validateBeforeSend(serviceName, action, requestData = {}) {
  console.group(`🔍 Перевірка перед відправленням: ${serviceName}/${action}`)
  
  const validation = validateAndHandle(serviceName, action, requestData)
  const suggestions = suggestFixesForValidation(serviceName, action, requestData)
  
  if (validation.isSuccess()) {
    console.log('✅ Дані валідні!')
    console.log('📦 Валідовані дані:', validation.data)
  } else {
    console.warn('❌ Знайдені помилки:')
    validation.errors.forEach((error, i) => {
      console.warn(`  ${i + 1}. ${error}`)
    })
    console.log('💡 Пропозиції:')
    suggestions.suggestions.forEach((suggestion, i) => {
      console.log(`  ${i + 1}. ${suggestion}`)
    })
    console.log('📝 Приклад коректного запиту:', suggestions.example)
  }
  
  console.groupEnd()
  
  return {
    isValid: validation.isSuccess(),
    validation: validation,
    suggestions: suggestions.suggestions,
    example: suggestions.example
  }
}

/**
 * Конвертувати помилку валідації у user-friendly повідомлення
 * 
 * @param {ValidationError|Error} error - помилка
 * @param {string} lang - мова ('uk' або 'en')
 * @returns {string}
 */
export function formatValidationError(error, lang = 'uk') {
  if (error instanceof ValidationError) {
    if (lang === 'uk') {
      return `❌ Помилка валідації:\n${error.errors.join('\n')}`
    } else {
      return `❌ Validation error:\n${error.errors.join('\n')}`
    }
  }
  
  if (lang === 'uk') {
    return `❌ Помилка: ${error.message}`
  } else {
    return `❌ Error: ${error.message}`
  }
}

/**
 * Об'єднати кілька запитів у одну валідацію
 * 
 * @param {Array} requests - масив { serviceName, action, data }
 * @returns {Object} { isAllValid: boolean, results: Array }
 */
export function validateMultiple(requests) {
  const results = requests.map(({ serviceName, action, data = {} }) => {
    return {
      serviceName,
      action,
      validation: validateAndHandle(serviceName, action, data)
    }
  })
  
  return {
    isAllValid: results.every(r => r.validation.isSuccess()),
    results: results,
    errors: results.filter(r => !r.validation.isSuccess())
  }
}

/**
 * Нормалізувати дані за контрактом (видалити зайві поля)
 * 
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @param {Object} data - дані для нормалізації
 * @returns {Object} нормалізовані дані
 */
export function normalizeData(serviceName, action, data = {}) {
  const contract = getContract(serviceName, action)
  
  if (!contract || !contract.request || contract.request === null) {
    return {}
  }
  
  const schema = contract.request.schema
  const normalized = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (key in schema) {
      normalized[key] = value
    }
  }
  
  return normalized
}

/**
 * Отримати приклад запиту з поясненнями
 * 
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @returns {Object} детальний приклад з поясненнями
 */
export function getDetailedExample(serviceName, action) {
  const contract = getContract(serviceName, action)
  
  if (!contract) {
    return null
  }
  
  return {
    method: contract.method,
    path: contract.path,
    description: contract.description || '',
    requestContract: contract.request,
    responseContract: contract.response,
    example: contract.example,
    summary: {
      requiredFields: contract.request?.required || [],
      optionalFields: contract.request?.schema ? 
        Object.keys(contract.request.schema).filter(
          k => !contract.request.required?.includes(k)
        ) : []
    }
  }
}
