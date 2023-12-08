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
import { singIn } from "@/app/auth/auth.service";

import z from "zod";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const AuthCredential = z.object({
    email: z.string(),
    password: z
      .string()
      .min(8, { message: t("errors.minCharacters", { field: t("errors.password") }) })
      .max(48, { message: t("errors.maxCharacters", { field: t("errors.password") }) })
      .regex(REGEX.specialCharRegex, { message: t("errors.specialCharRegex", { field: t("errors.password") }) })
      .regex(REGEX.uppercaseRegex, { message: t("errors.uppercaseRegex", { field: t("errors.password") }) })
      .regex(REGEX.digitRegex, { message: t("errors.digitRegex", { field: t("errors.password") }) }),
  });
  
  const AuthResponse = z.object({
    access_token: z.string()
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

    const credentials = AuthCredential.safeParse({ email, password });

    if (!credentials.success) {  
      for (let i = 0; i < credentials.error.errors.length; i++) {
        const err = credentials.error.errors[i];
        alert(err.message, "error");
      }

      return;
    }

    try {
      const response = await singIn({ login: email, password: password });
      const body = AuthResponse.safeParse(response.data);

      if (!body.success) {
        throw new Error("not valid response");
      }

      Storage.set("access_token", body.data.access_token);
      router.push("/dashboard", { scroll: false });
    } catch (error) {
      if ((error as Error).message === "not valid response") {
        alert(t("errors.responseNotValid"), "error");
      }

      const err = error as AxiosError<IAuthError>;
      if (err.response?.data.error === "login or password is not correct") {
        alert(t("errors.signIn.inCorrect"), "error");
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