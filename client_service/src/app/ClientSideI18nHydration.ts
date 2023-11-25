"use client"

import React, { useEffect } from 'react';
import i18n from 'i18next';
import { CookieService } from './shared/services/cookie/cookie-service';
import { CookiesKeys } from './shared/services/cookie/types';
import { initI18n } from './shared/libs/i18n';

const ClientSideI18nHydration: React.FC = () => {
  useEffect(() => {
    const currentLang = CookieService.getCookie(CookiesKeys.LOCALE) ?? 'en';

    if (!i18n.isInitialized) {
      initI18n(currentLang as any)
    }

    const changeLanguage = () => {
      if (i18n.isInitialized && currentLang !== i18n.language) {
        i18n.changeLanguage(currentLang).catch(error => {
          console.error("Ошибка смены языка:", error);
        });
      }
    };

    changeLanguage();

    i18n.on('initialized', changeLanguage);

    return () => {
      i18n.off('initialized', changeLanguage);
    };
  }, []);

  return null;
};

export default ClientSideI18nHydration;
