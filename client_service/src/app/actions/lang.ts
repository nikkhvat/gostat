'use server'

import { cookies } from 'next/headers'
import { APP_LANGUAGES_TYPE } from '../shared/constants/languages';

async function setCookiesLang(lang: APP_LANGUAGES_TYPE) {
  cookies().set('lang', lang.toLowerCase())
}

export default setCookiesLang;