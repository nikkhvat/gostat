"use client"
import styles from './page.module.css' 
import InputComponent from '@/app/auth/components/Input/index';
import Link from "next/link";

import { Logo } from "@/app/shared/icons/components/logo";

import { useEffect, useState } from 'react';
import { singIn } from '../api';
import Storage from '@/app/utils/storage';

import { useRouter } from "next/navigation";

import { useTranslate } from "@/app/shared/libs/i18n";

export default function SingIn() {
  const router = useRouter();

  const t = useTranslate();

  useEffect(() => {
    const token = Storage.get("access_token");

    if (token != null && token.length > 0) {
      router.push("/dashboard", { scroll: false });
    }
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const validatePassword = (password: string) => {
    // Пароль больше или ровно 8 символов
    const lengthRegex = /.{8,}/;

    // Пароль имеет спец знак
    const specialCharRegex = /[!@#$%^&*(),_.?":{}|<>]/;

    // Пароль имеет число
    const digitRegex = /\d/;

    // Пароль имеет большую и маленькую букву
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;

    return (
      lengthRegex.test(password) &&
      specialCharRegex.test(password) &&
      digitRegex.test(password) &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password)
    );
  }

  const validateMail = (mail: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email)
  }

  const submit = async (e: any) => {
    const validPassword = validatePassword(password)
    const validMail = validateMail(email)

    if (validPassword === true && validMail === true) {
      // e.preventDefault();
      // const response = await singIn({
      //   login: email,
      //   password: password,
      // });

      // Storage.set("access_token", response.data.access_token);
      // router.push("/dashboard", { scroll: false });
      alert('Пароль и логин валиден')
    } else {
      alert('Пароль или логин не валиден')
    }
  }

  return (
    <div className={styles.box}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <Logo />
          <h1 className={styles.title}>GoStat</h1>
        </div>
        <h2 className={styles.top__button}>{t("auth.signIn.title")}</h2>
      </div>

      <form className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            {t("auth.signIn.subtitle")}
          </legend>
          <InputComponent
            typeProp="email"
            placeholder={t("auth.emailPlaceholder")}
            onChange={handleEmailChange}
          />
          <InputComponent
            typeProp="password"
            placeholder={t("auth.passwordPlaceholder")}
            check={true}
            onChange={handlePasswordChange}
          />
        </fieldset>
        <button className={styles.registration__button} onClick={submit}>
          {t("auth.signIn.button")}
        </button>
      </form>

      <Link className={styles.link} href={`/auth/sign-up`}>
        {t("auth.signIn.link")}
      </Link>
    </div>
  );
}