import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import "./chart.css";

const BarChart = (data: any) => {
  const blockStyles = {
    height: "184px",
    width: "354px",
  };
  
  const options = {
    chart: {
      type: "column",
      width: 320,
      height: 184,
      marginLeft: 40,
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
      max: 200,
      tickInterval: 30,
      labels: {
        style: {
          color: "#3C3C3C",  // Number color
          fontWeight: "bold",  // Bold font
          fontSize: "12px",  // Font size
        }}
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
        borderColor: "transparent",  // Transparent border color
        borderRadius: 10
      },
    },
    series: [
      {
        name: "Values",
        data: data.data
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