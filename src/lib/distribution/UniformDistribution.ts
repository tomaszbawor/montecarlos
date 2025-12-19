import type {
  Distribution,
  DistributionParameters,
} from "@/lib/distribution/Distribution";

export interface UniformDistributionParams extends DistributionParameters {}

export class UniformDistribution
  implements Distribution<UniformDistributionParams>
{
  calculateDistribution(params: UniformDistributionParams): number {
    const min = Math.min(params.min, params.max);
    const max = Math.max(params.min, params.max);
    return min + Math.random() * (max - min);
  }
}
