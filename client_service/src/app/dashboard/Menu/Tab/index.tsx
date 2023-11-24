import React, { Dispatch, SVGProps, SetStateAction } from "react";

import styles from "./index.module.css"

export interface ITabItem {
  id: number;
  name: string;
  path: string;
  icon: ({ width, height, ...props }: SVGProps<SVGSVGElement>) => JSX.Element
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
      <div
        className={
          active === tab.id
            ? `${styles.item_icon}`
            : `${styles.item_icon} ${styles.item_icon__active}`
        }
      >
        <tab.icon />
      </div>
    </div>
  );
};

export default Tab;