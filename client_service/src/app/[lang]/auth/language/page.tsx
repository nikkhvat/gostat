"use client"

import React from "react";
import style from './page.module.css';
import Image from 'next/image';
import Link from "next/link";
import LanguageButton from "@/app/[lang]/auth/components/languageButton/index";
import image from '@/app/assets/auth/earth.svg';
import i18next, { checkLang, languagesList } from "@/app/shared/libs/i18n";
import { useRouter } from "next/navigation";


export default function Language({ params: { lang } }: any) {
  const router = useRouter();

  checkLang(lang);
  
  const languages = [
    { code: "EN", name: "English" },
    { code: "DE", name: "Deutsch" },
    { code: "FR", name: "Français" },
    { code: "RU", name: "Русский" },
    { code: "ES", name: "Español" },
    { code: "KK", name: "қазақша" },
    { code: "JA", name: "日本語" },
    { code: "KO", name: "한국어" },
    { code: "ZH", name: "中文" },
  ];

  function filterLanguages(languages: {code: string, name: string}[], keys: string[]) {
    const upperCaseKeys = keys.map((key) => key.toUpperCase());

    return languages.filter((language) =>
      upperCaseKeys.includes(language.code)
    );
  }
  
  const changeLanguage = (language: string) => {
    checkLang(language.toLowerCase());
    router.push(`/${language.toLowerCase()}/${window.location.pathname.split("/").splice(2).join("/")}`);
  };

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
              selected={lang.toUpperCase()}
              changeLanguage={changeLanguage}
            />
          ))}
        </div>
      </div>

      <div className={style.earthPhoto}>
        <Image src={image} alt="Earth image" />
      </div>
      <div className={style.box__bottom}>
        <div className={style.bottom__bottoms}>
          <Link className={style.back__button} href={`/${lang}/dashboard`}>
            {i18next.t("theme.back")}
          </Link>
          <Link className={style.continue__button} href={`/${lang}/dashboard`}>
            {i18next.t("theme.continue")}
          </Link>
        </div>
      </div>
    </div>
  );
}