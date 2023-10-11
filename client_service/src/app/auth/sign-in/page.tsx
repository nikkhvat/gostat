"use client"
import styles from './page.module.css' 
import InputComponent from '@/app/auth/components/Input/index';
import Image from 'next/image';

import logo from '../../assets/auth/logo.svg';
import absolutepic1 from '../../assets/auth/absolute1.svg';
import absolutepic2 from '../../assets/auth/absolute2.svg';
import absolutepic3 from '../../assets/auth/absolute3.svg';

import { useState } from 'react';
import { singUp } from '../api';

export default function SingIn() {

  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  }

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  }

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  }

  const handleRepeatChange = (e: any) => {
    setRepeat(e.target.value);
  }

  const submit = async (e: any) => {
    e.preventDefault()
    console.log({name, email, password, repeat})
    const response = await singUp({
      first_name: name,
      last_name: '-',
      middle_name: '-',
      mail: email,
      login: email,
      password: password
    })
    console.log(response.data)
  }

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
          <p className={styles.top__button}>Create account</p>
        </div>

        <form className={styles.form}>
          <InputComponent typeProp='text' placeholder='Name' onChange={handleNameChange}/>
          <InputComponent typeProp='email' placeholder='E-mail' onChange={handleEmailChange}/>
          <InputComponent typeProp='password' placeholder='Password' check={true} onChange={handlePasswordChange}/>
          <InputComponent typeProp='password' placeholder='Repeat password' check={true} onChange={handleRepeatChange}/>
          <button className={styles.registration__button} onClick={submit}>Sign up</button>
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