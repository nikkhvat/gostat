"use client"
import React, { useState } from "react";
import style from '@/app/auth/theme/page.module.css';
import Link from "next/link";

import { LightCat, DarkCat, LightDarkCat } from "@/app/shared/icons/components/icon-cat-theme";

import Storage from "@/app/utils/storage";

import classNames from "classnames/bind";

export default function Theme() {
  const cx = classNames.bind(style);

  const currentTheme = Storage.get("theme") === "dark" ? "dark" : Storage.get("theme") === "light" ? "light" : "system"

  const [theme, setThemeState] = useState(
    currentTheme as "dark" | "light" | "system"
  );

  const setTheme = (theme: "dark" | "light" | "system") => {
    if (theme === "dark") {
      document.body.dataset.theme = "dark";
      Storage.set("theme", "dark");
    }

    if (theme === "light") {
      document.body.dataset.theme = "light";
      Storage.set("theme", "light");
    }

    if (theme === "system") {
      Storage.delete("theme")

      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.body.dataset.theme = "dark";
      } else {
        document.body.dataset.theme = "light";
      }
    }
  };

  const toggleTheme = (theme: "dark" | "light" | "system") => {
    setTheme(theme);
    setThemeState(theme);
  };

  return (
    <div className={style.box}>
      <div className={style.texts}>
        <p className={style.title}>Choose your look</p>
        <p className={style.description}>
          Select an appearance and see how the menu, buttons and windows adjust
          depending on which one you choose
        </p>
      </div>

      <div className={style.main__block}>
        <button
          onClick={() => toggleTheme("light")}
          className={cx({
            button: true,
            active: theme === "light",
          })}
        >
          <LightCat />
          <p className={style.button_text}>Light</p>
        </button>
        <button
          onClick={() => toggleTheme("dark")}
          className={cx({
            button: true,
            button_dark: true,
            active: theme === "dark",
          })}
        >
          <DarkCat />
          <p className={style.button_text}>Dark</p>
        </button>
        <button
          onClick={() => toggleTheme("system")}
          className={cx({
            button: true,
            button_system: true,
            active: theme === "system",
          })}
        >
          <LightDarkCat />
          <p className={style.button_text}>Auto</p>
        </button>
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