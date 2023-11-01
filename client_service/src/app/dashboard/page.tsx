"use client"

import { useEffect, useState } from "react";

import styles from "./index.module.css";

import Menu from "./Menu";
import Metro from "./Metro";
import Charts from "./Charts"

import { getStat, getUserData } from "./api";
import { Stat } from ".";
import { useRouter } from "next/navigation";

export default function Dashboard() {

  const router = useRouter();

  const [activeScreen, setActiveScreen] = useState(1 as 1 | 2 | 3 | 4);
  const [sectionStat, setSectionStat] = useState({visits: 0, countries: 0, browsers: 0, bots: 0 });
  const [stats, setStat] = useState({} as Stat)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData();
        
        if (response.data.account_confirmed === false) {
          console.log(response.data)
          router.push("/auth/alert", { scroll: false });
        }
        
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className={styles.page}>
      <Menu />
      <div className={styles.content}>
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
