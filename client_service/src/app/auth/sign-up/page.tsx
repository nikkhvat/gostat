"use client"
import styles from './page.module.css' 
import InputComponent from '@/app/auth/components/Input/index';
import Image from 'next/image';
import Link from "next/link";

import logo from '@/app/assets/auth/logo.svg';

import { useEffect, useState } from 'react';
import { singUp } from '../api';
import Storage from "@/app/utils/storage";

import { useRouter } from "next/navigation";

export default function SingIn() {
  const router = useRouter();

  useEffect(() => {
    const token = Storage.get("access_token");

    if (token != null && token.length > 0) {
      router.push("/dashboard", { scroll: false });
    }
  }, [router]);

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
    const response = await singUp({
      first_name: name,
      last_name: '-',
      middle_name: '-',
      mail: email,
      login: email,
      password: password
    })
    

    Storage.set("access_token", response.data.access_token);
    Storage.set("refresh_token", response.data.refresh_token);

    router.push("/dashboard", { scroll: false });
  }

  return (
    <div className={styles.box}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <Image src={logo} alt="GoStat Logo" />
          <h1 className={styles.title}>GoStat</h1>
        </div>
        <h2 className={styles.top__button}>Create account</h2>
      </div>

      <form className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            Sign Up Information, name, email and password
          </legend>
          <InputComponent
            typeProp="text"
            placeholder="Name"
            onChange={handleNameChange}
          />
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
          <InputComponent
            typeProp="password"
            placeholder="Repeat password"
            check={true}
            onChange={handleRepeatChange}
          />
        </fieldset>
        <button className={styles.registration__button} onClick={submit}>
          Sign up
        </button>
      </form>

      <Link className={styles.link} href="/auth/sign-in">
        Already have an account?
      </Link>
    </div>
  );
}