"use client";

import React from "react";

import styles from "./index.module.css";
import Header from "./Header";
import Menu from "./Menu";
import Charts from "./Charts";
import Metro from "./Metro";
import TimeStatistic from "./timeStatistic";
import { IUserData } from ".";
import { useAppDispatch, useAppSelector } from "../shared/libs/store/hooks";
import { getStats, getUserData } from "../shared/libs/store/features/dashboard/slice";
import { RootState } from "../shared/libs/store/store";
import Vidget from "./widget";

export default function Dashboard() {


  return (
    <main className={styles.page}>
      <Menu />
      <div className={styles.content}>
        <Header/>
        <div className={styles.content__main}>
          <div className={styles.content__center}>
            <Metro />
            <Charts/>
          </div>
          <div className={styles.content__sidebar}>
            <TimeStatistic />
            <Vidget />
          </div>
        </div>
      </div>
    </main>
  );
}
