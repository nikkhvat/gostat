"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./index.module.css";
import Header from "./Header";
import Menu from "./Menu";
import Charts from "./Charts";
import Metro from "./Metro";
import { IUserData } from ".";
import { useAppDispatch, useAppSelector } from "../shared/libs/store/hooks";
import { getStats, getUserData } from "../shared/libs/store/features/dashboard/slice";
import { RootState } from "../shared/libs/store/store";

export default function Dashboard() {
  const router = useRouter();
  
  const dispatch = useAppDispatch();

  const activeApp = useAppSelector((state: RootState) => state.dashboard.activeApp);

  useEffect(() => {
    if (activeApp?.id) {
      changeActiveApp(activeApp.id);
    }
  }, [activeApp]);

  useEffect(() => {
    dispatch(getUserData());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const changeActiveApp = async (app: string) => {
    dispatch(getStats({app}));
  };

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
