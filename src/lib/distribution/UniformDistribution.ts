import { Effect, Random } from "effect";
import type { Task } from "@/domain/Task";
import type {
  Distribution,
  DistributionParameters,
  EffectfullDistribution,
} from "@/lib/distribution/Distribution";

export interface UniformDistributionParams extends DistributionParameters {}

export class UniformDistribution
  implements Distribution<UniformDistributionParams>
{
  paramsFromTask(task: Task): UniformDistributionParams {
    const { minEstimate: min, maxEstimate: max } = task;

    return {
      min,
      max,
    };
  }

  calculateDistribution(params: UniformDistributionParams): number {
    const min = Math.min(params.min, params.max);
    const max = Math.max(params.min, params.max);
    return min + Math.random() * (max - min);
  }
}

export class EffectfullUniformDistribution
  implements EffectfullDistribution<UniformDistributionParams>
{
  calculate = (params: UniformDistributionParams) =>
    Effect.gen(function* () {
      const min = Math.min(params.min, params.max);
      const max = Math.max(params.min, params.max);

      const randomNumberProvider = yield* Random.Random;
      const randomNumber = yield* randomNumberProvider.next;

      return min + randomNumber * (max - min);
    });
}
