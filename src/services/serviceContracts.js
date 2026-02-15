/**
 * SERVICE CONTRACTS
 * 
 * Цей файл описує контракти для всіх сервісів.
 * Містить схеми, приклади JSON та функції валідації запитів.
 * 
 * Використання:
 * import { contracts, validateRequest } from '@/services/serviceContracts'
 * 
 * validateRequest('donation', 'create', donationData) // перевіряє дані донату
 */

// ============================================================================
// DONATION SERVICE CONTRACTS
// ============================================================================

export const donationContracts = {
  /**
   * GET /donations - Отримати всі благодійні збори/проєкти
   */
  getAll: {
    method: 'GET',
    path: '/donations',
    request: null,
    response: {
      type: 'array',
      schema: {
        id: { type: 'string', description: 'Унікальний ID проекту' },
        title: { type: 'string', description: 'Назва проекту', minLength: 1, maxLength: 200 },
        description: { type: 'string', description: 'Опис проекту', maxLength: 2000 },
        imageBase64: { type: 'string', description: 'Зображення в base64 форматі (data:image/png;base64,...)' },
        link: { type: 'string', description: 'Посилання на платіж (Monobank, тощо)', format: 'uri' },
        createdAt: { type: 'string', format: 'date-time', description: 'Дата створення' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Дата оновлення' }
      }
    },
    example: {
      request: null,
      response: [
        {
          id: 'donation_123',
          title: 'Донат Фюрер',
          description: 'Збирає на пісюни і автівки',
          imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          link: 'https://send.monobank.ua/jar/5TPzVYBKpT?utm_source=ig&utm_medium=social&utm_content=link_in_bio',
          createdAt: '2026-01-23T10:06:00.056Z',
          updatedAt: '2026-01-23T10:32:25.820Z'
        }
      ]
    }
  },

  /**
   * POST /donations - Створити новий проект благодійного збору
   */
  create: {
    method: 'POST',
    path: '/donations',
    request: {
      type: 'object',
      required: ['title', 'description', 'imageBase64'],
      schema: {
        title: { type: 'string', minLength: 2, maxLength: 200, description: 'Назва проекту' },
        description: { type: 'string', minLength: 10, maxLength: 2000, description: 'Опис проекту' },
        imageBase64: { type: 'string', description: 'Зображення в base64 (data:image/png;base64,...)' },
        link: { type: 'string', format: 'uri', description: 'Посилання на платіж (опціонально)' }
      }
    },
    response: {
      type: 'object',
      schema: {
        id: { type: 'string', description: 'ID новоствореного проекту' }
      }
    },
    example: {
      request: {
        title: 'Донат Фюрер',
        description: 'Збирає на пісюни і автівки для розвитку проекту',
        imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        link: 'https://send.monobank.ua/jar/5TPzVYBKpT'
      },
      response: {
        id: 'donation_456'
      }
    }
  },

  /**
   * PUT /donations/:id - Оновити проект благодійного збору
   */
  update: {
    method: 'PUT',
    path: '/donations/:id',
    request: {
      type: 'object',
      schema: {
        title: { type: 'string', minLength: 2, maxLength: 200 },
        description: { type: 'string', minLength: 10, maxLength: 2000 },
        imageBase64: { type: 'string', description: 'Зображення в base64 (data:image/...)' },
        link: { type: 'string', format: 'uri', description: 'Посилання на платіж' }
      }
    },
    response: {
      type: 'object',
      schema: {
        id: { type: 'string', description: 'ID оновленого проекту' }
      }
    },
    example: {
      request: {
        title: 'Донат Фюрер - Оновлено',
        description: 'Оновлений опис проекту',
        link: 'https://send.monobank.ua/jar/5TPzVYBKpT'
      },
      response: {
        id: 'donation_456'
      }
    }
  },

  /**
   * DELETE /donations/:id - Видалити проект благодійного збору
   */
  delete: {
    method: 'DELETE',
    path: '/donations/:id',
    request: null,
    response: {
      type: 'boolean'
    },
    example: {
      request: null,
      response: true
    }
  }
}

// ============================================================================
// USER SERVICE CONTRACTS
// ============================================================================

export const userContracts = {
  /**
   * PUT /users/:uid - Створити/Оновити профіль користувача
   */
  createOrUpdateProfile: {
    method: 'PUT',
    path: '/users/:uid',
    request: {
      type: 'object',
      schema: {
        firstName: { type: 'string', maxLength: 100 },
        lastName: { type: 'string', maxLength: 100 },
        phone: { type: 'string', pattern: '^\\+?[0-9\\-\\s\\(\\)]{7,}$' },
        city: { type: 'string', maxLength: 100 },
        experienceLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'professional'] }
      }
    },
    response: {
      type: 'object',
      schema: {
        uid: { type: 'string', description: 'Унікальний ID користувача (Firebase UID)' },
        email: { type: 'string', format: 'email', description: 'Email користувача' },
        emailVerified: { type: 'boolean', description: 'Email верифікований' },
        displayName: { type: 'string', description: 'Відображуване ім\'я' },
        photoURL: { type: 'string', format: 'uri', description: 'URL фото з Firebase' },
        photoBase64: { type: 'string', description: 'Base64 кодоване фото користувача' },
        firstName: { type: 'string', description: 'Ім\'я' },
        lastName: { type: 'string', description: 'Прізвище' },
        phone: { type: 'string', description: 'Номер телефону' },
        city: { type: 'string', description: 'Місто' },
        experienceLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'professional'], description: 'Рівень досвіду' },
        role: { type: 'string', enum: ['user', 'admin'], description: 'Роль користувача' },
        isApproved: { type: 'boolean', description: 'Затверджено адміном' },
        isDeleted: { type: 'boolean', description: 'Акаунт видалено (soft delete)' },
        status: { type: 'string', enum: ['active', 'inactive', 'banned'], description: 'Статус користувача' },
        registeredAt: { type: 'string', format: 'date-time', description: 'ISO 8601 дата реєстрації' },
        lastLoginAt: { type: 'string', format: 'date-time', description: 'ISO 8601 час останнього входу' },
        loginCount: { type: 'number', description: 'Кількість входів' },
        notes: { type: 'string', description: 'Адмін примітки (причина видалення, бану тощо)' },
        updatedAt: { type: 'string', format: 'date-time', description: 'ISO 8601 час останнього оновлення' },
        updatedBy: { type: 'string', description: 'UID адміна який оновив' },
        amount: { type: 'number', description: 'Баланс віртуальних монет' },
        balanceUpdatedAt: { type: 'string', format: 'date-time', description: 'Час оновлення балансу' },
        balanceUpdatedBy: { type: 'string', description: 'UID адміна що оновив баланс' },
        discount: {
          type: 'object',
          schema: {
            percent: { type: 'number', description: 'Відсоток знижки' },
            appliedAt: { type: 'string', format: 'date-time', description: 'Час застосування' },
            appliedBy: { type: 'string', description: 'UID адміна що застосував' },
            previousAmount: { type: 'number', description: 'Попередній баланс' }
          },
          description: 'Інформація про знижку'
        },
        trainingStats: {
          type: 'object',
          schema: {
            swimming: { type: 'object', properties: { registered: { type: 'number' } } },
            cycling: { type: 'object', properties: { registered: { type: 'number' } } },
            running: { type: 'object', properties: { registered: { type: 'number' } } },
            other: { type: 'object', properties: { registered: { type: 'number' } } }
          },
          description: 'Статистика тренувань по типам'
        },
        subscriptions: { type: 'array', description: 'Підписки на тренування' }
      }
    },
    example: {
      request: {
        firstName: 'Іван',
        lastName: 'Петренко',
        phone: '+380671234567',
        city: 'Київ',
        experienceLevel: 'intermediate'
      },
      response: {
        uid: 'user_uid_123',
        email: 'ivan@example.com',
        emailVerified: true,
        displayName: 'Ivan Petrenko',
        photoURL: 'https://lh3.googleusercontent.com/photo.jpg',
        photoBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYA...',
        firstName: 'Іван',
        lastName: 'Петренко',
        phone: '+380671234567',
        city: 'Київ',
        experienceLevel: 'intermediate',
        role: 'user',
        isApproved: true,
        isDeleted: false,
        status: 'active',
        registeredAt: '2026-01-01T10:30:00Z',
        lastLoginAt: '2026-02-13T14:20:00Z',
        loginCount: 45,
        notes: null,
        updatedAt: '2026-02-13T14:20:00Z',
        updatedBy: 'admin_uid_456',
        amount: 50,
        balanceUpdatedAt: '2026-02-03T10:32:05.319Z',
        balanceUpdatedBy: 'admin_uid_456',
        discount: {
          percent: 25,
          appliedAt: '2026-02-03T10:32:13.382Z',
          appliedBy: 'admin_uid_456',
          previousAmount: 50
        },
        trainingStats: {
          swimming: { registered: 3 },
          cycling: { registered: 5 },
          running: { registered: 2 },
          other: { registered: 1 }
        },
        subscriptions: []
      }
    }
  }
}

// ============================================================================
// USER ADMIN OPERATIONS - CONTRACTS
// ============================================================================

export const userAdminContracts = {
  /**
   * GET /users - Отримати всіх користувачів (тільки адмін)
   */
  getAllUsers: {
    method: 'GET',
    path: '/users',
    request: null,
    response: {
      type: 'array',
      schema: {
        uid: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'string' },
        isApproved: { type: 'boolean' },
        status: { type: 'string' },
        registeredAt: { type: 'string', format: 'date-time' }
      }
    },
    example: {
      request: null,
      response: [
        {
          uid: 'user_123',
          email: 'user@example.com',
          firstName: 'Іван',
          lastName: 'Петренко',
          role: 'user',
          isApproved: true,
          status: 'active',
          registeredAt: '2026-01-01T10:30:00Z'
        }
      ]
    }
  },

  /**
   * GET /users/pending - Отримати користувачів, що чекають затвердження
   */
  getPendingUsers: {
    method: 'GET',
    path: '/users/pending',
    request: null,
    response: {
      type: 'array',
      schema: {
        uid: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        registeredAt: { type: 'string', format: 'date-time' }
      }
    },
    example: {
      request: null,
      response: [
        {
          uid: 'user_456',
          email: 'newuser@example.com',
          firstName: 'Марія',
          lastName: 'Іванівна',
          registeredAt: '2026-02-13T14:20:00Z'
        }
      ]
    }
  },

  /**
   * PATCH /users/:uid/approval - Затвердити/відхилити користувача
   */
  approveUser: {
    method: 'PATCH',
    path: '/users/:uid/approval',
    request: {
      type: 'object',
      required: ['isApproved', 'adminUid'],
      schema: {
        isApproved: { type: 'boolean', description: 'Статус затвердження' },
        adminUid: { type: 'string', description: 'UID адміна' }
      }
    },
    response: {
      type: 'object',
      schema: {
        success: { type: 'boolean' }
      }
    },
    example: {
      request: {
        isApproved: true,
        adminUid: 'admin_uid_123'
      },
      response: {
        success: true
      }
    }
  },

  /**
   * PATCH /users/:uid/role - Змінити роль користувача
   */
  changeUserRole: {
    method: 'PATCH',
    path: '/users/:uid/role',
    request: {
      type: 'object',
      required: ['role', 'adminUid'],
      schema: {
        role: { type: 'string', enum: ['user', 'admin'], description: 'Нова роль' },
        adminUid: { type: 'string', description: 'UID адміна' }
      }
    },
    response: {
      type: 'object',
      schema: {
        success: { type: 'boolean' }
      }
    },
    example: {
      request: {
        role: 'admin',
        adminUid: 'admin_uid_123'
      },
      response: {
        success: true
      }
    }
  },

  /**
   * PATCH /users/:uid/status - Змінити статус користувача
   */
  changeUserStatus: {
    method: 'PATCH',
    path: '/users/:uid/status',
    request: {
      type: 'object',
      required: ['status', 'adminUid'],
      schema: {
        status: { type: 'string', enum: ['active', 'inactive', 'banned'], description: 'Новий статус' },
        adminUid: { type: 'string', description: 'UID адміна' }
      }
    },
    response: {
      type: 'object',
      schema: {
        success: { type: 'boolean' }
      }
    },
    example: {
      request: {
        status: 'banned',
        adminUid: 'admin_uid_123'
      },
      response: {
        success: true
      }
    }
  },

  /**
   * PATCH /users/:uid/notes - Додати адмін коментар
   */
  addAdminNotes: {
    method: 'PATCH',
    path: '/users/:uid/notes',
    request: {
      type: 'object',
      required: ['notes', 'adminUid'],
      schema: {
        notes: { type: 'string', maxLength: 1000, description: 'Коментар адміна' },
        adminUid: { type: 'string', description: 'UID адміна' }
      }
    },
    response: {
      type: 'object',
      schema: {
        success: { type: 'boolean' }
      }
    },
    example: {
      request: {
        notes: 'Користувач порушив правила сайту',
        adminUid: 'admin_uid_123'
      },
      response: {
        success: true
      }
    }
  },

  /**
   * PATCH /users/:uid/balance - Оновити баланс користувача
   */
  updateUserBalance: {
    method: 'PATCH',
    path: '/users/:uid/balance',
    request: {
      type: 'object',
      required: ['amount', 'adminUid'],
      schema: {
        amount: { type: 'number', description: 'Новий баланс (не може бути від\'ємним)' },
        adminUid: { type: 'string', description: 'UID адміна' },
        discountInfo: {
          type: 'object',
          schema: {
            percent: { type: 'number', description: 'Відсоток знижки' },
            previousAmount: { type: 'number', description: 'Попередній баланс' }
          },
          description: 'Інформація про знижку (опціонально)'
        }
      }
    },
    response: {
      type: 'object',
      schema: {
        success: { type: 'boolean' }
      }
    },
    example: {
      request: {
        amount: 100,
        adminUid: 'admin_uid_123',
        discountInfo: {
          percent: 25,
          previousAmount: 50
        }
      },
      response: {
        success: true
      }
    }
  },

  /**
   * DELETE /users/:uid - Видалити користувача (soft delete)
   */
  deleteUser: {
    method: 'DELETE',
    path: '/users/:uid',
    request: {
      type: 'object',
      required: ['adminUid'],
      schema: {
        adminUid: { type: 'string', description: 'UID адміна' },
        reason: { type: 'string', maxLength: 500, description: 'Причина видалення (опціонально)' }
      }
    },
    response: {
      type: 'object',
      schema: {
        success: { type: 'boolean' }
      }
    },
    example: {
      request: {
        adminUid: 'admin_uid_123',
        reason: 'Порушення правил використання'
      },
      response: {
        success: true
      }
    }
  }
}

// ============================================================================
// TRAINER SERVICE CONTRACTS
// ============================================================================

export const trainerContracts = {
  /**
   * GET /trainers - Отримати всіх тренерів
   */
  getAll: {
    method: 'GET',
    path: '/trainers',
    request: null,
    response: {
      type: 'array',
      schema: {
        id: { type: 'string', description: 'Унікальний ID тренера' },
        firstName: { type: 'string', description: 'Ім\'я тренера' },
        lastName: { type: 'string', description: 'Прізвище тренера' },
        imageBase64: { type: 'string', description: 'Фото в base64 форматі' },
        description: { type: 'string', description: 'Опис та біографія' },
        instagramLink: { type: 'string', description: 'Посилання на Instagram' },
        order: { type: 'number', description: 'Порядковий номер для сортування' },
        createdAt: { type: 'string', format: 'date-time', description: 'Дата створення' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Дата оновлення' }
      }
    },
    example: {
      request: null,
      response: [
        {
          id: 'trainer_123',
          firstName: 'Іван',
          lastName: 'Петренко',
          imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYA...',
          description: 'Професійний тренер з плавання з 10+ років досвіду',
          instagramLink: 'https://instagram.com/ivanpetrenko',
          order: 1,
          createdAt: '2026-01-01T10:00:00Z',
          updatedAt: '2026-02-15T14:00:00Z'
        }
      ]
    }
  },

  /**
   * POST /trainers - Створити нового тренера
   */
  create: {
    method: 'POST',
    path: '/trainers',
    request: {
      type: 'object',
      required: ['firstName', 'lastName', 'imageBase64', 'description'],
      schema: {
        firstName: { type: 'string', minLength: 1, maxLength: 100, description: 'Ім\'я' },
        lastName: { type: 'string', minLength: 1, maxLength: 100, description: 'Прізвище' },
        imageBase64: { type: 'string', description: 'Фото в base64 форматі (data:image/...)' },
        description: { type: 'string', minLength: 10, maxLength: 2000, description: 'Опис' },
        instagramLink: { type: 'string', format: 'uri', description: 'Посилання на Instagram (опціонально)' },
        order: { type: 'number', description: 'Порядковий номер (опціонально)' }
      }
    },
    response: {
      type: 'object',
      schema: {
        id: { type: 'string', description: 'ID новоствореного тренера' }
      }
    },
    example: {
      request: {
        firstName: 'Мар\'яна',
        lastName: 'Леонідівна',
        imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYA...',
        description: 'Тренер з велоспорту. Чемпіонка України. Допоможе вам досягти рекордних результатів!',
        instagramLink: 'https://instagram.com/mariana_sports',
        order: 2
      },
      response: {
        id: 'trainer_456'
      }
    }
  },

  /**
   * PUT /trainers/:id - Оновити тренера
   */
  update: {
    method: 'PUT',
    path: '/trainers/:id',
    request: {
      type: 'object',
      schema: {
        firstName: { type: 'string', maxLength: 100 },
        lastName: { type: 'string', maxLength: 100 },
        imageBase64: { type: 'string' },
        description: { type: 'string', maxLength: 2000 },
        instagramLink: { type: 'string', format: 'uri' },
        order: { type: 'number', description: 'Порядковий номер' }
      }
    },
    response: {
      type: 'object',
      schema: {
        success: { type: 'boolean' }
      }
    },
    example: {
      request: {
        description: 'Оновлена біографія тренера...',
        order: 3
      },
      response: {
        success: true
      }
    }
  },

  /**
   * DELETE /trainers/:id - Видалити тренера
   */
  delete: {
    method: 'DELETE',
    path: '/trainers/:id',
    request: null,
    response: {
      type: 'object',
      schema: {
        success: { type: 'boolean' }
      }
    },
    example: {
      request: null,
      response: {
        success: true
      }
    }
  }
}

// ============================================================================
// REGISTRATION SERVICE CONTRACTS
// ============================================================================

export const registrationContracts = {
  /**
   * POST /registrations - Зареєструватися на тренування
   * Document ID: {userEmail}_{uniqueId}
   */
  register: {
    method: 'POST',
    path: '/registrations',
    request: {
      type: 'object',
      required: ['trainingType', 'scheduleId', 'trainingDate', 'trainingTime', 'trainingId', 'trainingName', 'userEmail', 'userId', 'userName'],
      schema: {
        trainingType: {
          type: 'string',
          enum: ['swimming', 'cycling', 'running', 'other'],
          description: 'Тип тренування'
        },
        scheduleId: {
          type: 'string',
          description: 'ID розкладу'
        },
        trainingId: {
          type: 'string',
          pattern: '^.+_\d{4}-\d{2}-\d{2}_\d{2}:\d{2}$',
          description: 'ID тренування у форматі: scheduleId_дата_час'
        },
        trainingName: {
          type: 'string',
          maxLength: 255,
          description: 'Назва тренування'
        },
        trainingDate: {
          type: 'string',
          format: 'date',
          description: 'Дата тренування (YYYY-MM-DD)'
        },
        trainingTime: {
          type: 'string',
          pattern: '^\d{2}:\d{2}$',
          description: 'Час тренування (HH:mm)'
        },
        userEmail: {
          type: 'string',
          format: 'email',
          description: 'Email користувача'
        },
        userId: {
          type: 'string',
          description: 'Firebase UID користувача'
        },
        userName: {
          type: 'string',
          maxLength: 200,
          description: 'Ім\'я користувача'
        }
      }
    },
    response: {
      type: 'object',
      schema: {
        id: { type: 'string', description: 'ID реєстрації (Document ID у форматі email_uniqueId)' },
        registeredAt: { type: 'string', format: 'date-time', description: 'ISO 8601 дата реєстрації' }
      }
    },
    example: {
      request: {
        trainingType: 'swimming',
        scheduleId: 'lTB6o6MR6sJG1GERIvRn',
        trainingDate: '2025-11-26',
        trainingTime: '07:00',
        trainingId: 'lTB6o6MR6sJG1GERIvRn_2025-11-26_07:00',
        trainingName: 'Брик тренування',
        userEmail: 'iuriibugar@gmail.com',
        userId: 'Zz8PUCdrRRV7f9C7Xq4flHa5jrx1',
        userName: 'Iurii Bugar'
      },
      response: {
        id: 'iuriibugar@gmail.com_uniqueId123',
        registeredAt: '2025-11-25T21:51:20.229Z'
      }
    }
  },

  /**
   * GET /registrations/user/:userId - Отримати реєстрації користувача
   */
  getUserRegistrations: {
    method: 'GET',
    path: '/registrations/user/:userId',
    request: null,
    response: {
      type: 'array',
      schema: {
        id: { type: 'string', description: 'ID реєстрації' },
        trainingId: { type: 'string' },
        trainingName: { type: 'string' },
        trainingDate: { type: 'string', format: 'date' },
        trainingTime: { type: 'string' },
        trainingType: { type: 'string' },
        scheduleId: { type: 'string' },
        registeredAt: { type: 'string', format: 'date-time' }
      }
    },
    example: {
      request: null,
      response: [
        {
          id: 'iuriibugar@gmail.com_uniqueId123',
          trainingId: 'lTB6o6MR6sJG1GERIvRn_2025-11-26_07:00',
          trainingName: 'Брик тренування',
          trainingDate: '2025-11-26',
          trainingTime: '07:00',
          trainingType: 'swimming',
          scheduleId: 'lTB6o6MR6sJG1GERIvRn',
          registeredAt: '2025-11-25T21:51:20.229Z'
        },
        {
          id: 'iuriibugar@gmail.com_uniqueId124',
          trainingId: 'lTB6o6MR6sJG1GERIvRn_2025-11-27_09:00',
          trainingName: 'Вечірнє плавання',
          trainingDate: '2025-11-27',
          trainingTime: '09:00',
          trainingType: 'swimming',
          scheduleId: 'lTB6o6MR6sJG1GERIvRn',
          registeredAt: '2025-11-25T22:15:45.123Z'
        }
      ]
    }
  },

  /**
   * GET /registrations/schedule/:scheduleId - Отримати реєстрації розкладу
   */
  getScheduleRegistrations: {
    method: 'GET',
    path: '/registrations/schedule/:scheduleId',
    request: null,
    response: {
      type: 'array',
      schema: {
        id: { type: 'string', description: 'ID реєстрації (email_uniqueId)' },
        userId: { type: 'string' },
        userName: { type: 'string' },
        userEmail: { type: 'string', format: 'email' },
        trainingType: { type: 'string' },
        trainingId: { type: 'string' },
        trainingName: { type: 'string' },
        trainingDate: { type: 'string', format: 'date' },
        trainingTime: { type: 'string' },
        scheduleId: { type: 'string' },
        registeredAt: { type: 'string', format: 'date-time' }
      }
    },
    example: {
      request: null,
      response: [
        {
          id: 'iuriibugar@gmail.com_uniqueId123',
          userId: 'Zz8PUCdrRRV7f9C7Xq4flHa5jrx1',
          userName: 'Iurii Bugar',
          userEmail: 'iuriibugar@gmail.com',
          trainingType: 'swimming',
          trainingId: 'lTB6o6MR6sJG1GERIvRn_2025-11-26_07:00',
          trainingName: 'Брик тренування',
          trainingDate: '2025-11-26',
          trainingTime: '07:00',
          scheduleId: 'lTB6o6MR6sJG1GERIvRn',
          registeredAt: '2025-11-25T21:51:20.229Z'
        }
      ]
    }
  },

  /**
   * GET /registrations/training/:trainingId - Отримати реєстрації тренування
   */
  getTrainingRegistrations: {
    method: 'GET',
    path: '/registrations/training/:trainingId',
    request: null,
    response: {
      type: 'array',
      schema: {
        id: { type: 'string', description: 'ID реєстрації (email_uniqueId)' },
        userId: { type: 'string' },
        userName: { type: 'string' },
        userEmail: { type: 'string', format: 'email' },
        trainingType: { type: 'string' },
        trainingId: { type: 'string' },
        trainingName: { type: 'string' },
        trainingDate: { type: 'string', format: 'date' },
        trainingTime: { type: 'string' },
        scheduleId: { type: 'string' },
        registeredAt: { type: 'string', format: 'date-time' }
      }
    },
    example: {
      request: null,
      response: [
        {
          id: 'iuriibugar@gmail.com_uniqueId123',
          userId: 'Zz8PUCdrRRV7f9C7Xq4flHa5jrx1',
          userName: 'Iurii Bugar',
          userEmail: 'iuriibugar@gmail.com',
          trainingType: 'swimming',
          trainingId: 'lTB6o6MR6sJG1GERIvRn_2025-11-26_07:00',
          trainingName: 'Брик тренування',
          trainingDate: '2025-11-26',
          trainingTime: '07:00',
          scheduleId: 'lTB6o6MR6sJG1GERIvRn',
          registeredAt: '2025-11-25T21:51:20.229Z'
        },
        {
          id: 'maria@example.com_uniqueId456',
          userId: 'user_124',
          userName: 'Марія Сидоренко',
          userEmail: 'maria@example.com',
          trainingType: 'swimming',
          trainingId: 'lTB6o6MR6sJG1GERIvRn_2025-11-26_07:00',
          trainingName: 'Брик тренування',
          trainingDate: '2025-11-26',
          trainingTime: '07:00',
          scheduleId: 'lTB6o6MR6sJG1GERIvRn',
          registeredAt: '2025-11-25T21:55:30.456Z'
        }
      ]
    }
  },

  /**
   * DELETE /registrations/:registrationId - Скасувати реєстрацію
   * registrationId: Document ID у форматі {userEmail}_{uniqueId}
   */
  cancelRegistration: {
    method: 'DELETE',
    path: '/registrations/:registrationId',
    request: null,
    response: {
      type: 'boolean',
      description: 'True якщо реєстрацію скасовано успішно'
    },
    example: {
      request: null,
      response: true
    }
  }
}

// ============================================================================
// SCHEDULE SERVICE CONTRACTS
// ============================================================================

export const scheduleContracts = {
  /**
   * GET /schedules - Отримати всі розклади
   */
  getAll: {
    method: 'GET',
    path: '/schedules',
    request: null,
    response: {
      type: 'array',
      schema: {
        id: { type: 'string', description: 'Firestore Document ID' },
        weekStart: { type: 'string', format: 'date', description: 'Понеділок тижня (YYYY-MM-DD)' },
        weekEnd: { type: 'string', format: 'date', description: 'Неділя тижня (YYYY-MM-DD)' },
        createdAt: { type: 'string', format: 'date-time', description: 'ISO 8601 час створення' },
        createdBy: { type: 'string', format: 'email', description: 'Email адміна що створив' },
        trainings: {
          type: 'array',
          items: {
            type: 'object',
            schema: {
              name: { type: 'string', description: 'Назва тренування (Плавання, Велосипед, тощо)' },
              type: { type: 'string', enum: ['swimming', 'cycling', 'running', 'other'], description: 'Тип тренування' },
              date: { type: 'string', format: 'date', description: 'Дата тренування (YYYY-MM-DD)' },
              dayName: { type: 'string', enum: ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'], description: 'Назва дня тижня' },
              time: { type: 'string', pattern: '^\\d{2}:\\d{2}$', description: 'Час початку (HH:mm)' },
              address: { type: 'string', maxLength: 500, description: 'Місце проведення' },
              difficulty: { type: 'string', enum: ['ELEMENTARY', 'INTERMEDIATE', 'ADVANCED'], description: 'Рівень складності' },
              isPaid: { type: 'boolean', description: 'Платне чи безплатне тренування' },
              createdAt: { type: 'string', format: 'date-time', description: 'ISO 8601 час створення' },
              createdBy: { type: 'string', format: 'email', description: 'Email адміна що створив' }
            }
          }
        }
      }
    },
    example: {
      request: null,
      response: [
        {
          id: 'schedule_feb9',
          weekStart: '2026-02-09',
          weekEnd: '2026-02-15',
          createdAt: '2026-02-13T13:44:46.595Z',
          createdBy: 'kulikalovdenis@gmail.com',
          trainings: [
            {
              name: 'Плавання',
              type: 'swimming',
              date: '2026-02-09',
              dayName: 'Понеділок',
              time: '07:00',
              address: 'Басейн КНТУ, вул. М. Бойчука 36А',
              difficulty: 'ELEMENTARY',
              isPaid: true,
              createdAt: '2026-02-13T13:44:46.594Z',
              createdBy: 'kulikalovdenis@gmail.com'
            },
            {
              name: 'Плавання',
              type: 'swimming',
              date: '2026-02-09',
              dayName: 'Понеділок',
              time: '19:00',
              address: 'Басейн КНТУ, вул. М. Бойчука 36А',
              difficulty: 'INTERMEDIATE',
              isPaid: true,
              createdAt: '2026-02-13T13:44:46.594Z',
              createdBy: 'kulikalovdenis@gmail.com'
            },
            {
              name: 'Indoor Zwift',
              type: 'cycling',
              date: '2026-02-10',
              dayName: 'Вівторок',
              time: '19:00',
              address: 'Вдома',
              difficulty: 'ELEMENTARY',
              isPaid: false,
              createdAt: '2026-02-13T13:44:46.594Z',
              createdBy: 'kulikalovdenis@gmail.com'
            }
          ]
        }
      ]
    }
  },

  /**
   * GET /schedules/week - Отримати розклад для поточного тижня
   */
  getForWeek: {
    method: 'GET',
    path: '/schedules/week?monday=YYYY-MM-DD&sunday=YYYY-MM-DD',
    request: {
      type: 'object',
      schema: {
        monday: { type: 'string', format: 'date', description: 'Понеділок' },
        sunday: { type: 'string', format: 'date', description: 'Неділя' }
      }
    },
    response: {
      type: 'object',
      schema: {
        id: { type: 'string', description: 'Firestore Document ID' },
        weekStart: { type: 'string', format: 'date', description: 'Понеділок тижня (YYYY-MM-DD)' },
        weekEnd: { type: 'string', format: 'date', description: 'Неділя тижня (YYYY-MM-DD)' },
        createdAt: { type: 'string', format: 'date-time', description: 'ISO 8601 час створення' },
        createdBy: { type: 'string', format: 'email', description: 'Email адміна що створив' },
        trainings: {
          type: 'array',
          items: {
            type: 'object',
            schema: {
              name: { type: 'string' },
              type: { type: 'string', enum: ['swimming', 'cycling', 'running', 'other'] },
              date: { type: 'string', format: 'date' },
              dayName: { type: 'string' },
              time: { type: 'string', pattern: '^\\d{2}:\\d{2}$' },
              address: { type: 'string' },
              difficulty: { type: 'string', enum: ['ELEMENTARY', 'INTERMEDIATE', 'ADVANCED'] },
              isPaid: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              createdBy: { type: 'string', format: 'email' }
            }
          }
        }
      }
    },
    example: {
      request: {
        monday: '2026-02-09',
        sunday: '2026-02-15'
      },
      response: {
        id: 'schedule_feb9',
        weekStart: '2026-02-09',
        weekEnd: '2026-02-15',
        createdAt: '2026-02-13T13:44:46.595Z',
        createdBy: 'kulikalovdenis@gmail.com',
        trainings: [
          {
            name: 'Плавання',
            type: 'swimming',
            date: '2026-02-09',
            dayName: 'Понеділок',
            time: '07:00',
            address: 'Басейн КНТУ, вул. М. Бойчука 36А',
            difficulty: 'ELEMENTARY',
            isPaid: true,
            createdAt: '2026-02-13T13:44:46.594Z',
            createdBy: 'kulikalovdenis@gmail.com'
          },
          {
            name: 'Інтервальне тренування',
            type: 'running',
            date: '2026-02-11',
            dayName: 'Середа',
            time: '19:00',
            address: 'Легкоатлетичний манеж, пр. П.Тичини, 18',
            difficulty: 'ELEMENTARY',
            isPaid: true,
            createdAt: '2026-02-13T13:44:46.594Z',
            createdBy: 'kulikalovdenis@gmail.com'
          }
        ]
      }
    }
  },

  /**
   * POST /schedules - Створити новий розклад
   */
  create: {
    method: 'POST',
    path: '/schedules',
    request: {
      type: 'object',
      required: ['weekStart', 'weekEnd', 'trainings'],
      schema: {
        weekStart: { type: 'string', format: 'date', description: 'Понеділок тижня (YYYY-MM-DD)' },
        weekEnd: { type: 'string', format: 'date', description: 'Неділя тижня (YYYY-MM-DD)' },
        trainings: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'type', 'date', 'time', 'address', 'difficulty', 'isPaid'],
            schema: {
              name: { type: 'string', maxLength: 200, description: 'Назва тренування' },
              type: { type: 'string', enum: ['swimming', 'cycling', 'running', 'other'], description: 'Тип тренування' },
              date: { type: 'string', format: 'date', description: 'Дата тренування (YYYY-MM-DD)' },
              time: { type: 'string', pattern: '^\\d{2}:\\d{2}$', description: 'Час початку (HH:mm)' },
              address: { type: 'string', maxLength: 500, description: 'Місце проведення' },
              difficulty: { type: 'string', enum: ['ELEMENTARY', 'INTERMEDIATE', 'ADVANCED'], description: 'Рівень складності' },
              isPaid: { type: 'boolean', description: 'Платне чи безплатне тренування' }
            }
          },
          minItems: 1,
          description: 'Масив тренувань для розкладу'
        }
      }
    },
    response: {
      type: 'object',
      schema: {
        id: { type: 'string', description: 'Firestore Document ID' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    example: {
      request: {
        weekStart: '2026-02-09',
        weekEnd: '2026-02-15',
        trainings: [
          {
            name: 'Плавання',
            type: 'swimming',
            date: '2026-02-09',
            time: '07:00',
            address: 'Басейн КНТУ, вул. М. Бойчука 36А',
            difficulty: 'ELEMENTARY',
            isPaid: true
          },
          {
            name: 'Indoor Zwift',
            type: 'cycling',
            date: '2026-02-10',
            time: '19:00',
            address: 'Вдома',
            difficulty: 'ELEMENTARY',
            isPaid: false
          },
          {
            name: 'Інтервальне тренування',
            type: 'running',
            date: '2026-02-11',
            time: '19:00',
            address: 'Легкоатлетичний манеж, пр. П.Тичини, 18',
            difficulty: 'ELEMENTARY',
            isPaid: true
          }
        ]
      },
      response: {
        id: 'schedule_feb9',
        createdAt: '2026-02-13T13:44:46.595Z'
      }
    }
  }
}

// ============================================================================
// AUTH SERVICE CONTRACTS
// ============================================================================

export const authContracts = {
  /**
   * GET /auth/current-user - Отримати поточного користувача
   */
  getCurrentUser: {
    method: 'GET',
    path: '/auth/current-user',
    request: null,
    response: {
      type: 'object',
      schema: {
        uid: { type: 'string' },
        email: { type: 'string', format: 'email' },
        displayName: { type: 'string' },
        photoURL: { type: 'string', format: 'uri' },
        emailVerified: { type: 'boolean' }
      }
    },
    example: {
      request: null,
      response: {
        uid: 'user_uid_123',
        email: 'ivan@example.com',
        displayName: 'Ivan Petrenko',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true
      }
    }
  },

  /**
   * POST /auth/logout - Вийти з системи
   */
  logout: {
    method: 'POST',
    path: '/auth/logout',
    request: null,
    response: {
      type: 'boolean'
    },
    example: {
      request: null,
      response: true
    }
  }
}

// ============================================================================
// VERSION SERVICE CONTRACTS
// ============================================================================

export const versionContracts = {
  /**
   * GET /version/latest - Отримати поточну версію
   */
  getLatest: {
    method: 'GET',
    path: '/version/latest',
    request: null,
    response: {
      type: 'object',
      schema: {
        version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    example: {
      request: null,
      response: {
        version: '1.2.3',
        updatedAt: '2026-02-13T10:00:00Z'
      }
    }
  },

  /**
   * PUT /version/update - Оновити версію
   */
  update: {
    method: 'PUT',
    path: '/version/update',
    request: {
      type: 'object',
      required: ['version'],
      schema: {
        version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+' }
      }
    },
    response: {
      type: 'boolean'
    },
    example: {
      request: {
        version: '1.3.0'
      },
      response: true
    }
  },

  /**
   * GET /version/check-updates - Перевірити оновлення
   */
  checkUpdates: {
    method: 'GET',
    path: '/version/check-updates',
    request: null,
    response: {
      type: 'object',
      schema: {
        hasUpdate: { type: 'boolean' },
        localVersion: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+' },
        remoteVersion: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+' }
      }
    },
    example: {
      request: null,
      response: {
        hasUpdate: true,
        localVersion: '1.2.0',
        remoteVersion: '1.2.3'
      }
    }
  }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Перевірити тип даних
 * @param {*} value - значення для перевірки
 * @param {string} type - очікуваний тип
 * @returns {boolean}
 */
function validateType(value, type) {
  if (value === null || value === undefined) return true // null/undefined дозволені
  
  switch (type) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'array':
      return Array.isArray(value)
    case 'object':
      return typeof value === 'object' && !Array.isArray(value)
    case 'date':
      return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    case 'date-time':
      return typeof value === 'string' && !isNaN(Date.parse(value))
    case 'email':
      return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    case 'uri':
      return typeof value === 'string' && /^https?:\/\/.+/.test(value)
    default:
      return true
  }
}

/**
 * Валідувати значення за схемою поля
 * @param {*} value - значення
 * @param {Object} fieldSchema - схема поля
 * @param {string} fieldName - назва поля
 * @returns {Array} масив помилок (пустий якщо валідно)
 */
function validateField(value, fieldSchema, fieldName) {
  const errors = []
  
  if (value === null || value === undefined) {
    return errors // Поле необов'язкове за замовчуванням
  }
  
  // Перевіряємо тип
  if (!validateType(value, fieldSchema.type)) {
    errors.push(`${fieldName}: очікувалося ${fieldSchema.type}, отримано ${typeof value}`)
    return errors
  }
  
  // Перевіряємо мінімальну довжину (для строк)
  if (fieldSchema.minLength && typeof value === 'string' && value.length < fieldSchema.minLength) {
    errors.push(`${fieldName}: мінімальна довжина ${fieldSchema.minLength}, отримано ${value.length}`)
  }
  
  // Перевіряємо максимальну довжину
  if (fieldSchema.maxLength && typeof value === 'string' && value.length > fieldSchema.maxLength) {
    errors.push(`${fieldName}: максимальна довжина ${fieldSchema.maxLength}, отримано ${value.length}`)
  }
  
  // Перевіряємо мінімальне значення (для чисел)
  if (fieldSchema.minimum !== undefined && typeof value === 'number' && value < fieldSchema.minimum) {
    errors.push(`${fieldName}: мінімальне значення ${fieldSchema.minimum}, отримано ${value}`)
  }
  
  // Перевіряємо максимальне значення
  if (fieldSchema.maximum !== undefined && typeof value === 'number' && value > fieldSchema.maximum) {
    errors.push(`${fieldName}: максимальне значення ${fieldSchema.maximum}, отримано ${value}`)
  }
  
  // Перевіряємо регулярний вираз (pattern)
  if (fieldSchema.pattern && typeof value === 'string') {
    const regex = new RegExp(fieldSchema.pattern)
    if (!regex.test(value)) {
      errors.push(`${fieldName}: значення не відповідає зразку ${fieldSchema.pattern}`)
    }
  }
  
  // Перевіряємо enum
  if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
    errors.push(`${fieldName}: невідомо значення "${value}". Очікується одне з: ${fieldSchema.enum.join(', ')}`)
  }
  
  return errors
}

/**
 * Валідувати об'єкт за схемою
 * @param {Object} data - дані для валідації
 * @param {Object} schema - схема для валідації
 * @param {Array} requiredFields - обов'язкові поля
 * @returns {Object} { isValid: boolean, errors: Array, data: Object (з дефолтними значеннями) }
 */
export function validateRequestData(data, schema, requiredFields = []) {
  const errors = []
  const validatedData = {}
  
  // Перевіряємо обов'язкові поля
  for (const requiredField of requiredFields) {
    if (!(requiredField in data)) {
      errors.push(`Обов'язкове поле "${requiredField}" відсутнє`)
    }
  }
  
  // Валідуємо кожне поле
  for (const [fieldName, fieldValue] of Object.entries(data)) {
    if (!(fieldName in schema)) {
      errors.push(`Невідоме поле "${fieldName}"`)
      continue
    }
    
    const fieldSchema = schema[fieldName]
    const fieldErrors = validateField(fieldValue, fieldSchema, fieldName)
    errors.push(...fieldErrors)
    
    // Додаємо поле до валідованих даних
    if (fieldErrors.length === 0) {
      validatedData[fieldName] = fieldValue
    }
  }
  
  // Добавляємо значення за замовчуванням для необов'язкових полів
  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    if (!(fieldName in validatedData) && fieldSchema.default !== undefined) {
      validatedData[fieldName] = fieldSchema.default
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: validatedData
  }
}

/**
 * Валідувати запит за контрактом сервісу
 * @param {string} serviceName - назва сервісу (donation, user, registration, schedule, auth, version)
 * @param {string} action - дія (getAll, create, update, delete, etc.)
 * @param {Object} requestData - дані запиту
 * @returns {Object} { isValid: boolean, errors: Array, data: Object }
 */
export function validateRequest(serviceName, action, requestData = {}) {
  const allContracts = {
    donation: donationContracts,
    user: userContracts,
    registration: registrationContracts,
    schedule: scheduleContracts,
    auth: authContracts,
    version: versionContracts
  }
  
  if (!(serviceName in allContracts)) {
    return {
      isValid: false,
      errors: [`Невідомий сервіс: "${serviceName}". Очікується один з: ${Object.keys(allContracts).join(', ')}`],
      data: {}
    }
  }
  
  const serviceContracts = allContracts[serviceName]
  
  if (!(action in serviceContracts)) {
    return {
      isValid: false,
      errors: [`Невідома дія: "${action}" для сервісу "${serviceName}". Очікується один з: ${Object.keys(serviceContracts).join(', ')}`],
      data: {}
    }
  }
  
  const contract = serviceContracts[action]
  
  // Якщо контракт не має request schema (GET запит без параметрів)
  if (contract.request === null) {
    return {
      isValid: true,
      errors: [],
      data: {}
    }
  }
  
  const schema = contract.request.schema
  const required = contract.request.required || []
  
  return validateRequestData(requestData, schema, required)
}

/**
 * Отримати приклад запиту для дії
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @param {boolean} requestOnly - повертати тільки request або весь приклад
 * @returns {Object|null}
 */
export function getRequestExample(serviceName, action, requestOnly = true) {
  const allContracts = {
    donation: donationContracts,
    user: userContracts,
    registration: registrationContracts,
    schedule: scheduleContracts,
    auth: authContracts,
    version: versionContracts
  }
  
  if (!(serviceName in allContracts) || !(action in allContracts[serviceName])) {
    return null
  }
  
  const contract = allContracts[serviceName][action]
  
  if (requestOnly) {
    return contract.example?.request || null
  }
  
  return contract.example || null
}

/**
 * Отримати контракт дії
 * @param {string} serviceName - назва сервісу
 * @param {string} action - дія
 * @returns {Object|null}
 */
export function getContract(serviceName, action) {
  const allContracts = {
    donation: donationContracts,
    user: userContracts,
    registration: registrationContracts,
    schedule: scheduleContracts,
    auth: authContracts,
    version: versionContracts
  }
  
  if (!(serviceName in allContracts) || !(action in allContracts[serviceName])) {
    return null
  }
  
  return allContracts[serviceName][action]
}

/**
 * Отримати список доступних услуг
 * @returns {Array}
 */
export function getAvailableServices() {
  return ['donation', 'user', 'registration', 'schedule', 'auth', 'version']
}

/**
 * Отримати список доступних дій для сервісу
 * @param {string} serviceName - назва сервісу
 * @returns {Array}
 */
export function getAvailableActions(serviceName) {
  const allContracts = {
    donation: donationContracts,
    user: userContracts,
    registration: registrationContracts,
    schedule: scheduleContracts,
    auth: authContracts,
    version: versionContracts
  }
  
  if (!(serviceName in allContracts)) {
    return []
  }
  
  return Object.keys(allContracts[serviceName])
}

// ============================================================================
// EXPORT ALL CONTRACTS
// ============================================================================

export const contracts = {
  donation: donationContracts,
  user: userContracts,
  registration: registrationContracts,
  schedule: scheduleContracts,
  auth: authContracts,
  version: versionContracts
}
