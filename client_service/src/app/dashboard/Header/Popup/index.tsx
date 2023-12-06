"use client";

import React from "react";



import styles from "./index.module.css";
import { App } from "../..";
import Button from "../../components/Button";

import {useTranslate} from "@/app/shared/libs/i18n";




interface IPopUp {
  name: string;
  apps: App[];
  activeApp: string | undefined;
  singOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setActiveApp: Function
}

const PopUp: React.FC<IPopUp> = ({
  name,
  apps,
  activeApp,
  singOut,
  setActiveApp,
}) => {
  const t = useTranslate();

  return (
    <div id="popup" className={styles.container}>
      <div className={styles.item}>
        <p className={styles.item__title}>
          {t("menu.signedInAs", { name })}
        </p>
      </div>
      <div className={styles.item}>
        {apps &&
          apps.map((app) => (
            <Button
              key={app.id}
              className={styles.app_buton}
              active={activeApp === app.id}
              inActiveClass={styles.app_buton_inactive}
              onClick={() => setActiveApp(app)}
            >
              {app.name}
            </Button>
          ))}
      </div>
      <div className={styles.item}>
        <button className={styles.item__button}>
          {t("menu.options.settings")}
        </button>
        <button className={styles.item__button}>
          {t("menu.options.faq")}
        </button>
      </div>
      <div className={`${styles.item} ${styles.item__last}`}>
        <button className={styles.item__button} onClick={singOut}>
          {t("menu.singOut")}
        </button>
      </div>
    </div>
  );
};

export default PopUp;