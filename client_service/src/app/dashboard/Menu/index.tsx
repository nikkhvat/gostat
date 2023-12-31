"use client";

import React from "react";
import { useState } from "react";

import { Logo } from "@/app/shared/icons/components/logo";
import { IconDashboard } from "@/app/shared/icons/components/icon-dashboard";

import styles from "./index.module.css";
import Tab, { ITabItem } from "./Tab";

export default function Menu() {

  const tabs: ITabItem[] = [
    {
      id: 0,
      name: "Dashboard",
      path: "/dashboard",
      icon: IconDashboard,
    },
  ];

  const [activeTab, setTab] = useState(tabs[0].id);

  return (
    <div className={styles.menu}>
      <div className={styles.logo}>
        <Logo />
      </div>

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
