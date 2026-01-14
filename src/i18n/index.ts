import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import sr from './locales/sr.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sr', name: 'Srpski', flag: '🇷🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sr: { translation: sr },
      de: { translation: de },
      ru: { translation: ru },
      zh: { translation: zh },
      ko: { translation: ko },
      ja: { translation: ja },
      es: { translation: es },
      fr: { translation: fr },
      pt: { translation: pt },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
