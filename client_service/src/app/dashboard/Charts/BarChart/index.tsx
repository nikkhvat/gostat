import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import "./chart.css";
import { useAppSelector } from "@/app/shared/libs/store/hooks";
import { RootState } from "@/app/shared/libs/store/store";


const BarChart = ({ data }: {data: number[]}) => {
  const activeTab = useAppSelector((state: RootState) => state.dashboard.screen);

  const colors = {
    visits: "#BAA4F1",
    countries: "#A9DFF2",
    browsers: "#86E06A",
    bots: "#F5C087",
  };

  const maxValue = data.reduce((max, current) => {
    return current > max ? current : max;
  }, data[0]);

  const options = {
    chart: {
      type: "column",
      width: 340,
      height: 184,
      marginLeft: 35,
    },
    xAxis: {
      visible: false,
      gridLineColor: "var(--color4)",
      gridLineWidth: 1,
    },
    yAxis: {
      gridLineColor: "var(--color2)",
      gridLineWidth: 1,
      min: 0,
      max: maxValue + 1,
      tickInterval: (maxValue + 1) / 5 > 1 ? 1 : (maxValue + 1) / 5,
      labels: {
        style: {
          color: "var(--color4)",
          fontWeight: "normal",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      shape: "square",
      backgroundColor: "var(--color1)",
      borderColor: "var(--color4)",
      shadow: false,
      borderRadius: 15,
      borderWidth: 1,
      useHTML: true,
      shared: true,
      padding: 15,
      positioner: function (labelWidth: any, labelHeight: any, point: any) {
        const ctx = this as any;

        const plotLeft = ctx.chart.plotLeft;
        const plotWidth = ctx.chart.plotWidth;
        let tooltipX = point.plotX + plotLeft - labelWidth / 2;

        if (tooltipX < plotLeft) {
          tooltipX = plotLeft;
        }

        if (tooltipX + labelWidth > plotLeft + plotWidth) {
          tooltipX = plotLeft + plotWidth - labelWidth;
        }

        return { x: tooltipX, y: 20 };
      },
      formatter: function () {
        const ctx = this as any;

        function formatHour(hour: number): string {
          if (hour < 0 || hour > 23) {
            throw new Error("Invalid hour. Hour must be between 0 and 23.");
          }

          const suffix = hour < 12 ? "AM" : "PM";
          const formattedHour = hour % 12 || 12;

          return `${formattedHour} ${suffix}`;
        }

        return `
          <div style="pointer-events: none;" class="tooltip-content" >
            <p class="tooltip-title" >${formatHour(ctx.x)}</p>
            <p class="tooltip-subtitle" >${ctx.y}</p>
            <p class="tooltip-visits" >Visits</p>
          </div>`;
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      column: {
        color: colors[activeTab],
        borderColor: "transparent",
        borderRadius: 10,
        pointPadding: 0.1,
        groupPadding: 0.1,
      },
    },
    series: [
      {
        name: "Values",
        data: data,
      },
    ],
  };
  return (
    <div>
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options} />
    </div>
  );
};

export default BarChart;