"use client"
import React, { useEffect, useState } from "react";

import styles from "./index.module.css";

import defaultAvatar from "@/app/assets/header/avatar/default_dark.svg";

import { Notification } from "@/app/shared/icons/components/notification";

import Image from "next/image";

import PopUp from "./Popup";

import { useRouter } from "next/navigation";
import Storage from "@/app/utils/storage";
import Button from "../components/Button";
import { IUserData } from "..";

import i18next from "@/app/shared/libs/i18n";

interface IHeader {
  userInfo: IUserData;
  activeApp: string | null;
  setActiveApp: Function
}

const Header: React.FC<IHeader> = ({ userInfo, activeApp, setActiveApp }) => {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [openedPopUp, setOpenedPopUp] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as Element;

      if (
        openedPopUp &&
        !targetElement.closest("#popup") &&
        targetElement.id !== "avatar_image"
      ) {
        setOpenedPopUp((prev) => !prev);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openedPopUp]);

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const clickAvatar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpenedPopUp((prev) => !prev);
  };

  const clickNotifications = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
  };

  const singOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    router.push("/en/auth/sign-in", { scroll: false });
    Storage.delete("access_token");
    Storage.delete("refresh_token");
  };

  return (
    <div className={styles.header}>
      <div style={{ width: "310px" }}></div>

      <search role="search">
        <form onSubmit={submitSearch}>
          <input
            className={styles.header__search}
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            placeholder={i18next.t("menu.search")}
          />
        </form>
      </search>

      <div className={styles.buttons}>
        <Button
          onClick={clickNotifications}
          className={styles.header__bell_button}
        >
          <Notification />
        </Button>
        <Button onClick={clickAvatar} className={styles.header__avatar_button}>
          <Image
            id="avatar_image"
            className={styles.header__avatar_image}
            width={50}
            height={50}
            src={defaultAvatar}
            alt="user avatar"
          />
        </Button>
        {openedPopUp && (
          <PopUp
            name={userInfo?.first_name}
            apps={userInfo?.apps}
            singOut={singOut}
            activeApp={activeApp}
            setActiveApp={setActiveApp}
          />
        )}
      </div>
    </div>
  );
};

export default Header;