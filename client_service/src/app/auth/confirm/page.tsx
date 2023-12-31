"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";


import {useTranslate} from "@/app/shared/libs/i18n";

import style from "./page.module.css";
import Loader from "../components/loader";
import { confirmEmail } from "@/app/auth/auth.service";




export default function Confirm() {
  const t = useTranslate();
  const router = useRouter();

  const [confirmed, setConfirmed] = useState(false);

  const param = useSearchParams().get("code");

  const submit = async (code: string) => {

    try {
      const response = await confirmEmail(code);
      if (response.status === 200) {
        setConfirmed(true);
      }
    } catch (error: any) {
      if (error.response.data.error === "Invalid secret") {
        alert(t("errors.confirmMail.inValidSecret"));
      } else if (error.response.data.error === "Unexpected error, failed to verify account") {
        alert(t("errors.confirmMail.unexpectedError"));
      }
    }
  };

  useEffect(() => {
    if (param) {
      submit(param);
    } else {
      router.push("/auth/alert", { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return (
    <div className={style.box}>
      <div className={style.texts}>
        
        {confirmed &&<h2 className={style.title}>{t("auth.verification.title")}</h2>}
        {!confirmed && <h2 className={style.title}>{t("auth.confirmation.title")}</h2>}

        {confirmed && <h3 className={style.subtitle}>{t("auth.confirmation.subtitle")}</h3>}
        {!confirmed && <h3 className={style.subtitle}>{t("auth.loading")}</h3>}

        {!confirmed && <Loader />}
      </div>

      <div className={confirmed ? style.box__bottom : style.box__bottom__close}>
        <Link className={style.continue__button} href="/dashboard">
          {t("auth.continue")}
        </Link>
      </div>
    </div>
  );
}
