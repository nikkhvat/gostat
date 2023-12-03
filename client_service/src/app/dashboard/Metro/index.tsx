"use client";

import React from "react";
import Image from "next/image";
import classNames from "classnames/bind";

import {
  TabIconBrowser,
  TabIconEye,
  TabIconGlobe,
  TabIconTerminal,
} from "@/app/shared/icons/components/tab-icon";
import BackgroundEye from "@/app/assets/dashboard/tabs/backgrounds/eye.svg";
import BackgroundGlobe from "@/app/assets/dashboard/tabs/backgrounds/globe.svg";
import BackgroundBrowser from "@/app/assets/dashboard/tabs/backgrounds/browser.svg";
import BackgroundTerminal from "@/app/assets/dashboard/tabs/backgrounds/terminal.svg";
import {useTranslate} from "@/app/shared/libs/i18n";
import { useAppSelector } from "@/app/shared/libs/store/hooks";
import { RootState } from "@/app/shared/libs/store/store";

import styles from "./index.module.css";

interface IMetro {
  activeScreen: number;
  setActiveScreen: Function;
}

const Metro: React.FC<IMetro> = ({
  activeScreen,
  setActiveScreen,
}) => {
  const cx = classNames.bind(styles);

  const t = useTranslate();

  const stats = useAppSelector((state: RootState) => state.dashboard.data);
  
  const sections = [
    {
      id: 1,
      name: t("dashboard.visits.title"),
      subtitle: t("dashboard.visits.subtitle"),
      key: "visits",
      color: "var(--violet-bg)",
      subtitle_color: "var(--violet-text)",
      background: BackgroundEye,
      icon: TabIconBrowser,
      count: stats.total_visits ?? 0,
    },
    {
      id: 2,
      name: t("dashboard.topCountries.title"),
      subtitle: t("dashboard.topCountries.subtitle"),
      key: "countries",
      color: "var(--green-bg)",
      subtitle_color: "var(--green-text)",
      background: BackgroundBrowser,
      icon: TabIconEye,
      count: stats.top_countries?.length ?? 0,
    },
    {
      id: 3,
      name: t("dashboard.topBrowsers.title"),
      subtitle: t("dashboard.topBrowsers.subtitle"),
      key: "browsers",
      color: "var(--blue-bg)",
      subtitle_color: "var(--blue-text)",
      background: BackgroundGlobe,
      icon: TabIconGlobe,
      count: stats.top_browsers?.length ?? 0,
    },
    {
      id: 4,
      name: t("dashboard.bots.title"),
      subtitle: t("dashboard.bots.subtitle"),
      key: "bots",
      color: "var(--orange-bg)",
      subtitle_color: "var(--orange-text)",
      background: BackgroundTerminal,
      icon: TabIconTerminal,
      count: stats.total_bots ?? 0,
    },
  ];

  return (
    <div className={styles.metro}>
      {sections.map((item) => (
        <div
          key={item.key}
          className={cx({
            metro_item: true,
            metro_item__active: item.id === activeScreen
          })}
          style={
            item.id === activeScreen
              ? {
                background: item.color,
                border: `1px solid ${item.color}`,
              }
              : {}
          }
          onClick={() => setActiveScreen(item.id)}
        >
          {item.id === activeScreen &&
            <Image
              src={item.background}
              alt="icon"
              className={styles.metro_item__icon}
            />}
            
          <p className={styles.metro_item__title}>
            {item.name}
            <item.icon />
          </p>
          
          <p className={styles.metro_item__value}>{item.count}</p>

          <div className={styles.bottom}>
            <p className={styles.bottom_first_text}>{item.subtitle}</p>
            <p
              style={
                item.id === activeScreen
                  ? { color: item.subtitle_color }
                  : { color: "var(--color6)" }
              }
              className={styles.bottom_second_text}>
              {t("dashboard.month")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Metro;