// lib/monte-carlo.ts

export interface Task {
  name: string;
  distribution: string;
  min: number;
  max: number;
}

/**
 * Generate a random value from the specified distribution.
 *
 * For demonstration, we implement:
 *   - uniform: random between min and max
 *   - triangular: simple triangular approximation
 */
function randomValue(task: Task): number {
  const { distribution, min, max } = task;

  switch (distribution) {
    case "uniform": {
      // uniform distribution between [min, max]
      return Math.random() * (max - min) + min;
    }
    case "triangular": {
      // triangular distribution: (min + max + mode) / 3
      // For simplicity, let's assume mode ~ midpoint
      const mode = (min + max) / 2;
      // A simple approach to triangular distribution:
      const u = Math.random();
      const c = (mode - min) / (max - min);
      if (u < c) {
        return min + Math.sqrt(u * (max - min) * (mode - min));
      } else {
        return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
      }
    }
    default:
      // fallback to uniform if no distribution is selected
      return Math.random() * (max - min) + min;
  }
}

/**
 * Runs a Monte Carlo simulation on the tasks.
 *
 * @param tasks - the list of tasks with {name, min, max, distribution}.
 * @param iterations - how many simulation runs (e.g., 10_000).
 * @returns an array of total times from each simulation run.
 */
export function runMonteCarlo(
  tasks: Task[],
  iterations: number = 50000,
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
