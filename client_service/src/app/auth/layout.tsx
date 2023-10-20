import React from "react";

import styles from "./layout.module.css"

import topLeftPicture from "@/app/assets/auth/topLeftPicture.svg";
import bottomLeftPicture from "@/app/assets/auth/bottomLeftPicture.svg";
import bottomRightPicture from "@/app/assets/auth/bottomRightPicture.svg";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <main className={styles.container_child}>{children}</main>

      <div className={styles.bottom_left_picture}>
        <Image src={bottomLeftPicture} alt="" role="presentation" />
      </div>

      <div className={styles.top_left_picture}>
        <Image src={topLeftPicture} alt="" role="presentation" />
      </div>

      <div className={styles.bottom_right_picture}>
        <Image src={bottomRightPicture} alt="" role="presentation" />
      </div>
    </div>
  );
}
