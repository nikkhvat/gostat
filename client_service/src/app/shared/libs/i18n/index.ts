import { APP_LANGUAGES_ARRAY, APP_LANGUAGES_TYPE } from "@/app/shared/constants/languages";

import { localeResources } from "./locales";

type NestedKeys<T> = T extends string ? [] : {
  [K in Extract<keyof T, string>]: [K, ...NestedKeys<T[K]>]
}[Extract<keyof T, string>];

type Join<T extends string[], D extends string> =
  T extends [] ? never :
  T extends [infer F] ? F :
  T extends [infer F, ...infer R] ?
  F extends string ?
  `${F}${D}${Join<Extract<R, string[]>, D>}`
  : never
  : string;

type TranslationKeys = Join<NestedKeys<typeof localeResources["en"]["translation"]>, ".">;

let lang = "en" as APP_LANGUAGES_TYPE;

function translate(lang: string, resources: any) {
  return function (pathToObj: TranslationKeys, variables?: Record<string, string>) {
    const path = lang + ".translation." + pathToObj;
    const parts = path.split(".");

    let currentObject: any = resources;

    for (const part of parts) {
      if (currentObject[part] !== undefined) {
        currentObject = currentObject[part];
      } else {
        return path;
      }
    }

    let result = typeof currentObject === "string" ? currentObject : path;

    if (variables) {
      for (const key of Object.keys(variables)) {
        const value = variables[key];
        result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
      }
    }

    return result;
  };
}

const i18n = {
  resources: localeResources,
  setLanguage: function(lang: APP_LANGUAGES_TYPE) {
    lang = lang;
  },
  useTranslate: () => {
    return translate(lang, localeResources);
  },
};

export const setLanguage = (l: APP_LANGUAGES_TYPE) => {
  lang = l;
};

export const languagesList = APP_LANGUAGES_ARRAY;
export const useTranslate = i18n.useTranslate;

export default i18n;