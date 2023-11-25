import React from "react";

import style from "./page.module.css";
import Link from "next/link";

import i18n from "@/app/shared/libs/i18n/index";

import ThemeButton from "./ThemeButton";

import { cookies } from "next/headers";
import { CookiesKeys } from "@/app/shared/services/cookie/types";

const Theme = () => {
  const cookieStore = cookies();
  const theme = cookieStore.get(CookiesKeys.THEME);

  return (
    <div className={style.box}>
      <div className={style.texts}>
        <p className={style.title}>{i18n.t("theme.title")}</p>
        <p className={style.description}>{i18n.t("theme.subtitle")}</p>
      </div>

      <div className={style.main__block}>
        {[
          { title: i18n.t("theme.light"), key: "light" },
          { title: i18n.t("theme.dark"), key: "dark" },
          { title: i18n.t("theme.system"), key: "system" },
        ].map((t: any) => (
          <ThemeButton
            key={t.key}
            t={t}
            theme={theme?.value ? theme?.value : "system"}
          />
        ))}
      </div>

      <div className={style.box__bottom}>
        <div className={style.bottom__bottoms}>
          <Link className={style.back__button} href="/dashboard">
            {i18n.t("theme.back")}
          </Link>
          <Link className={style.continue__button} href="/dashboard">
            {i18n.t("theme.continue")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Theme;
