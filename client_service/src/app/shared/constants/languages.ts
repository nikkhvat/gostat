export const APP_LANGUAGES = {
  ru: 'ru',
  en: 'en',
} as const;

export const APP_LANGUAGES_ARRAY = ["ru", "en"]

export type APP_LANGUAGES_TYPE = keyof typeof APP_LANGUAGES;
