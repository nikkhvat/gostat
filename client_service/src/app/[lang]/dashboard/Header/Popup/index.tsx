"use client"
import React from "react";

import styles from "./index.module.css"
import { App } from "../..";
import Button from "../../components/Button";

interface IPopUp {
  name: string;
  apps: App[];
  activeApp: string | null;
  singOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setActiveApp: Function
}

import i18next from "@/app/shared/libs/i18n";

const PopUp: React.FC<IPopUp> = ({
  name,
  apps,
  activeApp,
  singOut,
  setActiveApp,
}) => {
  return (
    <div id="popup" className={styles.container}>
      <div className={styles.item}>
        <p className={styles.item__title}>
          {i18next.t("menu.signedInAs", { name })}
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
              onClick={() => setActiveApp(app.id)}
            >
              {app.name}
            </Button>
          ))}
      </div>
      <div className={styles.item}>
        <button className={styles.item__button}>
          {i18next.t("menu.options.settings")}
        </button>
        <button className={styles.item__button}>
          {i18next.t("menu.options.faq")}
        </button>
      </div>
      <div className={`${styles.item} ${styles.item__last}`}>
        <button className={styles.item__button} onClick={singOut}>
          {i18next.t("menu.singOut")}
        </button>
      </div>
    </div>
  );
};

export default PopUp;