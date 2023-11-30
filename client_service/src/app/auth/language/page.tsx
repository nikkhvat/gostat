import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import LanguageButton from "@/app/auth/components/languageButton/index";
import image from "@/app/assets/auth/earth.svg";
import { languagesList, useTranslate } from "@/app/shared/libs/i18n";
import { CookiesKeys } from "@/app/shared/services/cookie/types";

import style from "./page.module.css";

export default function Language() {  
  const cookieStore = cookies();
  
  const t = useTranslate();

  const lang = cookieStore.get(CookiesKeys.LOCALE);

  const languages = [
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "ru", name: "Русский" },
    { code: "es", name: "Español" },
    { code: "kk", name: "қазақша" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "zh", name: "中文" },
  ];

  function filterLanguages(languages: {code: string, name: string}[], keys: string[]) {
    const upperCaseKeys = keys.map((key) => key.toLowerCase());

    return languages.filter((language) =>
      upperCaseKeys.includes(language.code)
    );
  }

  return (
    <div className={style.box}>
      <div className={style.texts}>
        <h1 className={style.title}>{t("language.title")}</h1>
        <p className={style.subTitle}>{t("language.subtitle")}</p>
      </div>

      <div className={style.mainBlock}>
        <p className={style.chooseLanguageTitle}>
          {t("language.chooseYourLanguage")}
        </p>

        <div className={style.languageButtons}>
          {filterLanguages(languages, languagesList).map((language) => (
            <LanguageButton
              key={language.code}
              article={language.code}
              language={language.name}
              selected={lang?.value.toLowerCase() ?? "en"}
            />
          ))}
        </div>
      </div>

      <div className={style.earthPhoto}>
        <Image src={image} alt="Earth image" />
      </div>
      <div className={style.box__bottom}>
        <div className={style.bottom__bottoms}>
          <Link className={style.back__button} href="/dashboard">
            {t("theme.back")}
          </Link>
          <Link className={style.continue__button} href="/dashboard">
            {t("theme.continue")}
          </Link>
        </div>
      </div>
    </div>
  );
}