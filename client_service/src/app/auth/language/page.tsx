"use client"
import React, { useState } from "react";
import style from '@/app/auth/language/page.module.css';
import Image from 'next/image';

import image from '@/app/assets/auth/earth.svg';
import Link from "next/link";

import LanguageButton from "@/app/auth/components/languageButton/index";

export default function Language() {

  const [languageSelected, setLanguageSelected] = useState('EN');

  const changeLanguage = (language: string) => {
    setLanguageSelected(language)
  }

  return (
    <div className={style.box}>

      <div className={style.texts}>
        <h1 className={style.title}>Welcome</h1>
        <p className={style.subTitle}>Setting up the service will not take much time</p>
      </div>

      <div className={style.mainBlock}>
        <p className={style.chooseLanguageTitle}>Choose your language</p>

        <div className={style.languageButtons}>
          <LanguageButton article="EN" language="English" selected={languageSelected} changeLanguage={changeLanguage} />
          <LanguageButton article="RU" language="Русский" selected={languageSelected} changeLanguage={changeLanguage} />
          <LanguageButton article="JA" language="日本語" selected={languageSelected} changeLanguage={changeLanguage} />
          <LanguageButton article="ZH" language="中文" selected={languageSelected} changeLanguage={changeLanguage} />
          <LanguageButton article="DE" language="Deutsch" selected={languageSelected} changeLanguage={changeLanguage} />
          <LanguageButton article="FR" language="Français" selected={languageSelected} changeLanguage={changeLanguage} />
          <LanguageButton article="ES" language="Español" selected={languageSelected} changeLanguage={changeLanguage} />
          <LanguageButton article="KK" language="қазақша" selected={languageSelected} changeLanguage={changeLanguage} />
          <LanguageButton article="KO" language="한국어" selected={languageSelected} changeLanguage={changeLanguage} />
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
  )
}