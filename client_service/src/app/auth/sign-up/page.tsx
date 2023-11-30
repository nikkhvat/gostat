"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import Storage from "@/app/shared/libs/storage";
import { Logo } from "@/app/shared/icons/components/logo";
import InputComponent from "@/app/auth/components/Input/index";
import { useTranslate } from "@/app/shared/libs/i18n";

import { singUp } from "../api";
import styles from "./page.module.css";

export default function SingIn() {  
  const router = useRouter();

  const t = useTranslate();

  useEffect(() => {
    const token = Storage.get("access_token");

    if (token != null && token.length > 0) {
      router.push("/dashboard", { scroll: false });
    }
  }, [router]);

  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");

  const handleNameChange = (e: any) => setName(e.target.value);
  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handleRepeatChange = (e: any) => setRepeat(e.target.value);
  const handleLoginChange = (e: any) => setLogin(e.target.value);
  const handlePasswordChange = (e: any) => setPassword(e.target.value);

  const submit = async (e: any) => {
    if (password != repeat) {
      alert(t("errors.passwordsDontMatch"));
      return; 
    }

    try {
      e.preventDefault();
      const response = await singUp({
        first_name: name,
        last_name: "-",
        middle_name: "-",
        mail: email,
        login: login,
        password: password,
      }); 
      Storage.set("access_token", response.data.access_token);
      router.push("/dashboard", { scroll: false });

    } catch(error: any) {
      if (error.response.data.error === "email already in exists") {
        alert(t("errors.signUP.emailExists"));
      } else if (error.response.data.error === "login already in exists") {
        alert(t("errors.signUP.loginExists"));
      } else if (error.response.data.error === "password must be at least 8 characters, include an uppercase letter and a special character") {
        alert(t("errors.passwordNotSecure"));
      } else {
        alert(t("errors.error"));
      }
    }
  };

  return (
    <div className={styles.box}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <Logo />
          <h1 className={styles.title}>GoStat</h1>
        </div>
        <h2 className={styles.top__button}>{t("auth.signUp.title")}</h2>
      </div>

      <form className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{t("auth.signUp.subtitle")}</legend>
          <InputComponent
            type="text"
            placeholder={t("auth.namePlaceholder")}
            onChange={handleNameChange}
            autoComplete="given-name"
          />
          <InputComponent
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            onChange={handleEmailChange}
            autoComplete="email"
          />
          <InputComponent
            type="email"
            placeholder={t("auth.loginPlaceholder")}
            onChange={handleLoginChange}
            autoComplete="username"
          />
          <InputComponent
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />
          <InputComponent
            type="password"
            placeholder={t("auth.repeatPlaceholder")}
            onChange={handleRepeatChange}
            autoComplete="new-password"
          />
        </fieldset>
        <button className={styles.registration__button} onClick={submit}>
          {t("auth.signUp.button")}
        </button>
      </form>

      <Link className={styles.link} href="/auth/sign-in">
        {t("auth.signUp.link")}
      </Link>
    </div>
  );
}