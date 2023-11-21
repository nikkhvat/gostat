"use client"
import React, { ChangeEvent, useState } from 'react';
import style from '@/app/auth/components/languageButton/index.module.css';

interface languageButtonProps {
  article: string;
  language: string;
  selected: string;
  check?: boolean;
  changeLanguage: Function;
}

const LanguageButton: React.FC<languageButtonProps> = ({article, language, selected, changeLanguage}) => {
  return (
    <div 
      className={article === selected ? style.languageButtonSelected : style.languageButton} 
      onClick={() => {changeLanguage(article)}} >
      {article} | {language}
    </div>
  )
};

export default LanguageButton;