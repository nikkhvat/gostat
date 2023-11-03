"use client"

import styles from "./index.module.css";

import Image from "next/image";

import Logo from "@/app/assets/main/logo.svg"

import IconDashboard from "@/app/assets/menu/dashboard.svg";
import IconDashboardActive from "@/app/assets/menu/dashboard_active.svg";
import { useState } from "react";

import Tab, { ITabItem } from "./Tab";

export default function Menu() {
  const tabs: ITabItem[] = [
    {
      id: 0,
      name: "Dashboard",
      path: "/dashboard",
      icon: IconDashboard,
      icon_active: IconDashboardActive,
    },
  ];

  const [activeTab, setTab] = useState(tabs[0].id)

  return (
    <div className={styles.menu}>
      <Image
        className={styles.logo}
        src={Logo}
        alt={"logo"}
        width={50}
        height={50}
      />

      <div className={styles.list}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            active={activeTab}
            onClick={setTab}
          />
        ))}
      </div>
    </div>
  );
}
