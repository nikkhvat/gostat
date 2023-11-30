"use client";

import React, { useState, useEffect } from "react";

import { CookiesCat } from "@/app/shared/icons/components/cookies-cat";
import Storage from "@/app/shared/libs/storage";
import { useTranslate } from "@/app/shared/libs/i18n";

import styles from "./index.module.css";

const CookiesBanner: React.FC = () => {
  const t = useTranslate();

  const [show, setShow] = useState(false);

  const close = () => {
    Storage.set("is_allowed_cookie", true);
    setShow(false);
  };

  useEffect(() => {
    if (Boolean(Storage.get("is_allowed_cookie")) !== true) {
      setShow(true);
    }
  }, []);

  if (show == false) return <></>;
  
  return (
    <div className={styles.container}>
      <div className={styles.cat_container}>
        <CookiesCat />
      </div>
      <p className={styles.text}>
        {t("cookies.message")}
        <span className={styles.mark}>{t("cookies.privacyPolicy")}</span>
      </p>

      <button onClick={close} className={styles.button}>
        {t("cookies.button")}
      </button>
    </div>
  );
};

export default CookiesBanner;