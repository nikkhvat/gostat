"use client";

import React,{useState} from "react";
import { useRouter, useSearchParams } from "next/navigation";


import Storage from "@/app/shared/libs/storage";
import style from "@/app/auth/password-recovery/confirm/page.module.css";
import {Logo} from "@/app/shared/icons/components/logo";
import InputComponent from "@/app/auth/components/Input/index";
import { useTranslate } from "@/app/shared/libs/i18n";

import { resetPassword } from "../../api";



export default function Confirm() {
  const router = useRouter();

  const t = useTranslate();

  const secretCode = useSearchParams().get("code");

  const [password, setPassword] = useState("");
  const [repaetPassword, setRepeatPassword] = useState("");

  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const handleSetRepeatPassword = (e: any) => setRepeatPassword(e.target.value);

  const submit = async () => {
    if (password !== repaetPassword) {
      return alert("Пароль не совпадают");
    }
    
    if (secretCode === null ) {
      return alert("Возникла ошибка, секретный код не может быть пустым");
    }

    try {
      const resp = await resetPassword({
        password: password,
        secret: secretCode,
      });
  
      Storage.set("access_token", resp.data.access_token);
      router.push("/dashboard", { scroll: false });

    } catch (error: any) {
      if (error.body.error === "invalid secret code") {
        alert(t("errors.passwordRecovery.inValidSecret"));
      }
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
          {t("auth.passwordRecovery.reset.title")}
        </h2>
      </div>

      <div className={style.inputs}>
        <InputComponent
          type="password"
          placeholder={t("auth.passwordRecovery.reset.password")}
          onChange={handlePasswordChange}
          autoComplete="new-password"
        />
        <InputComponent
          type="password"
          placeholder={t("auth.passwordRecovery.reset.repeat")}
          onChange={handleSetRepeatPassword}
          autoComplete="new-password"
        />
      </div>

      <div className={style.button__block}>
        <button onClick={submit} className={style.button}>
          {t("auth.passwordRecovery.reset.button")}
        </button>
      </div>
    </div>
  );
}