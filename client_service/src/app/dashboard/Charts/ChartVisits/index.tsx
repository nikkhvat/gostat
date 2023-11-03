import React from "react";

import styles from "./index.module.css";

import LineChart from "../LineChart";

interface IChartVisits {
  data: {
    date: string,
    count?: number
  }[]
}

const ChartVisits: React.FC<IChartVisits> = ({ data }) => {

  return (
    <div className={styles.container}>
      {data && <LineChart raw={data} />}
    </div>
  );
};

export default ChartVisits;