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
        <p className={styles.item__title}>Signed in as {name}</p>
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
        <button className={styles.item__button}>Settings</button>
        <button className={styles.item__button}>Faq</button>
      </div>
      <div className={`${styles.item} ${styles.item__last}`}>
        <button className={styles.item__button} onClick={singOut}>
          Sing out
        </button>
      </div>
    </div>
  );
};

export default PopUp;