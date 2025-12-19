export interface DistributionParameters {
  min: number;
  max: number;
}

export interface Distribution<
  P extends DistributionParameters = DistributionParameters,
> {
  calculateDistribution(params: P): number;
}
