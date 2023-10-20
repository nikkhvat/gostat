"use client"
import styles from './page.module.css' 
import InputComponent from '@/app/auth/components/Input/index';
import Image from 'next/image';
import Link from "next/link";

import logo from '../../assets/auth/logo.svg';

import { useEffect, useState } from 'react';
import { singIn } from '../api';
import Storage from '@/app/utils/storage';

import { useRouter } from "next/navigation";

export default function SingIn() {
  const router = useRouter();

  useEffect(() => {
    const token = Storage.get("access_token");

    if (token != null && token.length > 0) {
      router.push("/dashboard", { scroll: false });
    }
  }, [router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  }

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  }

  const submit = async (e: any) => {
    e.preventDefault()
    console.log({email, password})
    const response = await singIn({
      login: email,
      password: password,
    });
    
    Storage.set("access_token", response.data.access_token);
    Storage.set("refresh_token", response.data.refresh_token);

    router.push("/dashboard", { scroll: false });
  }

  return (
    <div className={styles.box}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <Image src={logo} alt="Picture of the logo" />
          <p className={styles.title}>GoStat</p>
        </div>
        <p className={styles.top__button}>Create account</p>
      </div>

      <form className={styles.form}>
        <InputComponent
          typeProp="email"
          placeholder="E-mail"
          onChange={handleEmailChange}
        />
        <InputComponent
          typeProp="password"
          placeholder="Password"
          check={true}
          onChange={handlePasswordChange}
        />
        <button className={styles.registration__button} onClick={submit}>
          Sign in
        </button>
      </form>

      <Link className={styles.link} href="/auth/sign-up">
        Create account
      </Link>
    </div>
  );
}