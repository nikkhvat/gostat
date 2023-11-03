"use client"

import React, { useState } from "react";
import styles from "./index.module.css";
import Button from "../components/Button";

import ChartVisits from "./ChartVisits";

enum ActiveScreen {
  Visits = 1,
  TopCountries = 2,
  TopBrowsersAndOS = 3,
  Bots = 4,
}

interface IChartsButtonsState {
  [key: number]: {
    activeButton: number;
  };
}

interface IStat {
  data?: {
    stats?: any
  };
}

interface ICharts {
  activeScreen: ActiveScreen;
  stats: IStat;
}

const Charts: React.FC<ICharts> = ({ activeScreen, stats }) => {
  const [chartsState, setChartState] = useState<IChartsButtonsState>({
    [ActiveScreen.Visits]: { activeButton: 0 },
    [ActiveScreen.TopCountries]: { activeButton: 1 },
    [ActiveScreen.TopBrowsersAndOS]: { activeButton: 1 },
    [ActiveScreen.Bots]: { activeButton: 1 },
  });

  const setActiveScreen = (screen: ActiveScreen, btnId: number) => {
    setChartState((prev) => ({ ...prev, [screen]: { activeButton: btnId } }));
  };

  const charts = {
    1: {
      name: "Visits",
      buttons: [
        { id: 0, name: "All visits" },
        { id: 1, name: "Unique visits" },
      ],
    },
    2: {
      name: "Top countries",
      buttons: [],
    },
    3: {
      name: "Top browsers & OS",
      buttons: [],
    },
    4: {
      name: "Bots",
      buttons: [],
    },
  };

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
          {activeScreen === 1 && stats.data && chartsState[1].activeButton === 0 && (
              <ChartVisits data={stats.data.stats.visits_by_day} />
            )}
        </div>
      </div>
    </div>
  );
};

export default Charts;