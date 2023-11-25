import { APP_LANGUAGES, APP_LANGUAGES_ARRAY, APP_LANGUAGES_TYPE } from '@/app/shared/constants/languages';
import { localeResources } from './locales';

import i18n from 'i18next';

export const defaultLang = APP_LANGUAGES.en;

export const initI18n = (lang: APP_LANGUAGES_TYPE) => {
  i18n.init({
    lng: lang,
    fallbackLng: APP_LANGUAGES.en,
    returnNull: false,
    debug: true,
    resources: localeResources,
  });
}

export const currentLang = () => i18n.language;

export const languagesList = APP_LANGUAGES_ARRAY;

export default i18n;
