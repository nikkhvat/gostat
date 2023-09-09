"use client"

import React, { useState } from "react";

import styles from "./index.module.css"

// Import Charts 

import { Stat } from '../index';

import ChartAllVisits from "./ChartVisits"

interface ICharts {
  activeScreen: 1 | 2 | 3 | 4;
  stats: Stat;
}

const Charts: React.FC<ICharts> = ({ activeScreen, stats }) => {
  const setActiveScreen = (screen: 1 | 2 | 3 | 4, btnId: number) => {
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

  const [chartsState, setChartState] = useState({
    1: { activeButton: 0 },
    2: { activeButton: 1 },
    3: { activeButton: 1 },
    4: { activeButton: 1 },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__top}>{charts[activeScreen].name}</div>
        <div className={styles.header__bottom}>
          {charts[activeScreen].buttons.map((button) => (
            <button
              className={`${styles.header__button} ${
                chartsState[activeScreen].activeButton === button.id
                  ? styles.header__button_active
                  : ""
              }`}
              onClick={() => setActiveScreen(activeScreen, button.id)}
              key={button.id}
            >
              {button.name}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeScreen === 1 && stats.data && chartsState[1].activeButton === 0 && (
            <ChartAllVisits data={stats.data.stats.visits_by_day} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;