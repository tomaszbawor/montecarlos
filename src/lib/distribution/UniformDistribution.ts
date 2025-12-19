import type {
  Distribution,
  DistributionParameters,
} from "@/lib/distribution/Distribution";

export interface UniformDistributionParams extends DistributionParameters {}

export class UniformDistribution
  implements Distribution<UniformDistributionParams>
{
  calculateDistribution(params: UniformDistributionParams): number {
    const { min, max } = params;
    return min + Math.random() * (max - min);
  }
}
