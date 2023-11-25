"use client"
import React, { useState } from "react";
import style from '@/app/auth/password-recovery/request/page.module.css'
import {Logo} from '@/app/shared/icons/components/logo';
import {requestResetPAssword} from '../../api';

export default function Request() {

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
        <h2 className={style.top__button}>{page === true ? 'Password reset email sent' : 'Password recovery'}</h2>
      </div>

      {
        page === true
        ?
        <div className={style.main__text}>
          <p>Password reset instructions sent. Check your email, or spam folder if not received.</p>
        </div>
        :
        <div className={style.input__block}>
          <input onChange={(e) => {setEmail(e.target.value)}} className={style.input} type="text" placeholder="E-mail" />
        </div>
      }

      {
        page === true 
        ?
        <></>
        :
        <div className={style.main__block}>
          <button onClick={() => {submit(email)}} className={style.button}>Send reset link</button>
        </div>
      }

    </div> 
  )
}