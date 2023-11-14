"use client"
import React, { useState } from "react";
import style from '@/app/auth/theme/page.module.css';
import Link from "next/link";
import Image from 'next/image';

import lightCat from '@/app/assets/auth/light-cat.svg';
import darkCat from '@/app/assets/auth/dark-cat.svg';
import halfCat from '@/app/assets/auth/half-cat.svg';

export default function Theme() {
  return (
    <div className={style.box}>

      <div className={style.texts}>
        <p className={style.title}>Choose your look</p>
        <p className={style.description}>Select an appearance and see how the menu, buttons and windows adjust depending on which one you  choose</p>
      </div>

      <div className={style.main__block}>
        <div className={style.light__button}>
          <Image src={lightCat} alt="light-cat" />
        </div>
        <div className={style.dark__button}>
          <Image src={darkCat} alt="dark-cat" />
        </div>
        <div className={style.system__button}>
          <div className={style.system__button__left}>
            <Image src={lightCat} alt="light-cat" />
          </div>
          <div className={style.system__button__right}>
            <Image src={halfCat} alt="half-cat" />
          </div>
        </div>
      </div>

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