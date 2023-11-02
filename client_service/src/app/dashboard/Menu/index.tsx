"use client"

import styles from "./index.module.css";

import Image from "next/image";

import Logo from "@/app/assets/main/logo.svg"

import IconDashboard from "@/app/assets/menu/dashboard.svg";
import IconDashboardActive from "@/app/assets/menu/dashboard_active.svg";
import { useState } from "react";

import { useRouter } from "next/navigation";
import Storage from "@/app/utils/storage";

interface Tab {
  id: number
  name: string
  path: string
  icon: string
  icon_active: string
}

export default function Menu() {
  const router = useRouter();

  const tabs: Tab[] = [
    {
      id: 0,
      name: "Dashboard",
      path: "/dashboard",
      icon: IconDashboard,
      icon_active: IconDashboardActive,
    },
    {
      id: 1,
      name: "Exit",
      path: "/auth",
      icon: null,
      icon_active: null,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const clickTab = (tab: Tab) => {
    if (tab.name === "Exit") {
      router.push("/auth/sign-in", { scroll: false });
      Storage.delete("access_token")
      Storage.delete("refresh_token")
    } else {
      setActiveTab(tab.id)
    }
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
            {tab.icon_active !== null && tab.icon !== null ? (
              <Image
                className={styles.item_icon}
                src={activeTab === tab.id ? tab.icon_active : tab.icon}
                alt={"logo"}
                width={50}
                height={50}
              />
            ): <span className={styles.icon_text} >{tab.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
