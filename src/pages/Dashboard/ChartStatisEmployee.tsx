"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { LabelLayout } from "echarts/features";
import type { EChartsOption } from "echarts";
import type { EChartsType } from "echarts/core";

echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);

type PieDatum = { value: number; name: string };

type Props = {
  data?: PieDatum[];
  total?: number;
  title?: string;
  height?: number | string;
  className?: string;
};

const DEFAULT_DATA: PieDatum[] = [
  { value: 12, name: "พนักงาน WFH" },
  { value: 6, name: "พนักงานลา" },
  { value: 12, name: "พนักงานทำงาน Onsite" },
];

const ChartStatisEmployee: React.FC<Props> = ({
  data = DEFAULT_DATA,
  total,
  title,
  height,
  className = "",
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<EChartsType | null>(null);

  const totalEmployees = typeof total === "number" ? total : data.reduce((s, d) => s + d.value, 0);
  const chartTitle = title ?? `สรุปพนักงานทั้งหมด : ${totalEmployees} คน`;

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    const myChart = chartInstance.current;

    const option: EChartsOption = {
      title: { text: chartTitle, left: "center" },
      tooltip: { trigger: "item" },
      legend: { orient: "horizontal", bottom: 0 },
      series: [
        {
          name: "BMU USERS",
          type: "pie",
          radius: "60%",
          data,
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" } },
          label: { formatter: "{b}: {d}%" },
        },
      ],
    };

    myChart.setOption(option);

    const ro = new ResizeObserver(() => myChart.resize());
    ro.observe(chartRef.current);

    return () => {
      ro.disconnect();
      myChart.dispose();
      chartInstance.current = null;
    };
  }, [chartTitle, data]);

  return (
    <div
      ref={chartRef}
      className={`w-full ${height ? "" : "h-96"} ${className}`}
      style={height ? { height } : undefined}
    />
  );
};

export default ChartStatisEmployee;
