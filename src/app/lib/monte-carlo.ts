// lib/monte-carlo.ts

import type { Task } from "@/domain/Task";
import { BetaPertDistribution } from "@/lib/distribution/BetaPertDistribution";
import type { Distribution } from "@/lib/distribution/Distribution";

/**
 * Generate a random value from the specified distribution.
 */
function randomValue(task: Task, distribution?: Distribution): number {
  if (!distribution) {
    distribution = new BetaPertDistribution();
  }

  const params = distribution.paramsFromTask(task);
  return distribution.calculateDistribution(params);
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
