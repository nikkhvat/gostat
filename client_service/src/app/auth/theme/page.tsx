"use client"
import React, { use, useState } from "react";
import style from '@/app/auth/theme/page.module.css';
import Link from "next/link";
import Image from 'next/image';

import lightCat from '@/app/assets/auth/light-cat.svg';
import darkCat from '@/app/assets/auth/dark-cat.svg';
import halfCat from '@/app/assets/auth/half-cat.svg';

export default function Theme() {

  let [theme, setTheme] = useState('auto');

  return (
    <div className={style.box}>

      <div className={style.texts}>
        <p className={style.title}>Choose your look</p>
        <p className={style.description}>Select an appearance and see how the menu, buttons and windows adjust depending on which one you  choose</p>
      </div>

      <div className={style.main__block}>

        <div onClick={() => {setTheme('light')}}>
          <div className={theme === 'light' ? style.light__button__large : style.light__button}>
            <Image src={lightCat} alt="light-cat" width={theme === 'light' ? '156' : '104'} height={theme === 'light' ? '117' : '78'} />
          </div>
          <p className={style.light__text}>Light</p>
        </div>

        <div onClick={() => {setTheme('dark')}}>
          <div className={theme === 'dark' ? style.dark__button__large : style.dark__button}>
            <Image src={darkCat} alt="dark-cat" width={theme === 'dark' ? '156' : '104'} height={theme === 'dark' ? '117' : '78'} />
          </div>
          <p className={style.dark__text}>Dark</p>
        </div>

        {/* <div onClick={() => {setTheme('auto')}}>
          <div className={theme === 'auto' ? style.system__button__large : style.system__button}>
            <div className={style.system__button__left}>
              <Image src={lightCat} alt="light-cat" width={theme === 'auto' ? '156' : '104'} height={theme === 'auto' ? '117' : '78'} />
            </div>
            <div className={style.system__button__right}>
              <Image src={halfCat} alt="half-cat" width={theme === 'auto' ? '156' : '100'} height={theme === 'auto' ? '117' : '129'} />
            </div>
          </div>
          <p className={style.light__text}>Auto</p>
        </div> */}
        <div onClick={() => {setTheme('auto')}}>
          <div className={theme === 'auto' ? style.system__button__large : style.system__button}>
            <Image src={lightCat} alt="light-cat" width={theme === 'auto' ? '156' : '104'} height={theme === 'auto' ? '117' : '78'} />
            {/* <div className={style.system__button__left}>
              <Image src={lightCat} alt="light-cat" width={theme === 'auto' ? '156' : '104'} height={theme === 'auto' ? '117' : '78'} />
            </div>
            <div className={style.system__button__right}>
              <Image src={halfCat} alt="half-cat" width={theme === 'auto' ? '156' : '100'} height={theme === 'auto' ? '117' : '129'} />
            </div> */}
          </div>
          <p className={style.light__text}>Auto</p>
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