import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cookies } from "next/headers";
import { APP_LANGUAGES, APP_LANGUAGES_TYPE } from './shared/constants/languages';
import { CookiesKeys } from './shared/services/cookie/types';
// import i18n from './shared/libs/i18n';

import i18n from 'i18next';

import { localeResources } from './shared/libs/i18n/locales';
import { initI18n } from './shared/libs/i18n';
import ClientSideI18nHydration from './ClientSideI18nHydration';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Gostat",
  description: "Gostat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get(CookiesKeys.THEME);

  const rawLang = cookieStore.get(CookiesKeys.LOCALE)?.value ?? APP_LANGUAGES.en

  const lang = rawLang.toLowerCase() as APP_LANGUAGES_TYPE;

  initI18n(lang);

  return (
    <html lang={lang ?? "en"}>
      <body className={`${inter.className} ${theme?.value}`}>
        <ClientSideI18nHydration />
        {children}
      </body>
    </html>
  );
}
