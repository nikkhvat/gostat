"use client"
import { style } from 'd3'
import styles from './page.module.css' 
import InputComponent from '../components/Input/index';
import Image from 'next/image';

import logo from '../../assets/auth/logo.svg';

import absolutepic1 from '../../assets/auth/absolute1.svg';
import absolutepic2 from '../../assets/auth/absolute2.svg';
import absolutepic3 from '../../assets/auth/absolute3.svg';
import { useEffect, useState } from 'react';

export default function SingIn() {

  const [name, setName] = useState('ali');

  return (
    <main className={styles.container}>
      <div className={styles.box}>
        <div className={styles.top}>
          <div className={styles.logo}>
            <Image 
              src={logo}
              alt="Picture of the logo"
            />
            <p className={styles.title}>GoStat</p>
          </div>
          <p className={styles.top__button} onClick={() => setName('nikita')}>Create account {name}</p>
        </div>
        <form className={styles.form}>
          <InputComponent type='text' placeholder='Name'/>
          <InputComponent type='email' placeholder='E-mail'/>
          <InputComponent type='password' placeholder='Password'/>
          <InputComponent type='password' placeholder='Repeat password'/>
          <button className={styles.registration__button}>Sign up</button>
        </form>
        <p className={styles.link}>Already have an account?</p>
      </div>
      <div className={styles.absolute__element__first}>
        <Image 
          src={absolutepic2}
          alt="Absolute picture one"
        />
      </div>
      <div className={styles.absolute__element__second}>
        <Image 
          src={absolutepic1}
          alt="Absolute picture two"
        />
      </div>
      <div className={styles.absolute__element__third}>
        <Image 
          src={absolutepic3}
          alt="Absolute picture three"
        />
      </div>
    </main>
  )
}