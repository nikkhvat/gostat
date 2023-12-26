"use client";

import React, { useState } from "react";

import { useAppSelector } from "@/app/shared/libs/store/hooks";
import { RootState } from "@/app/shared/libs/store/store";
import { ClockSvg } from "@/app/shared/icons/components/ClockSvg";
import { CalendarSvg } from "@/app/shared/icons/components/CalendarSvg";
import i18n, { useTranslate } from "@/app/shared/libs/i18n";

import style from "./index.module.css";
import Button from "../components/Button";
import BarChart from "../Charts/BarChart";

export default function TimeStatistic() {
  const t = useTranslate();
  const avgDuration = useAppSelector((state: RootState) => state.dashboard.data.avg_duration);
  const [active, setActive] = useState("All");
  
  const rawData: any = useAppSelector((state: RootState) => state.dashboard.data.visits_by_hour);
  const chartData: number[] = rawData ? rawData.map((item: { count: any; }) => item.count ? item.count : 0) : [];

  const setActiveButton = (id: string) => {
    setActive(id);
  };

  const [open, setOpen] = useState(true);

  const formatTime = (milliSeconds: number) => {
    let hours: string | number = Math.floor(milliSeconds / 3600);
    let minutes: string | number = Math.floor((milliSeconds % 3600) / 60);
    let seconds: string | number = milliSeconds % 60;

    hours = hours < 10 ? "0"+hours : hours;
    minutes = minutes < 10 ? "0"+minutes : minutes;
    seconds = seconds < 10 ? "0"+seconds : seconds;
 
    return (hours + ":" + minutes + ":" + seconds);
  };

  const buttonsData = [
    {id: "All", text: t("visitStats.all")},
    {id: "Web", text: t("visitStats.web")},
    {id: "Mobile", text: t("visitStats.mobile")}
  ];

  console.log(chartData);

  return (
    <div className={style.container}>
      <div className={style.timer__block}>
        <div className={style.timer__header}>
          <p>{t("visitStats.durationOfVisit")}</p>
          <ClockSvg />
        </div>
        <div className={style.timer}>
          <p className={style.timer__text}>{avgDuration ? formatTime(avgDuration) : "00:00:00"}</p>
          <p className={style.timer__info}>{t("visitStats.averageTime")}</p>
        </div>
      </div>
      <div className={style.visit__block}>
        <div className={style.visit__header}>
          <p>{t("visitStats.visitTime")}</p>
          <CalendarSvg />
        </div>
        <div className={style.visitButtons}>
          <div className={style.buttons}>
            {
              buttonsData.map((button) => (
                <Button
                  key={button.id}
                  className={style.header__button}
                  active={button.id === active}
                  activeClass={style.header__button_active}
                  inActiveClass={style.header__button_inactive}
                  onClick={() => setActiveButton(button.id)}
                >
                  {button.text}
                </Button>
              ))
            }
          </div>
          <p>{t("visitStats.month")}</p>
        </div>
        <div className={style.visitCharts}>
          {open && <BarChart data={chartData} />}
        </div>
      </div>
    </div>
  );
};