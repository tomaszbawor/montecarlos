import { Effect, Random } from "effect";
import type { BetaPertParams } from "@/lib/distribution/BetaPertDistribution";
import { BetaPertDistribution } from "@/lib/distribution/BetaPertDistribution";
import {
  UniformDistribution,
  type UniformDistributionParams,
} from "@/lib/distribution/UniformDistribution";
import { RandomService } from "@/state/atom-runtime";

export type DistributionId = "uniform" | "beta-pert";

export type DistributionParameterControl =
  | {
      kind: "number";
      key: string;
      label: string;
      step?: number;
      min?: number;
      max?: number;
    }
  | {
      kind: "slider";
      key: string;
      label: string;
      step?: number;
      min: number;
      max: number;
    };

export type AnyDistributionDefinition =
  | {
      id: "uniform";
      name: string;
      description: string;
      defaultParams: UniformDistributionParams;
      controls: readonly DistributionParameterControl[];
      sample: (params: UniformDistributionParams) => number;
      domain: (params: UniformDistributionParams) => {
        min: number;
        max: number;
      };
    }
  | {
      id: "beta-pert";
      name: string;
      description: string;
      defaultParams: BetaPertParams;
      controls: readonly DistributionParameterControl[];
      sample: (params: BetaPertParams) => number;
      domain: (params: BetaPertParams) => { min: number; max: number };
    };

export const DISTRIBUTIONS: readonly AnyDistributionDefinition[] = [
  {
    id: "uniform",
    name: "Uniform",
    description: "Every value in the range is equally likely.",
    defaultParams: { min: 0, max: 10 },
    controls: [
      { kind: "number", key: "min", label: "Min", step: 0.1 },
      { kind: "number", key: "max", label: "Max", step: 0.1 },
    ],
    sample: (params) => {
      const distribution = new UniformDistribution();
      const getValueEffect = distribution
        .calculate(params)
        .pipe(Effect.provideService(Random.Random, RandomService));

      return Effect.runSync(getValueEffect);
    },
    domain: (params) => ({
      min: Math.min(params.min, params.max),
      max: Math.max(params.min, params.max),
    }),
  },
  {
    id: "beta-pert",
    name: "Beta-PERT",
    description: "PERT with a Beta distribution shape (min, mode, max).",
    defaultParams: { min: 0, mean: 6, max: 10, lambda: 4 },
    controls: [
      { kind: "number", key: "min", label: "Min", step: 0.1 },
      { kind: "number", key: "mode", label: "Mode", step: 0.1 },
      { kind: "number", key: "max", label: "Max", step: 0.1 },
      {
        kind: "slider",
        key: "lambda",
        label: "Lambda",
        min: 0.1,
        max: 20,
        step: 0.1,
      },
    ],
    sample: (params) => {
      const distribution = new BetaPertDistribution();
      const getValueEffect = distribution
        .calculate(params)
        .pipe(Effect.provideService(Random.Random, RandomService));

      return Effect.runSync(getValueEffect);
    },
    domain: (params) => ({
      min: Math.min(params.min, params.max),
      max: Math.max(params.min, params.max),
    }),
  },
] as const;

export function getDistributionDefinition(
  id: string,
): AnyDistributionDefinition | undefined {
  return DISTRIBUTIONS.find((d) => d.id === id);
}
