"use client"
import React, { useState } from "react";

import styles from "./index.module.css";

import defaultAvatar from "@/app/assets/header/avatar/default_dark.svg";

import bellDark from "@/app/assets/header/bell_dark.svg";

import Image from "next/image";

const Header = () => {
  const [search, setSearch] = useState("")

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(`search: ${search}`);
  };

  const clickAvatar = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(e);
  };

  const clickNotifications = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(e);
  }

  return (
    <div className={styles.header}>
      <div></div>

      <search role="search">
        <form onSubmit={submitSearch}>
          <input
            className={styles.header__search}
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            placeholder="Search"
          />
        </form>
      </search>

      <div className={styles.buttons}>
        <button
          onClick={clickNotifications}
          className={styles.header__bell_button}
        >
          <Image
            className={styles.header__bell_image}
            width={20}
            height={20}
            src={bellDark}
            alt="user avatar"
          />
        </button>
        <button onClick={clickAvatar} className={styles.header__avatar_button}>
          <Image
            className={styles.header__avatar_image}
            width={50}
            height={50}
            src={defaultAvatar}
            alt="user avatar"
          />
        </button>
      </div>
    </div>
  );
}

export default Header;