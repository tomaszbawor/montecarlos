export type Histogram = {
  labels: readonly string[];
  counts: readonly number[];
  range: { min: number; max: number };
};

export type SampleStats = {
  mean: number;
  min: number;
  max: number;
  p50: number;
  p90: number;
  p95: number;
};

export function buildHistogram(options: {
  samples: readonly number[];
  range: { min: number; max: number };
  bins: number;
}): { histogram: Histogram; stats: SampleStats } {
  const rangeMin = Math.min(options.range.min, options.range.max);
  const rangeMax = Math.max(options.range.min, options.range.max);
  const bins = Math.max(1, Math.floor(options.bins));

  const width = rangeMax === rangeMin ? 0 : (rangeMax - rangeMin) / bins;
  const counts = Array.from({ length: bins }, () => 0);

  for (const sample of options.samples) {
    const idx =
      width === 0
        ? 0
        : clampInt(Math.floor((sample - rangeMin) / width), 0, bins - 1);
    counts[idx] += 1;
  }

  const labels = Array.from({ length: bins }, (_, i) => {
    if (width === 0) return rangeMin.toFixed(2);
    const center = rangeMin + (i + 0.5) * width;
    return center.toFixed(2);
  });

  const stats = computeStats(options.samples);

  return {
    histogram: { labels, counts, range: { min: rangeMin, max: rangeMax } },
    stats,
  };
}

function computeStats(samples: readonly number[]): SampleStats {
  if (samples.length === 0) {
    return { mean: NaN, min: NaN, max: NaN, p50: NaN, p90: NaN, p95: NaN };
  }

  let sum = 0;
  let min = samples[0];
  let max = samples[0];
  for (const x of samples) {
    sum += x;
    if (x < min) min = x;
    if (x > max) max = x;
  }

  const sorted = [...samples].sort((a, b) => a - b);
  return {
    mean: sum / samples.length,
    min,
    max,
    p50: percentileSorted(sorted, 0.5),
    p90: percentileSorted(sorted, 0.9),
    p95: percentileSorted(sorted, 0.95),
  };
}

function percentileSorted(sorted: readonly number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const w = idx - lo;
  return sorted[lo] * (1 - w) + sorted[hi] * w;
}

function clampInt(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
