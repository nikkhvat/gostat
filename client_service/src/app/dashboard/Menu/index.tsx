"use client"

import styles from "./index.module.css";

import Image from "next/image";

import Logo from "@/app/assets/main/logo.svg"

import IconDashboard from "@/app/assets/menu/dashboard.svg";
import IconDashboardActive from "@/app/assets/menu/dashboard_active.svg";
import { useState } from "react";

interface Tab {
  id: number
  name: string
  path: string
  icon: string
  icon_active: string
}

export default function Menu() {

  const tabs: Tab[] = [
    {
      id: 0,
      name: "Dashboard",
      path: "/dashboard",
      icon: IconDashboard,
      icon_active: IconDashboardActive,
    }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const clickTab = (tab: Tab) => {
    setActiveTab(tab.id)
  }

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
          <div 
            key={tab.id} 
            className={styles.list__item} 
            onClick={() => clickTab(tab)}
          >
            <Image
              className={styles.item_icon}
              src={activeTab === tab.id ? tab.icon_active : tab.icon}
              alt={"logo"}
              width={50}
              height={50}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
