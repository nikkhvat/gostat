"use client";

import React, { useState } from "react";

import style from "@/app/auth/password-recovery/request/page.module.css";
import {Logo} from "@/app/shared/icons/components/logo";
import { useTranslate } from "@/app/shared/libs/i18n";

import { requestResetPassword } from "../../api";


enum Page {
  Request = "request",
  Alert = "alert"
}

export default function Request() {
  const t = useTranslate();

  const [page, setPage] = useState(Page.Request);
  const [email, setEmail] = useState("");

  const submit = async (e: any) => {
    try {
      const response = await requestResetPassword(e);

      if (response.data.successful === true) {
        setPage(Page.Alert);
      }
    } catch (error: any) {
      alert("Произошла ошибка");
    }
  };

  return (
    <div className={style.box}>
      <div className={style.top}>
        <div className={style.logo}>
          <Logo />
          <h1 className={style.title}>GoStat</h1>
        </div>
        <h2 className={style.top__button}>
          {page === Page.Alert && t("auth.passwordRecovery.alert.title")}
          {page === Page.Request && t("auth.passwordRecovery.form.title")}
        </h2>
      </div>

      {page === Page.Alert && (
        <div className={style.main__text}>
          <p>{t("auth.passwordRecovery.alert.alert")}</p>
        </div>
      )}

      {page === Page.Request && (
        <div className={style.input__block}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className={style.input}
            type="text"
            placeholder={t("auth.passwordRecovery.form.input")}
            autoComplete="email"
          />
        </div>
      )}

      {page === Page.Request && (
        <div className={style.main__block}>
          <button onClick={() => submit(email)} className={style.button}>
            {t("auth.passwordRecovery.form.button")}
          </button>
        </div>
      )}
    </div>
  );
}