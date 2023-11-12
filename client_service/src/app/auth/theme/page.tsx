"use client"
import React, { useState } from "react";
import style from '@/app/auth/theme/page.module.css';
import Link from "next/link";

export default function Theme() {
  return (
    <div className={style.box}>

      <div className={style.texts}>
        <p className={style.title}>Choose your look</p>
        <p className={style.description}>Select an appearance and see how the menu, buttons and windows adjust depending on which one you  choose</p>
      </div>

      <div className={style.main__block}></div>

      <div className={style.box__bottom}>
        <div className={style.bottom__bottoms}>
          <Link className={style.back__button} href="/dashboard">
              Back
          </Link>
          <Link className={style.continue__button} href="/dashboard">
              Continue
          </Link>
        </div>  
      </div>

    </div>
  )
}