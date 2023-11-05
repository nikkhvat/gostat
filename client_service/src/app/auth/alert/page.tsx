"use client"
import React from "react";

import style from '@/app/auth/alert/page.module.css';

export default function Alert() {

  return (
    <div className={style.box}>
      <div className={style.texts}>
        <h2 className={style.title}>Account verification required</h2>
        <h3 className={style.subtitle}>Please check your email for the verification link</h3>
        <button className={style.send__button}>Send mail again</button>
      </div>
    </div>
  )
}