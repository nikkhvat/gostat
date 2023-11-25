"use client"
import React, { useState, useEffect } from "react";

import styles from "./index.module.css"
import { CookiesCat } from "@/app/shared/icons/components/cookies-cat";

import Storage from "@/app/utils/storage";

const CookiesBanner: React.FC = () => {

  const [show, setShow] = useState(false);

  const close = () => {
    Storage.set("is_allowed_cookie", true);
    setShow(false);
  }

  useEffect(() => {
    if (Boolean(Storage.get("is_allowed_cookie")) !== true) {
      setShow(true);
    }
  }, [])

  if (show == false) return <></>
  
  return (
    <div className={styles.container}>
      <div className={styles.cat_container}>
        <CookiesCat />
      </div>
      <p className={styles.text}>
        We use cookies tp personalize your experience. By continuing to visit
        this website you agree to our use of cookies.
        <span className={styles.mark}>Privacy Policy.</span>
      </p>

      <button onClick={close} className={styles.button}>
        Got it!
      </button>
    </div>
  );
};

export default CookiesBanner;