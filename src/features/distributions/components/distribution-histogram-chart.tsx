"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import * as React from "react";
import { Bar } from "react-chartjs-2";
import type { Histogram } from "@/features/distributions/lib/histogram";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function DistributionHistogramChart({
  histogram,
}: {
  histogram: Histogram;
}) {
  const data = React.useMemo(
    () => ({
      labels: [...histogram.labels],
      datasets: [
        {
          label: "Count",
          data: [...histogram.counts],
          backgroundColor: "hsl(var(--chart-1))",
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    }),
    [histogram.counts, histogram.labels],
  );

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            ticks: { maxTicksLimit: 10 },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
      }}
    />
  );
}
