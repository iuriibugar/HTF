// Конфігурація для форми створення розкладу тренувань

// Імпорт іконок
import swimmingIconImg from '@/assets/trainingIcons/icon-swimming.png'
import runningIconImg from '@/assets/trainingIcons/icon-running.png'
import cyclingIconImg from '@/assets/trainingIcons/icon-cycling.png'
import otherIconImg from '@/assets/trainingIcons/icon-other.png'

// Назви тренувань за типами
export const trainingNamesByType = {
  swimming: [
    'Плавання ',
    'Відкрита вода',
    'Техніка плавання'
  ],
  running: [
    'Біг',
    'Легкий Трейл',
    'Тренування По Бігу',
    'Інтервальне тренування'
  ],
  cycling: [
    'Велотренування'
  ],
  other: [
    'Брик тренування',
    'Довга дистанція'
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
    { value: 'ELEMENTARY', label: 'ELEMENTARY' },
    { value: 'INTERMEDIATE', label: 'INTERMEDIATE' },
    { value: 'HARD', label: 'HARD' }
  ],
  cycling: [
    { value: 'ELEMENTARY', label: 'ELEMENTARY' },
    { value: 'INTERMEDIATE', label: 'INTERMEDIATE' },
    { value: 'HARD', label: 'HARD' }
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
  'Басейн КНТУ, вул. М. Бойчука 36А',
  'Басейн Олімпійський стиль, вул. Ділова, 10', 
  'Голосіївський проспект, 61',
  'Стадіон КНУБА, вул. Освіти 5',
  'Голосієво',
  'ВДНГ',
  'Труханів острів',
  'Обухівська траса'
]

// Іконки типів тренувань (емоджі для відображення в UI)
export const swimmingIcon = '🏊'
export const runningIcon = '🏃'
export const cyclingIcon = '🚴'
export const otherIcon = '📋'

// Експортуємо іконки-картинки
export { swimmingIconImg, runningIconImg, cyclingIconImg, otherIconImg }

export const trainingTypes = [
  { value: 'swimming', label: `Плавання`, icon: swimmingIcon, iconImg: swimmingIconImg, name: 'Плавання' },
  { value: 'running', label: `Біг`, icon: runningIcon, iconImg: runningIconImg, name: 'Біг' },
  { value: 'cycling', label: `Велосипед`, icon: cyclingIcon, iconImg: cyclingIconImg, name: 'Велосипед' },
  { value: 'other', label: `Інше`, icon: otherIcon, iconImg: otherIconImg, name: 'Інше' }
]

// Функція для отримання іконки за типом
export const getTrainingIcon = (type) => {
  const training = trainingTypes.find(t => t.value === type || t.name === type)
  return training ? training.icon : '🏋️'
}
