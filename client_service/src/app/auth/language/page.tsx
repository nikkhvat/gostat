import React from "react";
import style from './page.module.css';
import Image from 'next/image';
import Link from "next/link";
import LanguageButton from "@/app/auth/components/languageButton/index";
import image from '@/app/assets/auth/earth.svg';
import i18next, { languagesList } from "@/app/shared/libs/i18n";

import { cookies } from "next/headers";

export default function Language() {  
  const cookieStore = cookies();

  const lang = cookieStore.get("lang");

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
        <h1 className={style.title}>{i18next.t("language.title")}</h1>
        <p className={style.subTitle}>{i18next.t("language.subtitle")}</p>
      </div>

      <div className={style.mainBlock}>
        <p className={style.chooseLanguageTitle}>
          {i18next.t("language.chooseYourLanguage")}
        </p>

        <div className={style.languageButtons}>
          {filterLanguages(languages, languagesList).map((language) => (
            <LanguageButton
              key={language.code}
              article={language.code}
              language={language.name}
              selected={lang?.value.toLowerCase() ?? 'en'}
            />
          ))}
        </div>
      </div>

      <div className={style.earthPhoto}>
        <Image src={image} alt="Earth image" />
      </div>
      <div className={style.box__bottom}>
        <div className={style.bottom__bottoms}>
          <Link className={style.back__button} href={`/dashboard`}>
            {i18next.t("theme.back")}
          </Link>
          <Link className={style.continue__button} href={`/dashboard`}>
            {i18next.t("theme.continue")}
          </Link>
        </div>
      </div>
    </div>
  );
}