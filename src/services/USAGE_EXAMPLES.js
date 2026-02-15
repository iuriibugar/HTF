/**
 * ПРИКЛАДИ ВИКОРИСТАННЯ API КОНТРАКТІВ У VUE КОМПОНЕНТАХ
 * 
 * Цей файл показує як інтегрувати валідацію контрактів у Vue форми
 */

// ============================================================================
// ПРИКЛАД 1: Форма для створення донату з валідацією
// ============================================================================

/*
<template>
  <div class="donation-form">
    <h2>Створити донат</h2>
    
    <!-- Виведення помилок валідації -->
    <div v-if="validationErrors.length" class="alert alert-danger">
      <h4>Помилки валідації:</h4>
      <ul>
        <li v-for="error in validationErrors" :key="error">{{ error }}</li>
      </ul>
    </div>
    
    <!-- Виведення пропозицій -->
    <div v-if="suggestions.length" class="alert alert-info">
      <h4>Пропозиції:</h4>
      <ul>
        <li v-for="suggestion in suggestions" :key="suggestion">{{ suggestion }}</li>
      </ul>
    </div>
    
    <!-- Форма -->
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="amount">Сума *</label>
        <input 
          v-model.number="form.amount" 
          type="number" 
          id="amount"
          class="form-control"
          :class="{ 'is-invalid': hasError('amount') }"
          placeholder="1000"
          step="0.01"
        >
        <small class="form-text text-muted">{{ getFieldInfo('amount')?.description }}</small>
      </div>
      
      <div class="form-group">
        <label for="currency">Валюта *</label>
        <select 
          v-model="form.currency" 
          id="currency"
          class="form-control"
          :class="{ 'is-invalid': hasError('currency') }"
        >
          <option value="">Виберіть валюту</option>
          <option>UAH</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
        <small class="form-text text-muted">{{ getFieldInfo('currency')?.description }}</small>
      </div>
      
      <div class="form-group">
        <label for="donorName">Ім'я донора *</label>
        <input 
          v-model="form.donorName" 
          type="text" 
          id="donorName"
          class="form-control"
          :class="{ 'is-invalid': hasError('donorName') }"
          placeholder="Іван Петренко"
        >
        <small class="form-text text-muted">{{ getFieldInfo('donorName')?.description }}</small>
      </div>
      
      <div class="form-group">
        <label for="donorEmail">Email донора *</label>
        <input 
          v-model="form.donorEmail" 
          type="email" 
          id="donorEmail"
          class="form-control"
          :class="{ 'is-invalid': hasError('donorEmail') }"
          placeholder="ivan@example.com"
        >
        <small class="form-text text-muted">{{ getFieldInfo('donorEmail')?.description }}</small>
      </div>
      
      <div class="form-group">
        <label for="description">Опис</label>
        <textarea 
          v-model="form.description" 
          id="description"
          class="form-control"
          :class="{ 'is-invalid': hasError('description') }"
          rows="3"
          placeholder="Спонсорство для команди"
        ></textarea>
        <small class="form-text text-muted">{{ getFieldInfo('description')?.description }}</small>
      </div>
      
      <div class="form-group">
        <label for="status">Статус</label>
        <select 
          v-model="form.status" 
          id="status"
          class="form-control"
          :class="{ 'is-invalid': hasError('status') }"
        >
          <option value="pending">Очікується</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Скасовано</option>
        </select>
        <small class="form-text text-muted">{{ getFieldInfo('status')?.description }}</small>
      </div>
      
      <button 
        type="submit" 
        class="btn btn-primary"
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? 'Завантаження...' : 'Створити донат' }}
      </button>
      
      <!-- Приклад коректних даних -->
      <div class="mt-3">
        <button 
          type="button" 
          class="btn btn-secondary btn-sm"
          @click="fillExample"
        >
          Заповнити приклад
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { createDonation, validateDonationBeforeCreate, getDonationExample, getDonationFieldInfo } from '@/services/donationService.example'

export default {
  name: 'DonationForm',
  data() {
    return {
      form: {
        amount: null,
        currency: '',
        donorName: '',
        donorEmail: '',
        description: '',
        status: 'pending'
      },
      validationErrors: [],
      suggestions: [],
      isLoading: false
    }
  },
  computed: {
    isFormValid() {
      return this.validationErrors.length === 0 && this.form.amount && this.form.currency && this.form.donorName && this.form.donorEmail
    }
  },
  watch: {
    form: {
      handler() {
        this.validateForm()
      },
      deep: true
    }
  },
  methods: {
    validateForm() {
      const result = validateDonationBeforeCreate(this.form)
      this.validationErrors = result.validation.errors
      this.suggestions = result.suggestions
    },
    
    hasError(fieldName) {
      return this.validationErrors.some(error => error.includes(fieldName))
    },
    
    getFieldInfo(fieldName) {
      return getDonationFieldInfo()[fieldName]
    },
    
    fillExample() {
      this.form = getDonationExample()
    },
    
    async submitForm() {
      if (!this.isFormValid) {
        this.$message.error('Виправте помилки валідації')
        return
      }
      
      this.isLoading = true
      try {
        const donationId = await createDonation(this.form)
        this.$message.success(`Донат створено! ID: ${donationId}`)
        
        // Очистити форму
        this.form = {
          amount: null,
          currency: '',
          donorName: '',
          donorEmail: '',
          description: '',
          status: 'pending'
        }
      } catch (error) {
        this.$message.error(error.message)
        console.error('Помилка створення донату:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.donation-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.is-invalid {
  border-color: #dc3545;
}

.alert {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.25rem;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-info {
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

button {
  width: 100%;
}
</style>
*/

// ============================================================================
// ПРИКЛАД 2: Сервіс для обробки помилок валідації в компонентах
// ============================================================================

/*
import { validateRequest, getAvailableServices, getAvailableActions } from '@/services/serviceContracts'
import { suggestFixesForValidation, getDetailedExample } from '@/services/serviceValidationHelper'

export const ValidationService = {
  // Перевірити форму перед відправленням
  // Повертає детальну інформацію про помилки
  validateForm(serviceName, action, formData) {
    const validation = validateRequest(serviceName, action, formData)
    const suggestions = suggestFixesForValidation(serviceName, action, formData)
    const example = getDetailedExample(serviceName, action)
    
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      suggestions: suggestions.suggestions,
      example: example?.example?.request,
      requiredFields: example?.summary?.requiredFields,
      optionalFields: example?.summary?.optionalFields,
      validated: validation.data
    }
  },
  
  // Отримати інформацію про допустимі значення поля
  getFieldConstraints(serviceName, action, fieldName) {
    const example = getDetailedExample(serviceName, action)
    if (!example || !example.requestContract) return null
    
    const schema = example.requestContract.schema
    return schema[fieldName] || null
  },
  
  // Отримати список обов'язкових та опціональних полів
  getFormStructure(serviceName, action) {
    const example = getDetailedExample(serviceName, action)
    if (!example) return null
    
    return {
      required: example.summary.requiredFields,
      optional: example.summary.optionalFields,
      example: example.example?.request
    }
  }
}
*/

// ============================================================================
// ПРИКЛАД 3: Реактивна валідація у реальному часі
// ============================================================================

/*
<script>
import { validateRequest } from '@/services/serviceContracts'

export default {
  data() {
    return {
      form: {
        email: '',
        amount: '',
        name: ''
      },
      fieldErrors: {
        email: [],
        amount: [],
        name: []
      }
    }
  },
  methods: {
    // Валідувати одне поле при введенні
    validateField(fieldName) {
      // Валідуємо тільки це поле
      const result = validateRequest('donation', 'create', {
        ...this.form,
        // Додаємо необхідні поля для валідації
        currency: this.form.currency || 'UAH'
      })
      
      // Фільтруємо помилки для цього поля
      this.fieldErrors[fieldName] = result.errors.filter(error => 
        error.toLowerCase().includes(fieldName)
      )
    },
    
    // Валідувати всю форму при сабміту
    validateAllFields() {
      const result = validateRequest('donation', 'create', this.form)
      
      // Розподіляємо помилки по полям
      Object.keys(this.fieldErrors).forEach(field => {
        this.fieldErrors[field] = result.errors.filter(error => 
          error.toLowerCase().includes(field)
        )
      })
      
      return result.isValid
    }
  }
}
</script>
*/

// ============================================================================
// ПРИКЛАД 4: Утіліта для відображення помилок валідації
// ============================================================================

/*
export function getErrorMessage(error, fieldName) {
  if (error.includes('мінімальна довжина')) {
    return `${fieldName}: мінімум символів не досягнуто`
  } else if (error.includes('максимальна довжина')) {
    return `${fieldName}: максимум символів перевищено`
  } else if (error.includes('мінімальне значення')) {
    const match = error.match(/отримано (.+)$/)
    const value = match ? match[1] : ''
    return `${fieldName}: значення не може бути меншим за допустиме`
  } else if (error.includes('невідоме значення')) {
    const match = error.match(/"([^"]+)"/)
    const value = match ? match[1] : ''
    return `${fieldName}: "${value}" не є допустимим значенням`
  } else if (error.includes('Обов\'язкове поле')) {
    return `${fieldName}: обов'язкове поле`
  }
  return error
}
*/

// ============================================================================
// ПРИКЛАД 5: Helper для конвертування Form Data у JSON
// ============================================================================

/*
import { normalizeData } from '@/services/serviceValidationHelper'

export function formDataToRequestJSON(serviceName, action, formData) {
  // 1. Нормалізуємо (видаляємо зайві поля)
  const normalized = normalizeData(serviceName, action, formData)
  
  // 2. Конвертуємо типи на основі контракту
  const result = {}
  const { getContract } = require('@/services/serviceContracts')
  const contract = getContract(serviceName, action)
  
  if (contract && contract.request) {
    const schema = contract.request.schema
    
    for (const [key, value] of Object.entries(normalized)) {
      const fieldSchema = schema[key]
      
      if (fieldSchema) {
        // Конвертуємо число
        if (fieldSchema.type === 'number' && typeof value === 'string') {
          result[key] = parseFloat(value)
        }
        // Конвертуємо дату
        else if (fieldSchema.type === 'date' && typeof value === 'string') {
          result[key] = new Date(value).toISOString().split('T')[0]
        }
        // Решта як є
        else {
          result[key] = value
        }
      }
    }
  }
  
  return result
}
*/

// ============================================================================
// ПРИКЛАД 6: Стейт для управління помилками в Vuex/Pinia
// ============================================================================

/*
export const validationStore = {
  namespaced: true,
  
  state() {
    return {
      currentService: null,
      currentAction: null,
      errors: [],
      suggestions: [],
      lastValidatedData: null,
      timestamp: null
    }
  },
  
  mutations: {
    setValidationResult(state, { service, action, errors, suggestions, data }) {
      state.currentService = service
      state.currentAction = action
      state.errors = errors
      state.suggestions = suggestions
      state.lastValidatedData = data
      state.timestamp = new Date().toISOString()
    },
    
    clearValidation(state) {
      state.currentService = null
      state.currentAction = null
      state.errors = []
      state.suggestions = []
      state.lastValidatedData = null
    }
  },
  
  actions: {
    validate({ commit }, { serviceName, action, data }) {
      const { validateBeforeSend } = require('@/services/serviceValidationHelper')
      
      const result = validateBeforeSend(serviceName, action, data)
      
      commit('setValidationResult', {
        service: serviceName,
        action: action,
        errors: result.validation.errors,
        suggestions: result.suggestions,
        data: result.validation.data
      })
      
      return result
    }
  },
  
  getters: {
    hasErrors: state => state.errors.length > 0,
    errorCount: state => state.errors.length,
    allErrors: state => state.errors.join('\n'),
    allSuggestions: state => state.suggestions.join('\n')
  }
}
*/

// ============================================================================
// ПРИКЛАД 7: Middleware для автоматичної валідації запитів
// ============================================================================

/*
 * Middleware для Vue/REST клієнта
 * Автоматично валідує запити перед відправленням
 *
 * @returns {Object} middleware об'єкт з interceptors
 *
 * @example
 * const middleware = createValidationMiddleware()
 * 
 * // Використання з API клієнтом:
 * apiClient.interceptors.request.use(middleware.interceptRequest)
 * apiClient.interceptors.response.use(middleware.interceptResponse)
 */
/*
export function createValidationMiddleware() {
  return {
    // interceptRequest - викликається перед відправленням запиту
    interceptRequest(config) {
      const { validateRequest } = require('@/services/serviceContracts')
      
      // Розпарсимо URL для визначення сервісу та дії
      // Приклад: /api/donations/create -> service: donation, action: create
      const pathMatch = config.url.match(/\/api\/(\w+)\/(\w+)/)
      
      if (pathMatch) {
        const [, serviceName, action] = pathMatch
        
        // Валідуємо дані запиту
        const validation = validateRequest(serviceName, action, config.data)
        
        if (!validation.isValid) {
          console.error('Помилка валідації запиту:', {
            service: serviceName,
            action: action,
            errors: validation.errors
          })
          
          // Можемо викинути помилку або просто залогувати попередження
          throw new Error(`Помилка валідації: ${validation.errors.join(', ')}`)
        }
        
        // Використовуємо валідовані дані
        config.data = validation.data
      }
      
      return config
    },
    
    // interceptResponse - викликається після отримання відповіді
    interceptResponse(response) {
      console.log('Дані успішно отримані:', response.data)
      return response
    }
  }
}
*/

export default {
  // Цей файл містить приклади коду для Vue компонентів
  // Розкомментуйте приклади які вам потрібні
}
