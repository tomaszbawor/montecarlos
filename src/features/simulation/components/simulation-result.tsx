import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Slider } from "@/components/ui/slider";

export interface SimulationResultProps {
  simulationData: number[];
}

const chartConfig = {
  count: {
    label: "Frequency",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function SimulationResult({ simulationData }: SimulationResultProps) {
  const [confidence, setConfidence] = useState<number>(95);

  // -------------------------------------------------------------------
  //  Compute percentile + draw a red line
  // -------------------------------------------------------------------
  // 1) The percentile value: time by which X% of simulations have finished
  const percentileValue = useMemo(() => {
    if (!simulationData.length) return 0;
    const sorted = [...simulationData].sort((a, b) => a - b);
    // index for the desired percentile
    const idx = Math.floor((confidence / 100) * sorted.length);
    return sorted[idx] || 0;
  }, [simulationData, confidence]);

  // 2) Create the histogram data from simulation
  const numberOfBins = 20;
  const { labels, counts, minValue, maxValue } = useMemo(
    () => createHistogram(simulationData, numberOfBins),
    [simulationData],
  );

  // 3) Determine which bin the percentile value falls into
  const percentileBinIndex = useMemo(() => {
    if (!simulationData.length) return null;
    const binSize = (maxValue - minValue) / numberOfBins;
    const idx = Math.floor((percentileValue - minValue) / binSize);
    return Math.min(Math.max(idx, 0), numberOfBins - 1);
  }, [percentileValue, minValue, maxValue, simulationData]);

  // -------------------------------------------------------------------
  //  Creating a histogram from simulation data
  // -------------------------------------------------------------------
  const chartData = useMemo(
    () =>
      labels.map((label, index) => ({
        label,
        count: counts[index] ?? 0,
      })),
    [labels, counts],
  );

  const percentileLabel =
    percentileBinIndex !== null ? labels[percentileBinIndex] : null;

  const tickInterval = Math.max(0, Math.ceil(chartData.length / 10) - 1);

  return (
    <div className="mt-8 space-y-6">
      {/* Confidence slider */}
      <div className="max-w-lg space-y-2">
        <p className="font-semibold">Confidence: {confidence}%</p>
        <Slider
          defaultValue={[confidence]}
          min={0}
          max={100}
          step={1}
          onValueChange={(val) => setConfidence(val[0])}
        />
        <p className="text-sm text-gray-500">
          By <strong>{confidence}%</strong> certainty, tasks finish in about{" "}
          <strong>{percentileValue.toFixed(2)}</strong> time units.
        </p>
      </div>

      {/* Histogram chart */}
      <div className="max-w-3xl space-y-2">
        <p className="text-sm font-medium text-center">
          Histogram of Total Task Times
        </p>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ left: 8, right: 12, top: 8 }}>
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
            {percentileLabel && simulationData.length > 0 && (
              <ReferenceLine
                x={percentileLabel}
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                label={{
                  value: `${confidence}% ≈ ${percentileValue.toFixed(1)}`,
                  position: "insideTop",
                  fill: "hsl(var(--destructive))",
                  fontSize: 12,
                }}
              />
            )}
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

function createHistogram(data: number[], numberOfBins: number) {
  if (!data.length) {
    return {
      labels: [],
      counts: [],
      minValue: 0,
      maxValue: 0,
    };
  }

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const binSize = (maxValue - minValue) / numberOfBins;
  const counts = new Array(numberOfBins).fill(0);

  data.forEach((value) => {
    const binIndex = Math.min(
      Math.floor((value - minValue) / binSize),
      numberOfBins - 1,
    );
    counts[binIndex] += 1;
  });

  const labels = counts.map((_, i) => {
    const start = minValue + i * binSize;
    const end = start + binSize;
    return `${start.toFixed(1)} - ${end.toFixed(1)}`;
  });

  return { labels, counts, minValue, maxValue };
}
