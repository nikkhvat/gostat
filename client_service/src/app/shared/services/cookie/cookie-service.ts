import Cookies from 'js-cookie';

import { CookiesKeys } from './types';

export class CookieService {
  public static saveCookie(name: CookiesKeys, value: string, options: any) {
    Cookies.set(name, value, options);
  }

  public static getCookie(key: CookiesKeys) {
    return Cookies.get(key);
  }

  public static removeAllCookies(options: any) {
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      Cookies.remove(cookieName, options);
    });
  }

  public static removeSpecifiedCookie(cookieName: CookiesKeys, options: any) {
    Cookies.remove(cookieName, options);
  }
}
