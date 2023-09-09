import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart: React.FC<{
  raw: {
    date: string;
    count?: number;
  }[];
}> = ({ raw }) => {

  const data = raw.map((item) => ({
    date: item.date,
    count: item.count ? item.count : 0
  }));

  const svgRef: any = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)) as any)
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)] as any)
      .range([height, 0]);

    const line: any = d3
      .line()
      .x((d: any) => xScale(new Date(d.date)))
      .y((d: any) => yScale(d.count))
      .curve(d3.curveLinear);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FFF")
      .attr("stroke-width", 1)
      .attr("d", line);
  }, [data]);

  return (
    <svg
      ref={svgRef}
      style={{ width: "100%", height: "100%" }}
    ></svg>
  );
};

export default LineChart;
