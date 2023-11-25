"use client"
import React, { useState } from "react";
import style from '@/app/auth/password-recovery/request/page.module.css'
import {Logo} from '@/app/shared/icons/components/logo';
import {requestResetPAssword} from '../../api';

import { useTranslate } from "@/app/shared/libs/i18n";

export default function Request() {

  const t = useTranslate();

  const [page, setPage] = useState(false);
  const [email, setEmail] = useState('');

  const submit = async (e: any) => {
    const response = await requestResetPAssword({
      email: e
    })

    console.log(response)
  }

  return (
    <div className={style.box}>

      <div className={style.top}>
        <div className={style.logo}>
          <Logo />
          <h1 className={style.title}>GoStat</h1>
        </div>
        <h2 className={style.top__button}>{page === true ? t("auth.passwordRecovery.alert.title") : t("auth.passwordRecovery.form.title")}</h2>
      </div>

      {
        page === true
        ?
        <div className={style.main__text}>
          <p>{t("auth.passwordRecovery.alert.alert")}</p>
        </div>
        :
        <div className={style.input__block}>
          <input onChange={(e) => {setEmail(e.target.value)}} className={style.input} type="text" placeholder={t("auth.passwordRecovery.form.input")} />
        </div>
      }

      {
        page === true 
        ?
        <></>
        :
        <div className={style.main__block}>
          <button onClick={() => {submit(email)}} className={style.button}>{t("auth.passwordRecovery.form.button")}</button>
        </div>
      }

    </div> 
  )
}