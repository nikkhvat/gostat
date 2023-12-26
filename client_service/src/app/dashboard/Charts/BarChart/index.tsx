import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import "./chart.css";

const BarChart = ({ data }: {data: number[]}) => {

  const maxValue = data.reduce((max, current) => {
    return current > max ? current : max;
  }, data[0]);

  const options = {
    chart: {
      type: "column",
      width: 410,
      height: 184,
      marginLeft: 35,
    },
    title: {
      text: "Stolbchataya Diagramma",
    },
    xAxis: {
      visible: false,
      gridLineColor: "#3C3C3C",
      gridLineWidth: 1,
    },
    yAxis: {
      gridLineColor: "#3C3C3C",
      gridLineWidth: 1,
      min: 0,
      max: maxValue + 1,
      tickInterval: (maxValue + 1) / 5 > 1 ? 1 : (maxValue + 1) / 5,
      labels: {
        style: {
          color: "#3C3C3C", // Number color
          fontWeight: "bold", // Bold font
          fontSize: "12px", // Font size
        },
      },
    },
    legend: {
      enabled: false, // Disabling the legend
    },
    credits: {
      enabled: false, // Disabling credits
    },
    plotOptions: {
      column: {
        color: "#a185e7", // Graphic color
        borderColor: "transparent", // Transparent border color
        borderRadius: 10,
      },
    },
    series: [
      {
        name: "Values",
        data: data,
      },
    ],
    events: {
      mouseOver: function () {
        const tooltip = document.getElementById("custom-tooltip");
        if (tooltip) {
          tooltip.style.display = "block";
          tooltip.innerHTML = "Custom content";
        }
      },
      mouseOut: function () {
        const tooltip = document.getElementById("custom-tooltip");
        if (tooltip) {
          tooltip.style.display = "none";
        }
      },
    },
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChart;