"use client";

import React, { useState } from "react";

import style from "./index.module.css";
import Button from "../components/Button";

import { useAppSelector } from "@/app/shared/libs/store/hooks";
import { RootState } from "@/app/shared/libs/store/store";

export default function TimeStatistic() {
  const activeScreen = useAppSelector((state: RootState) => state.dashboard.data.avg_duration);
  const [active, setActive] = useState("All");

  const setActiveButton = (id: string) => {
    setActive(id);
  };

  const formatTime = (milliSeconds: number) => {
    // const totalSeconds = Math.floor(milliSeconds / 1000);

    // let hours = Math.floor(totalSeconds / 3600);
    // let minutes = Math.floor((totalSeconds % 3600) / 60);
    // let seconds = totalSeconds % 60;

    let hours = Math.floor(milliSeconds / 3600);
    let minutes = Math.floor((milliSeconds % 3600) / 60);
    let seconds = milliSeconds % 60;

    hours = hours < 10 ? "0"+hours : hours;
    minutes = minutes < 10 ? "0"+minutes : minutes;
    seconds = seconds < 10 ? "0"+seconds : seconds;
 
    return (hours+":"+minutes+":"+seconds);
  };

  const buttonsData = [
    {id: "All"},
    {id: "Web"},
    {id: "Mobile"}
  ];

  return (
    <div className={style.container}>
      <div className={style.timer__block}>
        <div className={style.timer__header}>
          <p>Duration of visit</p>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_192_2210)">
              <path d="M7.99998 14.6667C11.6819 14.6667 14.6666 11.6819 14.6666 8.00004C14.6666 4.31814 11.6819 1.33337 7.99998 1.33337C4.31808 1.33337 1.33331 4.31814 1.33331 8.00004C1.33331 11.6819 4.31808 14.6667 7.99998 14.6667Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 4V8L10.6667 9.33333" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_192_2210">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className={style.timer}>
          <p className={style.timer__text}>{activeScreen ? formatTime(activeScreen) : "00:00:00"}</p>
          {/* <p className={style.timer__text} onClick={() => {formatTime(76758);}}>00:02:23</p> */}
          <p className={style.timer__info}>Average time</p>
        </div>
      </div>
      <div className={style.visit__block}>
        <div className={style.visit__header}>
          <p>Visit time</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.6667 2.66663H3.33333C2.59695 2.66663 2 3.26358 2 3.99996V13.3333C2 14.0697 2.59695 14.6666 3.33333 14.6666H12.6667C13.403 14.6666 14 14.0697 14 13.3333V3.99996C14 3.26358 13.403 2.66663 12.6667 2.66663Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.6667 1.33337V4.00004" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.33331 1.33337V4.00004" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 6.66663H14" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div className={style.visitButtons}>
          <div className={style.buttons}>
            {
              buttonsData.map((button, i) => (
                <Button
                  key={button.id + {i}}
                  className={style.header__button}
                  active={button.id === active}
                  activeClass={style.header__button_active}
                  inActiveClass={style.header__button_inactive}
                  onClick={() => setActiveButton(button.id)}
                >
                  {button.id}
                </Button>
              ))
            }
          </div>
          <p>Month</p>
        </div>
      </div>
    </div>
  );
}