"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Histogram } from "@/features/distributions/lib/histogram";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function DistributionHistogramChart({
  histogram,
}: {
  histogram: Histogram;
}) {
  const data = React.useMemo(
    () =>
      histogram.labels.map((label, index) => ({
        label,
        count: histogram.counts[index] ?? 0,
      })),
    [histogram.counts, histogram.labels],
  );

  const tickInterval = Math.max(0, Math.ceil(data.length / 10) - 1);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
      <BarChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          interval={tickInterval}
          minTickGap={12}
        />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  );
}
