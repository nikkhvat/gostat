import React from "react";
import styles from "./layout.module.css";

import { LayoutTopLeftPicture } from "@/app/shared/icons/components/layout-top-left-picture";
import { LayoutBottomLeftPicture } from "@/app/shared/icons/components/layout-bottom-left-picture";
import { LayoutBottomRightPicture } from "@/app/shared/icons/components/layout-bottom-right-picture";

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