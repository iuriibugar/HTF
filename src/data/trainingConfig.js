// Конфігурація для форми створення розкладу тренувань

export const trainingNames = [
  'Плавання',
  'Легкий Трейл',
  'Тренування По Бігу',
  'Велопрогулянка',
  'Інтервальне тренування',
  'Відкрита вода',
  'Брик тренування',
  'Техніка плавання',
  'Довга дистанція'
]

export const difficultyLevels = [
  { value: 'ELEMENTARY', label: 'ELEMENTARY' },
  { value: 'INTERMEDIATE', label: 'INTERMEDIATE' },
  { value: 'HARD', label: 'HARD' }
]

export const trainingAddresses = [
  'Басейн КНТУ, Вул. М. Бойчука 36А',
  'Голосіївський проспект, 61',
  'Стадіон КНУБА, вул. Освіти 5',
  'Голосієво',
  'ВДНГ',
  'Труханів острів'
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
