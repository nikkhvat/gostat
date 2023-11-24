"use client"
import React from "react";

import style from './page.module.css';

import i18next from "@/app/shared/libs/i18n";

export default function Alert() {

  return (
    <div className={style.box}>
      <div className={style.texts}>
        <h2 className={style.title}>{i18next.t("auth.alert.title")}</h2>
        <h3 className={style.subtitle}>{i18next.t("auth.alert.subtitle")}</h3>
        <button className={style.send__button}>
          {i18next.t("auth.alert.button")}
        </button>
      </div>
    </div>
  );
}