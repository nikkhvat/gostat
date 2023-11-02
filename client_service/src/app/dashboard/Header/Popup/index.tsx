import React from "react";

import styles from "./index.module.css"

interface IPopUp {
  name: string
  singOut: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const PopUp: React.FC<IPopUp> = ({ name, singOut }) => {
  return (
    <div id="popup" className={styles.container}>
      <div className={styles.item}>
        <p className={styles.item__title}>Signed in as {name}</p>
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