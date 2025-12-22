// lib/monte-carlo.ts

import { Effect, Random } from "effect";
import type { Task } from "@/domain/Task";
import { BetaPertDistribution } from "@/lib/distribution/BetaPertDistribution";
import type {
  Distribution,
  DistributionParameters,
} from "@/lib/distribution/Distribution";
import { RandomService } from "@/state/atom-runtime";

/**
 * Generate a random value from the specified distribution.
 */
function randomValue(task: Task): number;
function randomValue<P extends DistributionParameters>(
  task: Task,
  distribution: Distribution<P>,
): number;
function randomValue<P extends DistributionParameters>(
  task: Task,
  distribution?: Distribution<P>,
): number {
  if (!distribution) {
    const defaultDistribution = new BetaPertDistribution();
    const params = defaultDistribution.paramsFromTask(task);
    return defaultDistribution
      .calculate(params)
      .pipe(
        Effect.provideService(Random.Random, RandomService),
        Effect.runSync,
      );
  }

  const params = distribution.paramsFromTask(task);
  return distribution
    .calculate(params)
    .pipe(Effect.provideService(Random.Random, RandomService), Effect.runSync);
}

/**
 * Runs a Monte Carlo simulation on the tasks.
 *
 * @param tasks - the list of tasks with {name, min, max, distribution}.
 * @param iterations - how many simulation runs (e.g., 10_000).
 * @returns an array of total times from each simulation run.
 */
export function runMonteCarlo(
  tasks: readonly Task[],
  iterations = 50000,
): number[] {
  const totals: number[] = [];

  for (let i = 0; i < iterations; i++) {
    let total = 0;
    for (const task of tasks) {
      total += randomValue(task);
    }
    totals.push(total);
  }

  return totals;
}
