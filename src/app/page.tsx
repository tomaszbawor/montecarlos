// app/page.tsx

"use client";

import React, { useState } from "react";
import { TaskForm } from "@/components/task-form";
import { Button } from "@/components/ui/button";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { runMonteCarlo, Task } from "./lib/monte-carlo";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [simulationData, setSimulationData] = useState<number[]>([]);

  // Add new tasks coming from TaskForm
  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  // Run Monte Carlo and store the distribution
  const handleSimulate = () => {
    if (tasks.length === 0) return;
    const results = runMonteCarlo(tasks, 10000);
    setSimulationData(results);
  };

  // Once we have simulationData (the total times per iteration),
  // we can bin them into histogram buckets:
  const createHistogram = (data: number[], numberOfBins: number) => {
    if (!data.length) return { labels: [], counts: [] };

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

    return { labels, counts };
  };

  const { labels, counts } = createHistogram(simulationData, 20); // 20 bins example

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

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Monte Carlo Task Estimation</h1>

      {/* Add Task Form */}
      <TaskForm onAddTask={handleAddTask} />

      {/* Display the list of tasks */}
      <div>
        <h2 className="text-xl font-semibold mt-4">Current Tasks</h2>
        <ul className="list-disc list-inside">
          {tasks.map((task, index) => (
            <li key={index}>
              <strong>{task.name}</strong>: {task.min} - {task.max} (
              {task.distribution})
            </li>
          ))}
        </ul>
      </div>

      {/* Run Simulation */}
      <Button onClick={handleSimulate} disabled={tasks.length === 0}>
        Run Monte Carlo Simulation
      </Button>

      {/* Render Chart only if we have results */}
      {simulationData.length > 0 && (
        <div className="max-w-xl mt-8">
          <h2 className="text-xl font-semibold">Simulation Results</h2>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "Histogram of Total Task Times",
                },
              },
              scales: {
                x: { title: { display: true, text: "Total Time (units)" } },
                y: { title: { display: true, text: "Frequency" } },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
