import { Effect } from "effect";
import { buildHistogram } from "@/features/distributions/lib/histogram";
import type { DistributionParameters } from "@/lib/distribution/Distribution";

export type SimulationResult = {
  histogram: ReturnType<typeof buildHistogram>["histogram"];
  stats: ReturnType<typeof buildHistogram>["stats"];
  sampleCount: number;
  bins: number;
};

export function simulateDistribution<
  P extends DistributionParameters,
>(options: {
  sample: (params: P) => number;
  params: P;
  sampleCount: number;
  bins: number;
  range: { min: number; max: number };
}): Effect.Effect<SimulationResult> {
  return Effect.sync(() => {
    const sampleCount = Math.max(1, Math.floor(options.sampleCount));
    const samples: number[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const s = options.sample(options.params);
      if (Number.isFinite(s)) samples.push(s);
    }

    const { histogram, stats } = buildHistogram({
      samples,
      range: options.range,
      bins: Math.max(1, Math.floor(options.bins)),
    });

    return {
      histogram,
      stats,
      sampleCount,
      bins: Math.max(1, Math.floor(options.bins)),
    };
  });
}
