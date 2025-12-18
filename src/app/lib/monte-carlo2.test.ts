import {runMonteCarloSimulationNew,SimulationSettings} from "./monte-carlo2"

describe('test simulation', () => {
    it('counts only weekdays', () => {

        const simulationSettings: SimulationSettings = {
            projectStartDate: new Date('2025-01-01'),
            projectEndDate: new Date('2025-02-17'),

            developers: [
                {
                    developerIdentifier: 'DEV-001',
                    sickLeaveMinWeeks: 1,
                    sickLeaveMaxWeeks: 1,
                    engagementMinPercentage: 0.98,
                    engagementMaxPercentage: 0.99,
                    vacationDays: 5,
                },
                {
                    developerIdentifier: 'DEV-002',
                    sickLeaveMinWeeks: 2,
                    sickLeaveMaxWeeks: 3,
                    engagementMinPercentage: 0.98,
                    engagementMaxPercentage: 0.99,
                    vacationDays: 5,
                },
            ],

            tasks: [
                {
                    id: 'TASK-LOGIN',
                    minEstimateDays: 3,
                    maxEstimateDays: 6,
                },
                {
                    id: 'TASK-PAYMENTS',
                    minEstimateDays: 5,
                    maxEstimateDays: 12,
                },
                {
                    id: 'TASK-REPORTING',
                    minEstimateDays: 4,
                    maxEstimateDays: 9,
                },
            ],

            standardDeviationParameter: 3.29,

            marketAverageAgileProductivityMinPercentage: 0.6,
            marketAverageAgileProductivityMaxPercentage: 0.7,
        }

        const result = runMonteCarloSimulationNew(simulationSettings)
        console.log(result + "%")
        expect(result).toBeGreaterThan(95)
    })
})