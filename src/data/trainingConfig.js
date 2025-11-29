// Конфігурація для форми створення розкладу тренувань

// Назви тренувань за типами
export const trainingNamesByType = {
  swimming: [
    'Плавання ',
    'Відкрита вода'
  ],
  running: [
    'Біг',
    'Біг трейл'
  ],
  cycling: [
    'Велотренування'
  ],
  other: [
    'Загальна підготовка',
    'Силове тренування',
    'Розтяжка'
  ]
}

// Загальний список назв (для сумісності)
export const trainingNames = [
  'Плавання',
  'Біг',
  'Біг трейл',
  'Велотренування'
]

// Функція для отримання назв за типом
export const getTrainingNames = (trainingType) => {
  return trainingNamesByType[trainingType] || trainingNames
}

// Рівні складності за типом тренування
export const difficultyByType = {
  swimming: [
    { value: 'ELEMENTARY', label: 'ELEMENTARY' },
    { value: 'INTERMEDIATE', label: 'INTERMEDIATE' },
    { value: 'HARD', label: 'HARD' }
  ],
  running: [
    { value: 'RUN_LIGHT', label: 'LIGHT' },
    { value: 'RUN_LONG', label: 'LONG' },
    { value: 'RUN_TECHNIQUE', label: 'Техніка' }
  ],
  cycling: [
    { value: 'BIKE_FAST_TUESDAY', label: 'Швидкий вівторок' },
    { value: 'BIKE_LONG', label: 'Довге велотренування' },
    { value: 'BIKE_TECHNIQUE', label: 'Техніка' },
    { value: 'BIKE_COFFEE_RIDE', label: 'Coffee Ride' }
  ],
  other: [
    { value: 'ELEMENTARY', label: 'ELEMENTARY' },
    { value: 'INTERMEDIATE', label: 'INTERMEDIATE' },
    { value: 'HARD', label: 'HARD' }
  ]
}

// Загальні рівні (для сумісності зі старим кодом)
export const difficultyLevels = [
  { value: 'ELEMENTARY', label: 'ELEMENTARY' },
  { value: 'INTERMEDIATE', label: 'INTERMEDIATE' },
  { value: 'HARD', label: 'HARD' }
]

// Функція для отримання рівнів складності за типом
export const getDifficultyLevels = (trainingType) => {
  return difficultyByType[trainingType] || difficultyLevels
}

export const trainingAddresses = [
  'Басейн КНТУ, Вул. М. Бойчука 36А',
  'Голосіївський проспект, 61',
  'Стадіон КНУБА, вул. Освіти 5',
  'Голосієво',
  'ВДНГ',
  'Труханів острів',
  'Обухівська траса'
]

export const trainingTypes = [
  { value: 'swimming', label: '🏊 Плавання', icon: '🏊', name: 'Плавання' },
  { value: 'running', label: '🏃 Біг', icon: '🏃', name: 'Біг' },
  { value: 'cycling', label: '🚴 Велосипед', icon: '🚴', name: 'Велосипед' },
  { value: 'other', label: '📋 Інше', icon: '📋', name: 'Інше' }
]

// Функція для отримання іконки за типом
export const getTrainingIcon = (type) => {
  const training = trainingTypes.find(t => t.value === type || t.name === type)
  return training ? training.icon : '🏋️'
}
