import { APP_LANGUAGES_ARRAY, APP_LANGUAGES_TYPE } from '@/app/shared/constants/languages';
import { localeResources } from './locales';

let lang = "en" as APP_LANGUAGES_TYPE;

function translate(lang: string, resources: any) {
  return function (path: string, variables?: Record<string, string>) {
    path = lang + ".translation." + path;
    const parts = path.split('.');

    let currentObject: any = resources;

    for (let part of parts) {
      if (currentObject[part] !== undefined) {
        currentObject = currentObject[part];
      } else {
        return path;
      }
    }

    let result = typeof currentObject === 'string' ? currentObject : path;

    if (variables) {
      for (const key of Object.keys(variables)) {
        const value = variables[key];
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    }
    
    return result;
  }
}


const i18n = {
  resources: localeResources,
  setLanguage: function(lang: APP_LANGUAGES_TYPE) {
    lang = lang
  },
  useTranslate: () => {
    return translate(lang, localeResources)
  },
}

export const setLanguage = (l: APP_LANGUAGES_TYPE) => {
  lang = l
}

export const languagesList = APP_LANGUAGES_ARRAY
export const useTranslate = i18n.useTranslate

export default i18n