import { Effect } from "effect";
import { Random } from "effect/Random";
import type { Task } from "@/domain/Task";
import type {
  DistributionError,
  DistributionParameters,
  EffectfullDistribution,
} from "@/lib/distribution/Distribution";

export interface BetaPertParams extends DistributionParameters {
  mean: number;
  /**
   * Controls how strongly the distribution is pulled towards `mode`.
   * Common default: 4.
   */
  lambda?: number;
}

export class BetaPertDistribution
  implements EffectfullDistribution<BetaPertParams>
{
  calculate = (
    params: BetaPertParams,
  ): Effect.Effect<number, DistributionError, Random> =>
    Effect.gen(function* () {
      const lambda = params.lambda ?? 4;
      if (!(lambda > 0)) return NaN;

      const min = Math.min(params.min, params.max);
      const max = Math.max(params.min, params.max);
      if (min === max) return min;

      const mode = clamp(params.mean, min, max);

      const alpha = 1 + (lambda * (mode - min)) / (max - min);
      const beta = 1 + (lambda * (max - mode)) / (max - min);

      const u = yield* randomBeta2(alpha, beta);
      return min + u * (max - min);
    });

  paramsFromTask(task: Task): BetaPertParams {
    const { minEstimate: min, maxEstimate: max } = task;

    const mean = task.meanEstimate ?? (min + max) / 2;

    return {
      min,
      max,
      mean,
    };
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const randomBeta2 = (alpha: number, beta: number) =>
  Effect.gen(function* () {
    const x = yield* randomGamma2(alpha);
    const y = yield* randomGamma2(beta);

    return x / (x + y);
  });

const randomGamma2 = (shape: number): Effect.Effect<number, never, Random> =>
  Effect.gen(function* () {
    const random = yield* Random;
    if (!(shape > 0)) return NaN;

    if (shape < 1) {
      const u = yield* random.next;
      return (yield* randomGamma2(shape + 1)) * u ** (1 / shape);
    }

    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);

    while (true) {
      const x = yield* randomStandardNormal2();
      const v = (1 + c * x) ** 3;
      if (v <= 0) continue;

      const u = yield* random.next;
      if (u < 1 - 0.0331 * x ** 4) return d * v;
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
    }
  });

const randomStandardNormal2 = () =>
  Effect.gen(function* () {
    const random = yield* Random;
    let u = 0;
    let v = 0;
    while (u === 0) u = yield* random.next;
    while (v === 0) v = yield* random.next;
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  });
