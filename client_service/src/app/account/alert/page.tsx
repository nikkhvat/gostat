"use client"
import React from "react";

import style from '@/app/account/alert/page.module.css';

export default function Alert() {

  return (
    <div className={style.box}>
      <h2 className={style.alertText_one}>Account verification required</h2>
      <h3 className={style.alertText_two}>Please check your email for the verification link</h3>
    </div>
  )
}