"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


import defaultAvatar from "@/app/assets/header/avatar/default_dark.svg";
import { Notification } from "@/app/shared/icons/components/notification";
import Storage from "@/app/shared/libs/storage";
import { useTranslate } from "@/app/shared/libs/i18n";
import { useAppDispatch, useAppSelector } from "@/app/shared/libs/store/hooks";
import { RootState } from "@/app/shared/libs/store/store";
import { setActiveApp } from "@/app/shared/libs/store/features/dashboard/slice";

import { IUserData } from "..";
import Button from "../components/Button";
import PopUp from "./Popup";
import styles from "./index.module.css";


const Header: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [openedPopUp, setOpenedPopUp] = useState(false);

  const userData = useAppSelector((state: RootState) => state.dashboard.user);

  const activeApp = useAppSelector((state: RootState) => state.dashboard.activeApp);

  const dispatch = useAppDispatch();

  const t = useTranslate();

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

    router.push("/auth/sign-in", { scroll: false });
    Storage.delete("access_token");
  };

  return (
    <div className={styles.header}>
      <div style={{ width: "15%" }}></div>

      <search role="search">
        <form onSubmit={submitSearch}>
          <input
            className={styles.header__search}
            onChange={(e) => setSearch(e.target.value)}
            name="search"
            placeholder={t("menu.search")}
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
            name={userData?.first_name}
            apps={userData?.apps}
            singOut={singOut}
            activeApp={activeApp?.id}
            setActiveApp={(app: any) => {dispatch(setActiveApp(app));}}
          />
        )}
      </div>
    </div>
  );
};

export default Header;