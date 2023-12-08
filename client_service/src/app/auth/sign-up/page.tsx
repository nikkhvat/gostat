"use client";

import React from "react";
import Link from "next/link";
import z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import Storage from "@/app/shared/libs/storage";
import { Logo } from "@/app/shared/icons/components/logo";
import InputComponent from "@/app/auth/components/Input/index";
import { useTranslate } from "@/app/shared/libs/i18n";

import { singUp } from "@/app/auth/auth.service";
import styles from "./page.module.css";

import { REGEX } from "@/app/shared/constants/regex";
import { AxiosError } from "axios";
import { IAuthError } from "../auth.types";

import { useToast } from "@/app/widgets/toast";

export default function SingIn() {  
  const toast = useToast();

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

  const AuthCredential = z.object({
    first_name: z.string(),
    last_name: z.string(),
    middle_name: z.string(),
    mail: z
      .string()
      .email({ message: t("errors.invalidEmail") }),
    login: z.string(),
    password: z
      .string()
      .min(8, { message: t("errors.minCharacters", { field: t("errors.password") }) })
      .max(48, { message: t("errors.maxCharacters", { field: t("errors.password") }) })
      .regex(REGEX.specialCharRegex, { message: t("errors.specialCharRegex", { field: t("errors.password") }) })
      .regex(REGEX.uppercaseRegex, { message: t("errors.uppercaseRegex", { field: t("errors.password") }) })
      .regex(REGEX.digitRegex, { message: t("errors.digitRegex", { field: t("errors.password") }) }),
  });
  
  const AuthResponse = z.object({
    access_token: z.string(),
  });

  const alert = (message: string, type: "error" | "info") =>
    toast.create({
      title: t("errors.authError"),
      description: message,
      type: type,
      duration: 6000,
      placement: "bottom-start",
    });

  const submit = async (e: any) => {
    e.preventDefault();

    const credentials = AuthCredential.safeParse({
      first_name: name,
      last_name: "-",
      middle_name: "-",
      mail: email,
      login: login,
      password: password,
    });

    if (!credentials.success) {
      for (let i = 0; i < credentials.error.errors.length; i++) {
        const err = credentials.error.errors[i];
        alert(err.message, "error");
      }

      return;
    }

    if (password != repeat) {
      alert(t("errors.passwordsDontMatch"), "error");
      return; 
    }

    try {
      const response = await singUp(credentials.data);
      const body = AuthResponse.safeParse(response.data);

      if (!body.success) {
        throw new Error("not valid response");
      }

      Storage.set("access_token", body.data.access_token);
      router.push("/dashboard", { scroll: false });

    } catch(error) {
      if ((error as Error).message === "not valid response") {
        alert(t("errors.responseNotValid"), "error");
      }

      const err = error as AxiosError<IAuthError>;

      if (err.response?.data.error === "email already in exists") {
        alert(t("errors.signUP.emailExists"), "error");
      } else if (err.response?.data.error === "login already in exists") {
        alert(t("errors.signUP.loginExists"), "error");
      } else if (err.response?.data.error === "password must be at least 8 characters, include an uppercase letter and a special character") {
        alert(t("errors.passwordNotSecure"), "error");
      } else { 
        alert(t("errors.error"), "error");
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

      <Link className={styles.link} href="/auth/language">
        {t("auth.signUp.link")}
      </Link>
    </div>
  );
}