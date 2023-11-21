"use client";

import styles from "./index.module.css";

import Image from "next/image";

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

interface IMetro {
  activeScreen: number;
  setActiveScreen: Function;
  sectionStat: { [key: string]: number };
}

const Metro: React.FC<IMetro> = ({
  activeScreen,
  setActiveScreen,
  sectionStat,
}) => {
  const sections = [
    {
      id: 1,
      name: "Visits",
      subtitle: "Visits",
      key: "visits",
      color: "var(--violet-bg)",
      subtitle_color: "var(--violet-text)",
      background: BackgroundEye,
      icon: TabIconBrowser,
    },
    {
      id: 2,
      name: "Top countries",
      subtitle: "Countries",
      key: "countries",
      color: "var(--green-bg)",
      subtitle_color: "var(--green-text)",
      background: BackgroundBrowser,
      icon: TabIconEye,
    },
    {
      id: 3,
      name: "Top browsers",
      subtitle: "Browsers",
      key: "browsers",
      color: "var(--blue-bg)",
      subtitle_color: "var(--blue-text)",
      background: BackgroundGlobe,
      icon: TabIconGlobe,
    },
    {
      id: 4,
      name: "Bots",
      subtitle: "Visits",
      key: "bots",
      color: "var(--orange-bg)",
      subtitle_color: "var(--orange-text)",
      background: BackgroundTerminal,
      icon: TabIconTerminal,
    },
  ];

  return (
    <div className={styles.metro}>
      {sections.map((item) => (
        <div
          key={item.key}
          className={`${styles.metro_item} ${
            item.id === activeScreen ? styles.metro_item__active : ""
          }`}
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
          {item.id === activeScreen ? (
            <Image
              src={item.background}
              alt={"icon"}
              className={styles.metro_item__icon}
            />
          ) : (
            <></>
          )}
          <p className={styles.metro_item__title}>
            {item.name}

            <item.icon/>
          </p>
          <p className={styles.metro_item__value}>{sectionStat[item.key]}</p>

          <div className={styles.bottom}>
            <p className={styles.bottom_first_text}>{item.subtitle}</p>
            <p
              style={
                item.id === activeScreen
                  ? { color: item.subtitle_color }
                  : { color: "var(--color6)" }
              }
              className={styles.bottom_second_text}
            >
              Month
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Metro;