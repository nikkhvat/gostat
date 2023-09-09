"use client"

import { useEffect, useState } from "react";

import styles from "./index.module.css";

import Menu from "./Menu";
import Metro from "./Metro";
import Charts from "./Charts"

import { getStat } from "./api";
import { Stat } from ".";

export default function Dashboard() {
  
  const [activeScreen, setActiveScreen] = useState(1 as 1 | 2 | 3 | 4);
  const [sectionStat, setSectionStat] = useState({visits: 0, countries: 0, browsers: 0, bots: 0 });
  const [stats, setStat] = useState({} as Stat)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStat("b871fdf8-3de0-4b9c-870a-2e534cd0817c");
        const body = response.data.data;
        
        setSectionStat({
          visits: body.stats.first_visits,
          countries: body.stats.top_countries.length,
          browsers: body.stats.top_browsers.length,
          bots: 0,
        });

        setStat(response.data);
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
