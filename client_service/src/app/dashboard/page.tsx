"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./index.module.css";
import Header from "./Header";
import Menu from "./Menu";
import Charts from "./Charts";
import Metro from "./Metro";
import { getUserData } from "./api";
import { IUserData } from ".";
import { useAppDispatch } from "../shared/libs/store/hooks";
import { getStats } from "../shared/libs/store/features/dashboard/slice";

export default function Dashboard() {
  const router = useRouter();
  
  const dispatch = useAppDispatch();

  const [activeScreen, setActiveScreen] = useState(1 as 1 | 2 | 3 | 4);
  
  const [userInfo, setUserInfo] = useState({} as IUserData);
  const [activeApp, setActiveApp] = useState(null as null | string);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUserData();

        setUserInfo(response.data);

        if (response.data.apps) {
          changeActiveApp(response.data.apps[0].id);
        }

        if (response.data.account_confirmed === false) {
          router.push("/auth/alert", { scroll: false });
        }
      } catch (error) {}
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const changeActiveApp = async (app: string) => {
    setActiveApp(app);
    dispatch(getStats({app}));
  };

  return (
    <main className={styles.page}>
      <Menu />
      <div className={styles.content}>
        <Header
          userInfo={userInfo}
          activeApp={activeApp}
          setActiveApp={changeActiveApp}
        />
        <Metro
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
        />

        <Charts activeScreen={activeScreen} />
      </div>
    </main>
  );
}
