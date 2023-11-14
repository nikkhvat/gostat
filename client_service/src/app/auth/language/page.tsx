"use client"
import React, { useState } from "react";

import style from '@/app/auth/language/page.module.css';

import Image from 'next/image';
import Link from "next/link";

import LanguageButton from "@/app/auth/components/languageButton/index";

import image from '@/app/assets/auth/earth.svg';

export default function Language() {
  const languages = [
    { code: "EN", name: "English" },
    { code: "DE", name: "Deutsch" },
    { code: "FR", name: "Français" },
    { code: "ES", name: "Español" },
    { code: "RU", name: "Русский" },
    { code: "KK", name: "қазақша" },
    { code: "JA", name: "日本語" },
    { code: "KO", name: "한국어" },
    { code: "ZH", name: "中文" },
  ]

  const [languageSelected, setLanguageSelected] = useState(languages[0].code);
  const changeLanguage = (language: string) => setLanguageSelected(language);

  return (
    <div className={style.box}>
      <div className={style.texts}>
        <h1 className={style.title}>Welcome</h1>
        <p className={style.subTitle}>
          Setting up the service will not take much time
        </p>
      </div>

      <div className={style.mainBlock}>
        <p className={style.chooseLanguageTitle}>Choose your language</p>

        <div className={style.languageButtons}>
          {languages.map((language) => (
            <LanguageButton
              key={language.code}
              article={language.code}
              language={language.name}
              selected={languageSelected}
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
          <Link className={style.back__button} href="/dashboard">
            Back
          </Link>
          <Link className={style.continue__button} href="/dashboard">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}