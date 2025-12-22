"use client";

import { Effect } from "effect";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DistributionHistogramChart } from "@/features/distributions/components/distribution-histogram-chart";
import { DistributionParameterControls } from "@/features/distributions/components/distribution-parameter-controls";
import {
  type SimulationResult,
  simulateDistribution,
} from "@/features/distributions/lib/simulate-distribution";
import { getDistributionDefinition } from "@/lib/distribution/registry";

const DEFAULT_SAMPLE_COUNT = 5000;
const DEFAULT_BINS = 40;

export function DistributionShowcase({
  distributionId,
}: {
  distributionId: string;
}) {
  const def = React.useMemo(
    () => getDistributionDefinition(distributionId),
    [distributionId],
  );

  const [values, setValues] = React.useState<
    Record<string, number | undefined>
  >(() => (def ? { ...def.defaultParams } : {}));
  const [sampleCount, setSampleCount] = React.useState(DEFAULT_SAMPLE_COUNT);
  const [bins, setBins] = React.useState(DEFAULT_BINS);

  React.useEffect(() => {
    if (!def) return;
    setValues({ ...def.defaultParams });
  }, [def]);

  const debouncedValues = useDebounced(values, 250);
  const debouncedSampleCount = useDebounced(sampleCount, 150);
  const debouncedBins = useDebounced(bins, 150);

  const [running, setRunning] = React.useState(false);
  const [result, setResult] = React.useState<SimulationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const runId = React.useRef(0);

  React.useEffect(() => {
    if (!def) return;

    const currentRun = ++runId.current;
    setRunning(true);
    setError(null);

    const run = () => {
      if (def.id === "uniform") {
        const params = normalizeUniformParams(
          debouncedValues,
          def.defaultParams,
        );
        const range = def.domain(params);
        return Effect.runPromise(
          simulateDistribution({
            sample: def.sample,
            params,
            sampleCount: debouncedSampleCount,
            bins: debouncedBins,
            range,
          }),
        );
      }

      if (def.id === "beta-pert") {
        const params = normalizeBetaPertParams(
          debouncedValues,
          def.defaultParams,
        );
        const range = def.domain(params);
        return Effect.runPromise(
          simulateDistribution({
            sample: def.sample,
            params,
            sampleCount: debouncedSampleCount,
            bins: debouncedBins,
            range,
          }),
        );
      }

      return Promise.resolve(null);
    };

    run()
      .then((next) => {
        if (currentRun !== runId.current) return;
        if (next) setResult(next);
      })
      .catch((e) => {
        if (currentRun !== runId.current) return;
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (currentRun !== runId.current) return;
        setRunning(false);
      });
  }, [debouncedBins, debouncedSampleCount, debouncedValues, def]);

  if (!def) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
          <CardDescription>
            Adjust inputs and see the histogram update.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <DistributionParameterControls
            controls={def.controls}
            values={values}
            onChange={(key, value) =>
              setValues((prev) => ({ ...prev, [key]: value }))
            }
          />

          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="sampleCount">Samples</Label>
                <div className="text-xs tabular-nums text-muted-foreground">
                  {sampleCount.toLocaleString()}
                </div>
              </div>
              <Slider
                id="sampleCount"
                value={[sampleCount]}
                min={500}
                max={30000}
                step={500}
                onValueChange={(v) => setSampleCount(v[0] ?? sampleCount)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bins">Bins</Label>
              <Input
                id="bins"
                type="number"
                min={5}
                max={200}
                step={1}
                value={Number.isFinite(bins) ? String(bins) : ""}
                onChange={(e) => {
                  const next = Number.parseInt(e.target.value, 10);
                  setBins(Number.isFinite(next) ? next : bins);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Histogram</CardTitle>
            <CardDescription>
              {running ? "Simulating…" : " "}
              {error ? `Error: ${error}` : null}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[360px]">
              {result ? (
                <DistributionHistogramChart histogram={result.histogram} />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>
                Based on {result.sampleCount.toLocaleString()} samples.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <StatRow label="Mean" value={format(result.stats.mean)} />
                  <StatRow
                    label="Median (P50)"
                    value={format(result.stats.p50)}
                  />
                  <StatRow label="P90" value={format(result.stats.p90)} />
                  <StatRow label="P95" value={format(result.stats.p95)} />
                  <StatRow label="Min" value={format(result.stats.min)} />
                  <StatRow label="Max" value={format(result.stats.max)} />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <TableRow>
      <TableCell className="w-48 font-medium">{label}</TableCell>
      <TableCell className="tabular-nums">{value}</TableCell>
    </TableRow>
  );
}

function format(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(3);
}

function normalizeUniformParams(
  values: Record<string, number | undefined>,
  defaults: { min: number; max: number },
) {
  const min = getNumber(values, defaults.min, "min");
  const max = getNumber(values, defaults.max, "max");
  return { min, max };
}

function normalizeBetaPertParams(
  values: Record<string, number | undefined>,
  defaults: { min: number; max: number; mean: number; lambda?: number },
) {
  const min = getNumber(values, defaults.min, "min");
  const max = getNumber(values, defaults.max, "max");
  const a = Math.min(min, max);
  const b = Math.max(min, max);
  const mean = clamp(getNumber(values, defaults.mean, "mode"), a, b);
  const lambda = Math.max(
    0.1,
    getNumber(values, defaults.lambda ?? 4, "lambda") || 4,
  );
  return { min, max, mean, lambda };
}

function getNumber(
  values: Record<string, number | undefined>,
  fallback: number,
  key: string,
) {
  const v = values[key];
  if (Number.isFinite(v)) return v as number;
  if (Number.isFinite(fallback)) return fallback;
  return 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function useDebounced<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [delayMs, value]);

  return debounced;
}
