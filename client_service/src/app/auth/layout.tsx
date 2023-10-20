import React from "react";

import styles from "./layout.module.css"

import absolutepic1 from "../assets/auth/absolute1.svg";
import absolutepic2 from "../assets/auth/absolute2.svg";
import absolutepic3 from "../assets/auth/absolute3.svg";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.container}>
      <div className={styles.container_child} >{children}</div>

      <div className={styles.absolute__element__first}>
        <Image src={absolutepic2} alt="Absolute picture one" />
      </div>

      <div className={styles.absolute__element__second}>
        <Image src={absolutepic1} alt="Absolute picture two" />
      </div>

      <div className={styles.absolute__element__third}>
        <Image src={absolutepic3} alt="Absolute picture three" />
      </div>
    </main>
  );
}
