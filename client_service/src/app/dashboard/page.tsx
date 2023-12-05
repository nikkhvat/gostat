"use client";

import React from "react";

import styles from "./index.module.css";
import Header from "./Header";
import Menu from "./Menu";
import Charts from "./Charts";
import Metro from "./Metro";
import { useAppDispatch } from "../shared/libs/store/hooks";
import { getUserData } from "../shared/libs/store/features/dashboard/slice";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  dispatch(getUserData());

  return (
    <main className={styles.page}>
      <Menu />
      <div className={styles.content}>
        <Header/>
        <Metro />
        <Charts/>
      </div>
    </main>
  );
}
