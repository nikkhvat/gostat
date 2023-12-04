"use client";

import React, { useState } from "react";

import {useTranslate} from "@/app/shared/libs/i18n";
import { useAppSelector } from "@/app/shared/libs/store/hooks";
import { RootState } from "@/app/shared/libs/store/store";

import styles from "./index.module.css";
import Button from "../components/Button";
import ChartVisits from "./ChartVisits";


enum ActiveScreen {
  Visits = "visits",
  TopCountries = "countries",
  TopBrowsersAndOS = "browsers",
  Bots = "bots",
}

interface IChartsButtonsState {
  [key: string]: {
    activeButton: number;
  };
}
const Charts: React.FC = () => {
  const t = useTranslate();
  
  const activeScreen = useAppSelector((state: RootState) => state.dashboard.screen);

  const [chartsState, setChartState] = useState<IChartsButtonsState>({
    [ActiveScreen.Visits]: { activeButton: 0 },
    [ActiveScreen.TopCountries]: { activeButton: 1 },
    [ActiveScreen.TopBrowsersAndOS]: { activeButton: 1 },
    [ActiveScreen.Bots]: { activeButton: 1 },
  });

  const setActiveScreen = (
    screen: "visits" | "countries" | "browsers" | "bots",
    btnId: number
  ) => {
    setChartState((prev) => ({ ...prev, [screen]: { activeButton: btnId } }));
  };

  const charts = {
    visits: {
      name: t("dashboard.visits.title"),
      buttons: [
        { id: 0, name: t("dashboard.visits.buttons.all") },
        { id: 1, name: t("dashboard.visits.buttons.unique") },
      ],
    },
    countries: {
      name: t("dashboard.topCountries.title"),
      buttons: [],
    },
    browsers: {
      name: t("dashboard.topBrowsers.title"),
      buttons: [],
    },
    bots: {
      name: t("dashboard.bots.title"),
      buttons: [],
    },
  };

  const stats = useAppSelector((state: RootState) => state.dashboard.data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__top}>{charts[activeScreen].name}</div>
        <div className={styles.header__bottom}>
          {charts[activeScreen].buttons.map((button) => (
            <Button
              key={charts[activeScreen].name + button.id}
              active={chartsState[activeScreen].activeButton === button.id}
              className={styles.header__button}
              activeClass={styles.header__button_active}
              inActiveClass={styles.header__button_inactive}
              onClick={() => setActiveScreen(activeScreen, button.id)}
            >
              {button.name}
            </Button>
          ))}
        </div>
        <div className={styles.content}>
          {activeScreen === "visits" &&
            stats &&
            chartsState[ActiveScreen.Visits].activeButton === 0 && (
            <ChartVisits data={stats?.visits_by_day} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;