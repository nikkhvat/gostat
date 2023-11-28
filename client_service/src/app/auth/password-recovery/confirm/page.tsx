"use client"
import React,{useState} from "react";
import style from '@/app/auth/password-recovery/confirm/page.module.css';
import {Logo} from '@/app/shared/icons/components/logo';
import InputComponent from '@/app/auth/components/Input/index';

import { useTranslate } from "@/app/shared/libs/i18n";

import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../../api";

import Storage from "@/app/shared/libs/storage"

export default function Confirm() {
  const router = useRouter();

  const t = useTranslate();

  const secretCode = useSearchParams().get("code");

  const [password, setPassword] = useState('');
  const [repaetPassword, setRepeatPassword] = useState('');

  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const handleSetRepeatPassword = (e: any) => setRepeatPassword(e.target.value);

  const submit = async () => {
    if (password !== repaetPassword) {
      return alert("Пароль не совпадают")
    }
    
    if (secretCode === null ) {
      return alert("Возникла ошибка, секретный код не может быть пустым")
    }

    try {
      const resp = await resetPassword({
        password: password,
        secret: secretCode,
      });
  
      Storage.set("access_token", resp.data.access_token);
      router.push("/dashboard", { scroll: false });
    } catch (error) {
      alert("Возникла ошибка")
    }
  }
  
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
          typeProp="password"
          placeholder={t("auth.passwordRecovery.reset.password")}
          check={true}
          onChange={handlePasswordChange}
        />
        <InputComponent
          typeProp="password"
          placeholder={t("auth.passwordRecovery.reset.repeat")}
          check={true}
          onChange={handleSetRepeatPassword}
        />
      </div>

      <div className={style.button__block}>
        <button onClick={submit} className={style.button}>
          {t("auth.passwordRecovery.reset.button")}
        </button>
      </div>
    </div>
  )
}