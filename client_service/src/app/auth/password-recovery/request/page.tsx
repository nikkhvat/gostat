"use client"
import React, { useState } from "react";
import style from '@/app/auth/password-recovery/request/page.module.css'
import {Logo} from '@/app/shared/icons/components/logo';

export default function Request() {

  let [page, setPage] = useState(false);

  return (
    <div className={style.box}>

      <div className={style.top}>
        <div className={style.logo}>
          <Logo />
          <h1 className={style.title}>GoStat</h1>
        </div>
        <h2 className={style.top__button}>{page === true ? 'Password recovery' : 'Password reset email sent'}</h2>
      </div>

      {
        page === true 
        ?
        <div className={style.main__block}>
          <p className={style.main__text}>Password reset instructions sent. Check your email, or spam folder if not received.</p>
        </div>
        :
        <div className={style.main__block}>
          <input className={style.input} type="text" placeholder="E-mail" />
          <button className={style.button}>Send reset link</button>
        </div>
      }

    </div> 
  )
}