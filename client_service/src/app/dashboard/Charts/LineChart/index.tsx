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

    const numLines = 10;
    const step = height / (numLines - 1);

    const marginTop = 10;
    const marginBottom = 40;

    const marginLeft = 30;
    const marginRight = 20;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)) as any)
      .range([marginLeft, width - marginRight]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)] as any)
      .range([height - marginBottom, marginTop]);

    const line: any = d3
      .line()
      .x((d: any) => xScale(new Date(d.date)))
      .y((d: any) => yScale(d.count))
      .curve(d3.curveLinear);

    const yValues = Array.from({ length: numLines }, (_, i) =>
      Math.floor(i * step + marginTop)
    );

    yValues.forEach((y, i) => {
      svg
        .append("line")
        .attr("x1", 20)
        .attr("y1", y + 2)
        .attr("x2", width)
        .attr("y2", y + 2)
        .attr("stroke", "#1E1E1E")
        .attr("stroke-width", 1);

      const textValue = Math.round(yScale.invert(y));

      svg
        .append("text")
        .attr("x", 0)
        .attr("y", y + 2)
        .attr("dx", 10)
        .attr("dy", 4)
        .attr("font-size", "12px")
        .attr("text-anchor", "end")
        .attr("fill", "#3C3C3C")
        .text(textValue);
    });

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FFF")
      .attr("stroke-width", 1)
      .attr("d", line);

    const selectedDates = data.filter((_, i) => i % 3 === 0);

    selectedDates.forEach((d) => {
      svg
        .append("text")
        .attr("x", xScale(new Date(d.date)))
        .attr("y", height - 10)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("fill", "#3C3C3C")
        .text(d3.timeFormat("%m-%d")(new Date(d.date)));
    });

  }, [data]);

  return (
    <svg
      ref={svgRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default LineChart;
