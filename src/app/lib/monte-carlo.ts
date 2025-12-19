// lib/monte-carlo.ts

import type { Task } from "@/domain/Task";

/**
 * Generate a random value from the specified distribution.
 *
 * For demonstration, we implement:
 *   - uniform: random between min and max
 *   - triangular: simple triangular approximation
 */
function randomValue(task: Task): number {
  const { minEstimate: min, maxEstimate: max } = task;
  return Math.random() * (max - min) + min;
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
