"use client";

import React from "react";

import {useTranslate} from "@/app/shared/libs/i18n";

import style from "./page.module.css";


export default function Alert() {

  const t = useTranslate();

  return (
    <div className={style.box}>
      <div className={style.texts}>
        <h2 className={style.title}>{t("auth.alert.title")}</h2>
        <h3 className={style.subtitle}>{t("auth.alert.subtitle")}</h3>
        <button className={style.send__button}>
          {t("auth.alert.button")}
        </button>
      </div>
    </div>
  );
}