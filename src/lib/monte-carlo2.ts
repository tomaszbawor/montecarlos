import type { Task } from "@/domain/Task";
import type { Workforce } from "@/domain/Workforce";
import { normInvMS } from "./norm-inv";

export interface SimulationSettings {
  developers: Workforce[];
  projectStartDate: Date;
  projectEndDate: Date;
  tasks: Task[];
  /**
   * For standard deviation approximation σ:
   *
   * The entire reasonable range of variation (~99.9% of values) falls within the interval:
   * μ ± 3.29σ
   * The factor 3.29 is derived from:
   * 3.29 * σ ≈ 99.9 percentile limit
   * 0.1 percentile ≈ μ – 3.29σ
   * → full range (max − min) ≈ 6.58σ
   * σ ≈ (max − min) / 6.58 — this gives the whole range between min and max
   * !!! We will use σ ≈ (max − min) / 3.29 !!!
   *
   * min ≈ μ − 3.29σ
   * max ≈ μ + 3.29σ
   *
   * This essentially means that both min and max
   * are extreme reasonable limits, not the full theoretical distribution.
   */
  standardDeviationParameter: number;
  marketAverageAgileProductivityMinPercentage: number;
  marketAverageAgileProductivityMaxPercentage: number;
}

function h(timeinDays: number): number {
  return timeinDays * 8;
}

function sh(timeinDays: number): number {
  return timeinDays * 5;
}

function getRandO1NotInclusive() {
  return (Math.random() + Number.EPSILON) % 1;
}

function failsafe(estimateInHours: number) {
  return estimateInHours < 0 ? 0 : estimateInHours;
}

function normInvWithFailsafe(
  minDays: number,
  maxDays: number,
  standardDeviationParameter: number,
) {
  const estimateInHours = normInvMS(
    getRandO1NotInclusive(),
    (h(minDays) + h(maxDays)) / 2,
    (h(maxDays) - h(minDays)) / standardDeviationParameter,
  );
  return failsafe(estimateInHours);
}

function normInvWithFailsafeForSickLeave(
  minWeeks: number,
  maxWeeks: number,
  standardDeviationParameter: number,
) {
  const estimateInDays = normInvMS(
    getRandO1NotInclusive(),
    (sh(minWeeks) + sh(maxWeeks)) / 2,
    (sh(maxWeeks) - sh(minWeeks)) / standardDeviationParameter,
  );
  return failsafe(estimateInDays);
}

function normInvWithFailsafePercentage(
  min: number,
  max: number,
  standardDeviationParameter: number,
) {
  const estimateInPercentage = normInvMS(
    getRandO1NotInclusive(),
    (min + max) / 2,
    (max - min) / standardDeviationParameter,
  );
  return failsafe(estimateInPercentage);
}

/**
 * Calculate task time based on NORM.INV(probability, mean, standard_dev) with failsafe because
 * it can give negative values, for now I will change it to zero, but in the future we can take min value
 * or use probability distribution Beta-PERT.
 */
function calculateTaskTimeInHours(
  task: Task,
  standardDeviationParameter: number,
): number {
  const { minEstimate, maxEstimate } = task;
  const estimateInHours = normInvWithFailsafe(
    minEstimate,
    maxEstimate,
    standardDeviationParameter,
  );
  return estimateInHours;
}

function calculateSickLeaveTimeInDays(
  dev: Workforce,
  standardDeviationParameter: number,
): number {
  const { sickLeaveMinWeeks, sickLeaveMaxWeeks } = dev;
  const estimateInDays = normInvWithFailsafeForSickLeave(
    sickLeaveMinWeeks,
    sickLeaveMaxWeeks,
    standardDeviationParameter,
  );
  return estimateInDays;
}

function calculateDevEngagementInPercentage(
  dev: Workforce,
  standardDeviationParameter: number,
): number {
  const { engagementMinPercentage, engagementMaxPercentage } = dev;
  const estimateInPercentage = normInvWithFailsafePercentage(
    engagementMinPercentage,
    engagementMaxPercentage,
    standardDeviationParameter,
  );
  return estimateInPercentage;
}

function calculateMarketProductivity(
  min: number,
  max: number,
  standardDeviationParameter: number,
): number {
  const estimateInPercentage = normInvWithFailsafePercentage(
    min,
    max,
    standardDeviationParameter,
  );
  return estimateInPercentage;
}

function calculateWorkdays(projectStartDate: Date, projectEndDate: Date) {
  const s = new Date(
    projectStartDate.getFullYear(),
    projectStartDate.getMonth(),
    projectStartDate.getDate(),
  );
  const e = new Date(
    projectEndDate.getFullYear(),
    projectEndDate.getMonth(),
    projectEndDate.getDate(),
  );

  if (s > e) return 0;

  let count = 0;
  const current = new Date(s);

  while (current <= e) {
    const day = current.getDay(); // 0 = niedziela, 6 = sobota
    if (day !== 0 && day !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Runs a Monte Carlo simulation on the tasks.
 *
 * @param tasks - the list of tasks with {name, min, max, distribution}.
 * @param iterations - how many simulation runs (e.g., 10_000).
 * @returns an array of total times from each simulation run.
 */
export function runMonteCarloSimulationNew(
  simulationSettings: SimulationSettings,
  iterations = 10000,
) {
  let positiveSimResults = 0;
  const workdaysCalculatedBasedOnProjectStartAndEnd = calculateWorkdays(
    simulationSettings.projectStartDate,
    simulationSettings.projectEndDate,
  );

  for (let i = 0; i < iterations; i++) {
    let totalHoursForAllStories = 0;
    let totalHoursForAllDevs = 0;
    const estimatesInHours: number[] = [];
    const sickLeavesInDays: number[] = [];
    const engagementsInPercentage: number[] = []; // [0.01-0.99]
    let marketProductivityInPercentage = 0;
    const effortsInHours: number[] = [];

    for (const task of simulationSettings.tasks) {
      estimatesInHours.push(
        calculateTaskTimeInHours(
          task,
          simulationSettings.standardDeviationParameter,
        ),
      );
    }

    for (const devs of simulationSettings.developers) {
      sickLeavesInDays.push(
        calculateSickLeaveTimeInDays(
          devs,
          simulationSettings.standardDeviationParameter,
        ),
      );
      engagementsInPercentage.push(
        calculateDevEngagementInPercentage(
          devs,
          simulationSettings.standardDeviationParameter,
        ),
      );
    }

    marketProductivityInPercentage = calculateMarketProductivity(
      simulationSettings.marketAverageAgileProductivityMinPercentage,
      simulationSettings.marketAverageAgileProductivityMaxPercentage,
      simulationSettings.standardDeviationParameter,
    );

    for (let j = 0; j < simulationSettings.developers.length; j++) {
      const devVacationInDays = simulationSettings.developers[j].vacationDays;
      const devSickLeaveInDays = sickLeavesInDays[j];
      const devEngagementInPercentage = engagementsInPercentage[j];
      const workdays = workdaysCalculatedBasedOnProjectStartAndEnd;
      const devEffortInHours =
        (workdays - devVacationInDays - devSickLeaveInDays) *
        8 *
        marketProductivityInPercentage *
        devEngagementInPercentage;
      effortsInHours.push(devEffortInHours);
    }

    for (const storyEstimate of estimatesInHours) {
      totalHoursForAllStories += storyEstimate;
    }

    for (const devEffort of effortsInHours) {
      totalHoursForAllDevs += devEffort;
    }

    const worforceTimeLeft = totalHoursForAllDevs - totalHoursForAllStories;
    const simResult = worforceTimeLeft > 0;
    if (simResult) positiveSimResults++;
  }

  const monteCarloResultPercentage = (positiveSimResults / iterations) * 100;
  return monteCarloResultPercentage;
}
