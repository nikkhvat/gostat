'use server'

import { cookies } from 'next/headers'

async function setCookiesTheme(theme: "dark" | "light" | "system") {
  cookies().set('theme', theme)
}

export default setCookiesTheme;