import React from "react";

import style from "./index.module.css";


export default function TimeStatistic() {
  return (
    <div className={style.container}>
      <div className={style.top__header}>
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
      <div className={style.timer}></div>
    </div>
  );
}