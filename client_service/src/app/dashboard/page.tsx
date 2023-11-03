"use client"

import { useEffect, useState } from "react";

import styles from "./index.module.css";

import Menu from "./Menu";
import Metro from "./Metro";
import Charts from "./Charts"

import { getStat, getUserData } from "./api";
import { IUserData, Stat } from ".";
import Header from "./Header";
import { useRouter } from "next/navigation";

export default function Dashboard() {

  const router = useRouter();

  const [activeScreen, setActiveScreen] = useState(1 as 1 | 2 | 3 | 4);
  const [sectionStat, setSectionStat] = useState({visits: 0, countries: 0, browsers: 0, bots: 0 });
  const [stats, setStat] = useState({} as Stat)

  const [userInfo, setUserInfo] = useState({} as IUserData);
  const [activeApp, setActiveApp] = useState(null as null | string);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData();

        setUserInfo(response.data);

        if (response.data.apps) {
          changeActiveApp(response.data.apps[0].id)
        }

        if (response.data.account_confirmed === false) {
          console.log(response.data);
          router.push("/auth/alert", { scroll: false });
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchData();
  }, []);

  const changeActiveApp = async (app: string) => {
    setActiveApp(app)

    const response = await getStat(app)
    console.log(response.data);    
  }

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
          sectionStat={sectionStat}
        />

        <Charts activeScreen={activeScreen} stats={stats} />
      </div>
    </main>
  );
}
