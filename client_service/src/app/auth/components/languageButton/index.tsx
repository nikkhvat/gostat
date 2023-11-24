"use client"
import React from 'react';
import style from './index.module.css';

import setCookiesLang from '@/app/actions/lang';

import { APP_LANGUAGES_TYPE } from '@/app/shared/constants/languages';

interface languageButtonProps {
  article: string;
  language: string;
  selected: string;
}

const LanguageButton: React.FC<languageButtonProps> = ({article, language, selected}) => {
  return (
    <div
      className={
        article === selected
          ? style.languageButtonSelected
          : style.languageButton
      }
      onClick={() => {
        setCookiesLang(article.toLowerCase() as APP_LANGUAGES_TYPE);
        
        setTimeout(() => {
          location.reload();
        }, 200)
      }}
    >
      <span className={style.upper} >{article}</span> | {language}
    </div>
  );
};

export default LanguageButton;