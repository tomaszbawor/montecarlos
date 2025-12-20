import { Data, type Effect, type Random, type Schema } from "effect";
import type { Task } from "@/domain/Task";

export interface DistributionParameters {
  min: number;
  max: number;
}

export class DistributionError extends Data.TaggedError("DistributionError")<{
  reason: Schema.Defect;
  message: string;
}> {}

export interface Distribution<
  P extends DistributionParameters = DistributionParameters,
> {
  calculateDistribution(params: P): number;
  paramsFromTask(t: Task): P;
}

export interface EffectfullDistribution<
  P extends DistributionParameters = DistributionParameters,
> {
  calculate: (
    parameters: P,
  ) => Effect.Effect<number, DistributionError, Random.Random>;
  paramsFromTaks: (task: Task) => P;
}
