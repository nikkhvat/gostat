"use client"
import React,{useState} from "react";
import style from '@/app/auth/password-recovery/confirm/page.module.css';
import {Logo} from '@/app/shared/icons/components/logo';
import InputComponent from '@/app/auth/components/Input/index';

export default function Confirm() {

  const [password, setPassword] = useState('');
  const [repaetPassword, setRepeatPassword] = useState('');

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  }

  const handleSetRepeatPassword = (e: any) => {
    setRepeatPassword(e.target.value)
  }
  
  return (
    <div className={style.box}>

      <div className={style.top}>
        <div className={style.logo}>
          <Logo />
          <h1 className={style.title}>GoStat</h1>
        </div>
        <h2 className={style.top__button}>Set new password</h2>
      </div>

      <div className={style.inputs}>
        <InputComponent
          typeProp="password"
          placeholder="New password"
          check={true}
          onChange={handlePasswordChange}
        />
        <InputComponent
          typeProp="password"
          placeholder="Repeat password"
          check={true}
          onChange={handleSetRepeatPassword}
        />
      </div>

      <div className={style.button__block}>
        <button className={style.button}>Reset password</button>
      </div>

    </div>
  )
}