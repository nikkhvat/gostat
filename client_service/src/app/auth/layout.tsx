import React from "react";
import styles from "./layout.module.css";

import {
  LayoutBottomLeftPicture,
  LayoutBottomRightPicture,
  LayoutTopLeftPicture,
} from "@/app/shared/icons/components/layout-picture";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <main className={styles.container_child}>{children}</main>

      <div className={styles.bottom_left_picture}>
        <LayoutBottomLeftPicture />
      </div>

      <div className={styles.top_left_picture}>
        <LayoutTopLeftPicture />
      </div>

      <div className={styles.bottom_right_picture}>
        <LayoutBottomRightPicture />
      </div>
    </div>
  );
}