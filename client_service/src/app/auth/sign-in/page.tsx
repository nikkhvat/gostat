"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



import Storage from "@/app/shared/libs/storage";
import { Logo } from "@/app/shared/icons/components/logo";
import InputComponent from "@/app/auth/components/Input/index";
import { useTranslate } from "@/app/shared/libs/i18n";
import { REGEX } from "@/app/shared/constants/regex";

import styles from "./page.module.css";
import { singIn } from "../api";



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
    return (
      REGEX.lengthRegex.test(password) &&
      REGEX.specialCharRegex.test(password) &&
      REGEX.digitRegex.test(password) &&
      REGEX.uppercaseRegex.test(password) &&
      REGEX.lowercaseRegex.test(password)
    );
  };

  const validateMail = (email: string) => {
    return REGEX.emailRegex.test(email);
  };

  const submit = async (e: any) => {
    const validPassword = validatePassword(password);
    const validMail = validateMail(email);

    if (password !== "" && email !== "" && validPassword === true && validMail === true) {

      try {
        e.preventDefault();
        const response = await singIn({
          login: email,
          password: password,
        });

        Storage.set("access_token", response.data.access_token);
        router.push("/dashboard", { scroll: false });

      } catch(error: any) {
        if (error.response.data.error === "login or password is not correct") {
          alert(t("errors.signIn.inCorrect"));
        } else {
          alert(t("errors.error"));
        }
      }

    } else {
      alert(t("auth.notValid"));
    }
  };

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
          <legend className={styles.legend}>{t("auth.signIn.subtitle")}</legend>
          <InputComponent
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            onChange={handleEmailChange}
            autoComplete="username"
          />
          <InputComponent
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
        </fieldset>
        <button className={styles.registration__button} onClick={submit}>
          {t("auth.signIn.button")}
        </button>
      </form>

      <Link className={styles.link} href="/auth/sign-up">
        {t("auth.signIn.link")}
      </Link>
    </div>
  );
}