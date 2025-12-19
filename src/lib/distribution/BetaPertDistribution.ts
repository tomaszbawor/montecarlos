import type {
  Distribution,
  DistributionParameters,
} from "@/lib/distribution/Distribution";

export interface BetaPertParams extends DistributionParameters {
  mode: number;
  /**
   * Controls how strongly the distribution is pulled towards `mode`.
   * Common default: 4.
   */
  lambda?: number;
}

export class BetaPertDistribution implements Distribution<BetaPertParams> {
  calculateDistribution(params: BetaPertParams): number {
    const lambda = params.lambda ?? 4;
    if (!(lambda > 0)) return NaN;

    const min = Math.min(params.min, params.max);
    const max = Math.max(params.min, params.max);
    if (min === max) return min;

    const mode = clamp(params.mode, min, max);

    const alpha = 1 + (lambda * (mode - min)) / (max - min);
    const beta = 1 + (lambda * (max - mode)) / (max - min);

    const u = randomBeta(alpha, beta);
    return min + u * (max - min);
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomBeta(alpha: number, beta: number) {
  const x = randomGamma(alpha);
  const y = randomGamma(beta);
  return x / (x + y);
}

function randomGamma(shape: number): number {
  if (!(shape > 0)) return NaN;

  if (shape < 1) {
    const u = Math.random();
    return randomGamma(shape + 1) * u ** (1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    const x = randomStandardNormal();
    const v = (1 + c * x) ** 3;
    if (v <= 0) continue;

    const u = Math.random();
    if (u < 1 - 0.0331 * x ** 4) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function randomStandardNormal(): number {
  // Box–Muller transform
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
