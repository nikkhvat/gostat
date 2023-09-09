"use client";

import styles from "./index.module.css";

import Image from "next/image";

import BackgroundEye from "@/app/assets/dashboard/tabs/backgrounds/eye.svg";
import BackgroundGlobe from "@/app/assets/dashboard/tabs/backgrounds/globe.svg";
import BackgroundBrowser from "@/app/assets/dashboard/tabs/backgrounds/browser.svg";
import BackgroundTerminal from "@/app/assets/dashboard/tabs/backgrounds/terminal.svg";

import IconEye from "@/app/assets/dashboard/tabs/icons/eye.svg";
import IconGlobe from "@/app/assets/dashboard/tabs/icons/globe.svg";
import IconBrowser from "@/app/assets/dashboard/tabs/icons/browser.svg";
import IconTerminal from "@/app/assets/dashboard/tabs/icons/terminal.svg";

interface IMetro {
  activeScreen: number;
  setActiveScreen: Function;
  sectionStat: {[key: string]: number};
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
      color: "#A185E7",
      subtitle_color: "#4D3195",
      background: BackgroundEye,
      icon: IconEye,
    },
    {
      id: 2,
      name: "Top countries",
      subtitle: "Countries",
      key: "countries",
      color: "#86E06A",
      subtitle_color: "#1C4D63",
      background: BackgroundBrowser,
      icon: IconBrowser,
    },
    {
      id: 3,
      name: "Top browsers",
      subtitle: "Browsers",
      key: "browsers",
      color: "#8CCFE8",
      subtitle_color: "#2D611B",
      background: BackgroundGlobe,
      icon: IconGlobe,
    },
    {
      id: 4,
      name: "Bots",
      subtitle: "Visits",
      key: "bots",
      color: "#F5C087",
      subtitle_color: "#644220",
      background: BackgroundTerminal,
      icon: IconTerminal,
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

            <Image
              src={item.icon}
              alt={"icon"}
              className={styles.metro_item__title_icon}
              width={16}
              height={16}
            />
          </p>
          <p className={styles.metro_item__value}>{sectionStat[item.key]}</p>

          <div className={styles.bottom}>
            <p className={styles.bottom_first_text}>{item.subtitle}</p>
            <p
              style={
                item.id === activeScreen
                  ? { color: item.subtitle_color }
                  : { color: "#5A5A5A" }
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