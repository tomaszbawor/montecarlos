import React, { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Bar } from "react-chartjs-2";

export interface SimulationResultProps {
    simulationData: number[];
}


export function SimulationResult({simulationData}: SimulationResultProps) {

    const [confidence, setConfidence] = useState<number>(95);

    // -------------------------------------------------------------------
    //  Compute percentile + draw a red line
    // -------------------------------------------------------------------
    // 1) The percentile value: time by which X% of simulations have finished
    const percentileValue = useMemo(() => {
        if (!simulationData.length) return 0;
        const sorted = [...simulationData].sort((a, b) => a - b);
        // index for the desired percentile
        const idx = Math.floor((confidence / 100) * sorted.length);
        return sorted[idx] || 0;
    }, [simulationData, confidence]);

    // 2) Create the histogram data from simulation
    const numberOfBins = 20;
    const { labels, counts, minValue, maxValue } = useMemo(
        () => createHistogram(simulationData, numberOfBins),
        [simulationData],
    );

    // 3) Determine which bin the percentile value falls into
    const percentileBinIndex = useMemo(() => {
        if (!simulationData.length) return null;
        const binSize = (maxValue - minValue) / numberOfBins;
        const idx = Math.floor((percentileValue - minValue) / binSize);
        return Math.min(Math.max(idx, 0), numberOfBins - 1);
    }, [percentileValue, minValue, maxValue, numberOfBins, simulationData]);

    // -------------------------------------------------------------------
    //  Creating a histogram from simulation data
    // -------------------------------------------------------------------
    function createHistogram(data: number[], numberOfBins: number) {
        if (!data.length) {
            return {
                labels: [] as string[],
                counts: [] as number[],
                minValue: 0,
                maxValue: 0,
            };
        }

        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const binSize = (maxValue - minValue) / numberOfBins;
        const counts = new Array(numberOfBins).fill(0);

        data.forEach((value) => {
            const binIndex = Math.min(
                Math.floor((value - minValue) / binSize),
                numberOfBins - 1,
            );
            counts[binIndex] += 1;
        });

        const labels = counts.map((_, i) => {
            const start = minValue + i * binSize;
            const end = start + binSize;
            return `${start.toFixed(1)} - ${end.toFixed(1)}`;
        });

        return { labels, counts, minValue, maxValue };
    }

    // -------------------------------------------------------------------
//  Chart.js data + annotation plugin config
// -------------------------------------------------------------------
    const chartData = {
        labels,
        datasets: [
            {
                label: "Frequency",
                data: counts,
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    const chartOptions: any = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Histogram of Total Task Times",
            },
            annotation: {
                annotations:
                    percentileBinIndex !== null && simulationData.length > 0
                        ? {
                            percentileLine: {
                                type: "line",
                                xMin: percentileBinIndex + 0.5, // shift line to boundary between bins
                                xMax: percentileBinIndex + 0.5,
                                borderColor: "red",
                                borderWidth: 2,
                                label: {
                                    enabled: true,
                                    position: "start",
                                    content: `${confidence}% ≈ ${percentileValue.toFixed(1)}`,
                                    color: "red",
                                    backgroundColor: "white",
                                },
                            },
                        }
                        : {},
            },
        },
        scales: {
            x: {
                title: { display: true, text: "Total Time" },
            },
            y: {
                title: { display: true, text: "Frequency" },
            },
        },
    };

    return (
        <>
            <div className="mt-8 space-y-6">
                {/* Confidence slider */}
                <div className="max-w-lg space-y-2">
                    <p className="font-semibold">Confidence: {confidence}%</p>
                    <Slider
                        defaultValue={[confidence]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(val) => setConfidence(val[0])}
                    />
                    <p className="text-sm text-gray-500">
                        By <strong>{confidence}%</strong> certainty, tasks finish in about{" "}
                        <strong>{percentileValue.toFixed(2)}</strong> time units.
                    </p>
                </div>

                {/* Histogram chart */}
                <div className="max-w-3xl">
                    <Bar data={chartData} options={chartOptions}/>
                </div>
            </div>
        </>
    );
}
