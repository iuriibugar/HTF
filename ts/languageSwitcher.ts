type TranslationKeys = 
  "header.title" | 
  "nav.home" | 
  "nav.schedule" | 
  "nav.subscriptions" | 
  "nav.merch" | 
  "nav.about" | 
  "hero.welcome" | 
  "hero.description" | 
  "hero.join";

type Translations = {
  [lang: string]: {
    [key in TranslationKeys]: string;
  };
};

const translations: Translations = {
  en: {
    "header.title": "Happy TRI Friends",
    "nav.home": "Home",
    "nav.schedule": "Schedule",
    "nav.subscriptions": "Subscriptions",
    "nav.merch": "Merch",
    "nav.about": "About",
    "hero.welcome": "Welcome to our team!",
    "hero.description": "We unite three sports into one lifestyle",
    "hero.join": "Join us"
  },
  uk: {
    "header.title": "Happy TRI Friends",
    "nav.home": "Головна",
    "nav.schedule": "Розклад",
    "nav.subscriptions": "Підписки",
    "nav.merch": "Мерч",
    "nav.about": "Про клуб",
    "hero.welcome": "Ласкаво просимо до нашої команди!",
    "hero.description": "Об'єднуємо три види спорту в один стиль життя",
    "hero.join": "Приєднатися"
  }
};

const languageSwitcher = document.getElementById("languageSwitcher") as HTMLSelectElement;

function updateLanguage(lang: string): void {
  const elements = document.querySelectorAll<HTMLElement>("[data-i18n]");
  elements.forEach(el => {
    const key = el.dataset.i18n as TranslationKeys;
    if (key && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

languageSwitcher.addEventListener("change", () => {
  updateLanguage(languageSwitcher.value);
});

updateLanguage(languageSwitcher.value);