import React, { Dispatch, SetStateAction } from "react";

import Image from "next/image";

import styles from "./index.module.css"

export interface ITabItem {
  id: number
  name: string
  path: string
  icon: string
  icon_active: string
}

interface ITab {
  tab: ITabItem;
  active: number;
  onClick: Dispatch<SetStateAction<number>>;
}

const Tab: React.FC<ITab> = ({ tab, onClick, active }) => {
  return (
    <div
      key={tab.id}
      className={styles.list__item}
      onClick={() => onClick(tab.id)}
    >
      <Image
        className={styles.item_icon}
        src={active === tab.id ? tab.icon_active : tab.icon}
        alt={"logo"}
        width={50}
        height={50}
      />
    </div>
  );
};

export default Tab;