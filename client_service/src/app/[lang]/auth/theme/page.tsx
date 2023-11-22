"use client";
import React, { useState, useEffect } from "react";
import style from "./page.module.css";
import Link from "next/link";
import {
  LightCat,
  DarkCat,
  LightDarkCat,
} from "@/app/shared/icons/components/icon-cat-theme";
import Storage from "@/app/utils/storage";
import classNames from "classnames/bind";

import i18next, { checkLang } from "@/app/shared/libs/i18n/index";

const Theme = ({ params: { lang } }: any) => {
  checkLang(lang);

  const cx = classNames.bind(style);

  const [theme, setTheme] = useState(
    null as "dark" | "light" | "system" | null
  );

  const getInitialTheme = (): "dark" | "light" | "system" => {
    const storedTheme = Storage.get("theme");

    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    else return "system";
  };

  const updateTheme = (newTheme: "dark" | "light" | "system" | null) => {
    if (!newTheme) return;

    setTheme(newTheme);

    document.body.classList.remove("light-theme", "dark-theme");
    if (newTheme !== "system") {
      const className = `${newTheme}-theme`;
      document.body.classList.add(className);
    }

    Storage.set("theme", newTheme);
  };

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    updateTheme(theme);
  }, [theme]);

  return (
    <div className={style.box}>
      <div className={style.texts}>
        <p className={style.title}>{i18next.t("theme.title")}</p>
        <p className={style.description}>{i18next.t("theme.subtitle")}</p>
      </div>

      <div className={style.main__block}>
        {[
          { title: i18next.t("theme.light"), key: "light" },
          { title: i18next.t("theme.dark"), key: "dark" },
          { title: i18next.t("theme.system"), key: "system" },
        ].map((t: any) => (
          <button
            key={t.key}
            onClick={() => updateTheme(t.key)}
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
        ))}
      </div>

      <div className={style.box__bottom}>
        <div className={style.bottom__bottoms}>
          <Link className={style.back__button} href="/dashboard">
            {i18next.t("theme.back")}
          </Link>
          <Link className={style.continue__button} href="/dashboard">
            {i18next.t("theme.continue")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Theme;
