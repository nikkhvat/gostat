import { APP_LANGUAGES, APP_LANGUAGES_TYPE, APP_LANGUAGES_ARRAY } from '@/app/shared/constants/languages';

import { localeResources } from './locales';

import i18next from 'i18next';

const defaultLang = APP_LANGUAGES.en

i18next.init({
  lng: defaultLang,
  fallbackLng: APP_LANGUAGES.en,
  returnNull: false,
  debug: true,
  resources: localeResources,
});

export const changeLanguage = (lang: APP_LANGUAGES_TYPE) => {
  i18next.changeLanguage(lang);
};

export const currentLang = i18next.language

export const checkLang = (lang: string) => {
  console.log(lang);
  

  if (APP_LANGUAGES_ARRAY.includes(lang) && lang !== i18next.language) {
    changeLanguage(lang as APP_LANGUAGES_TYPE)
  }
}

export const languagesList = APP_LANGUAGES_ARRAY

export default i18next;