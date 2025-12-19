import type {
  Distribution,
  DistributionParameters,
} from "@/lib/distribution/Distribution";

export interface BetaPertParams extends DistributionParameters {
  mode: number; // [0.01-1]
  lambda?: number; // [0.01-1]
}

export class BetaPertDistribution implements Distribution<BetaPertParams> {
  calculateDistribution(_params: BetaPertParams): number {
    // TODO: Implement the calculation logic for the Beta-Pert distribution
    return 0;
  }
}
