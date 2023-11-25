/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from "react";

import style from './page.module.css';
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../components/loader";
import { confirmEmail } from "../api";
import Link from "next/link";

import i18n from "@/app/shared/libs/i18n";

export default function Confirm() {
  const router = useRouter();

  const [confirmed, setConfirmed] = useState(false);

  const param = useSearchParams().get("code");

  const submit = async (code: string) => {
    const response = await confirmEmail(code);
    if (response.status === 200) {
      setConfirmed(true);
    }
  };

  useEffect(() => {
    if (param) {
      submit(param);
    } else {
      router.push(`/auth/alert`, { scroll: false });
    }
  }, [param]);

  return (
    <div className={style.box}>
      <div className={style.texts}>
        
        {confirmed &&<h2 className={style.title}>{i18n.t("auth.verification.title")}</h2>}
        {!confirmed && <h2 className={style.title}>{i18n.t("auth.confirmation.title")}</h2>}

        {confirmed && <h3 className={style.subtitle}>{i18n.t("auth.confirmation.subtitle")}</h3>}
        {!confirmed && <h3 className={style.subtitle}>{i18n.t("auth.loading")}</h3>}

        {!confirmed && <Loader />}
      </div>

      <div className={confirmed ? style.box__bottom : style.box__bottom__close}>
        <Link className={style.continue__button} href="/dashboard">
          {i18n.t("auth.continue")}
        </Link>
      </div>
    </div>
  );
}
