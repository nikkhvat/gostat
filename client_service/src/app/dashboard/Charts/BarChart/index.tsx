import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import "./chart.css";

const BarChart = () => {
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
      // marginRight: 0,
      // marginTop: 30
      // paddingLeft: 0
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
          color: "#3C3C3C",  // Цвет цифр
          fontWeight: "bold",  // Жирный шрифт
          fontSize: "12px",  // Размер шрифта
        }}
    },
    legend: {
      enabled: false, // Отключаем легенду
    },
    credits: {
      enabled: false, // Отключаем кредиты
    },
    plotOptions: {
      column: {
        color: "#a185e7", // Цвет графика
        borderColor: "transparent", // Прозрачный цвет границы
        borderRadius: 10
      },
    },
    series: [
      {
        name: "Values",
        // data: data,
        // data: [83, 94, 117, 19, 170, 174, 15]
        data: [83, 94, 117, 19, 170, 174, 15, 75, 128, 163, 15, 136, 163, 28, 83, 75, 51, 178, 151, 36, 170, 28, 144, 77]
      },
    ],
    events: {
      mouseOver: function () {
        const tooltip = document.getElementById("custom-tooltip");
        if (tooltip) {
          tooltip.style.display = "block";
          tooltip.innerHTML = "Custom content";
          // tooltip.style.display = 'none';
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