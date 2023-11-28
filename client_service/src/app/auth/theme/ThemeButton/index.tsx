"use client"

import setCookiesTheme from "@/app/shared/actions/theme";
import React from "react";

import { DarkCat, LightCat, LightDarkCat } from "@/app/shared/icons/components/icon-cat-theme";

import classNames from "classnames/bind";

import style from "./index.module.css";


interface ThemeButtonProp {
  t: any;
  key: string;
  theme: string
}

export const ThemeButton: React.FC<ThemeButtonProp> = ({ t, key, theme }) => {
  const cx = classNames.bind(style);

  return (
    <button
      key={key}
      onClick={() => setCookiesTheme(t.key)}
      className={cx({
        button: true,
        button_dark: t.key === "dark",
        button_system: t.key === "system",
        active: theme === t.key,
      })}
    >
      {t.key === "light" && <LightCat />}
      {t.key === "dark" && <DarkCat />}
      {t.key === "system" && <LightDarkCat />}
      <p className={style.button_text}>{t.title}</p>
    </button>
  );
};

export default ThemeButton;