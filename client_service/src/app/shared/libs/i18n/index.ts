import { APP_LANGUAGES, APP_LANGUAGES_TYPE, APP_LANGUAGES_ARRAY } from '@/app/shared/constants/languages';
import { localeResources } from './locales';
import i18next from 'i18next';

export const defaultLang = APP_LANGUAGES.en

export async function initI18Next(lng?: string) {
  await i18next.init({
    lng: lng ?? defaultLang,
    fallbackLng: APP_LANGUAGES.en,
    returnNull: false,
    debug: true,
    resources: localeResources,
  });
}

initI18Next()

export const changeLanguage = async (langRaw: APP_LANGUAGES_TYPE) => {
  const lang = langRaw.toLowerCase();

  if (!i18next.isInitialized) {
    setTimeout(() => changeLanguage(langRaw), 100);
    return;
  }

  if (APP_LANGUAGES_ARRAY.includes(lang)) {
    console.log("Changing language to:", lang);
    await i18next.changeLanguage(lang);
  }
};

export const currentLang = () => i18next.language;

export const languagesList = APP_LANGUAGES_ARRAY;

export default i18next;
