"use client";

import React from "react";

import styles from "./index.module.css";
import Header from "./Header";
import Menu from "./Menu";
import Charts from "./Charts";
import Metro from "./Metro";

export default function Dashboard() {


  return (
    <main className={styles.page}>
      <Menu />
      <div className={styles.content}>
        <Header/>
        <Metro />
        <Charts/>
      </div>
    </main>
  );
}
