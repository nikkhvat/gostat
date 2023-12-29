"use client";

import React, {useState} from "react";
import style from "@/app/dashboard/vidget/index.module.css";
import { TargetSvg } from "@/app/shared/icons/components/TargetSvg";

export default function Widget() {
  let [data, setData] = useState([
    {id: 0, title: "Yandex", link: "https://yandex.com/", visits: 10, procent: "5.0%"},
    {id: 1, title: "Google", link: "https://www.google.com/", visits: 8, procent: "4.0%"},
    {id: 2, title: "Facebook", link: "https://www.facebook.com/", visits: 3, procent: "2.0%"},
  ]);

  return (
    <div className={style.vidget__container}>
      <div className={style.vidget__header}>
        <div className={style.vidget__header__top}>
          <p className={style.vidget__title}>Sourses</p>
          <TargetSvg />
        </div>
        <div className={style.vidget__header__bottom}>
          <div className={style.vidget__button}>
            <p>More detailed</p>
          </div>
          <p className={style.vidget__month}>Month</p>
        </div>
      </div>
      <div className={style.vidget__dataBlock}>
        {data.map((e) => {
          return (
            <div key={e.id} className={style.vidget__data}>
              <div className={style.vidget__data__left}>
                <p className={style.vidget__title}>{e.title}</p>
                <p className={style.vidget__link}>{e.link}</p>
              </div>
              <div className={style.vidget__data__right}>
                <p className={style.vidget__visits}>{e.visits}</p>
                <p className={style.vidget__procent}>{e.procent}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};