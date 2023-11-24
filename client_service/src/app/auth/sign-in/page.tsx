"use client"
import styles from './page.module.css' 
import InputComponent from '@/app/auth/components/Input/index';
import Link from "next/link";

import { Logo } from "@/app/shared/icons/components/logo";

import { useEffect, useState } from 'react';
import { singIn } from '../api';
import Storage from '@/app/utils/storage';

import { useRouter } from "next/navigation";
import i18next from '@/app/shared/libs/i18n';

export default function SingIn() {
  const router = useRouter();

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

  const submit = async (e: any) => {
    e.preventDefault();
    const response = await singIn({
      login: email,
      password: password,
    });

    Storage.set("access_token", response.data.access_token);
    router.push("/dashboard", { scroll: false });
  };

  return (
    <div className={styles.box}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <Logo />
          <h1 className={styles.title}>GoStat</h1>
        </div>
        <h2 className={styles.top__button}>{i18next.t("auth.signIn.title")}</h2>
      </div>

      <form className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            {i18next.t("auth.signIn.subtitle")}
          </legend>
          <InputComponent
            typeProp="email"
            placeholder={i18next.t("auth.emailPlaceholder")}
            onChange={handleEmailChange}
          />
          <InputComponent
            typeProp="password"
            placeholder={i18next.t("auth.passwordPlaceholder")}
            check={true}
            onChange={handlePasswordChange}
          />
        </fieldset>
        <button className={styles.registration__button} onClick={submit}>
          {i18next.t("auth.signIn.button")}
        </button>
      </form>

      <Link className={styles.link} href={`/auth/sign-up`}>
        {i18next.t("auth.signIn.link")}
      </Link>
    </div>
  );
}