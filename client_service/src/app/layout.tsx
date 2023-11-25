import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cookies } from "next/headers";
import { APP_LANGUAGES, APP_LANGUAGES_TYPE } from './shared/constants/languages';
import { CookiesKeys } from './shared/services/cookie/types';

import { setLanguage } from "@/app/shared/libs/i18n"
import Lang from './Lang';

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

  console.log("lang", lang);
  
  setLanguage(lang);

  return (
    <html lang={lang ?? "en"}>
      <body className={`${inter.className} ${theme?.value}`}>
        <Lang lang={lang} />
        {children}
      </body>
    </html>
  );
}
