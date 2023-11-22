"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Lang = ({ children }: any) => {

  const langs = ['ru', 'en']

  const router = useRouter();

  const isSupportLang = () => {
    for (let i = 0; i < langs.length; i++) {
      const lang = langs[i];
      
      if (window.location.pathname.indexOf(lang) != -1) {
        return true
      }
    }

    return false
  }

  useEffect(() => {
    console.log(`IS SUPPORT`, isSupportLang());
  }, [])

  return <>{children}</>;
};

export default Lang;