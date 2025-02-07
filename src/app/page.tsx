"use client";

import React, { useState, useMemo } from "react";
import { Task, runMonteCarlo } from "@/app/lib/monte-carlo";
import { TaskForm } from "@/components/task-form";
import { TaskTable } from "@/components/task-table";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Chart.js + annotation plugin
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
);

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [simulationData, setSimulationData] = useState<number[]>([]);

  // Track if we are editing an existing task
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const isEditing = editIndex !== null;
  const taskBeingEdited = isEditing ? tasks[editIndex!] : undefined;

  // -------------------
  //  Add or Edit Task
  // -------------------
  const handleSubmitTask = (task: Task, index?: number) => {
    // Editing
    if (typeof index === "number") {
      setTasks((prev) => {
        const newTasks = [...prev];
        newTasks[index] = task;
        return newTasks;
      });
      setEditIndex(null);
    }
    // Creating new
    else {
      setTasks((prev) => [...prev, task]);
    }
  };

  const handleRemoveTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
    }
  };
  const handleEditTask = (task: Task, index: number) => {
    setEditIndex(index);
  };
  const handleCancelEdit = () => {
    setEditIndex(null);
  };

  // -------------------
  //  Run Monte Carlo
  // -------------------
  const handleSimulate = () => {
    if (tasks.length === 0) return;
    const results = runMonteCarlo(tasks, 5000);
    setSimulationData(results);
  };

  // -------------------
  //  Histogram Binning
  // -------------------
  function createHistogram(data: number[], numberOfBins: number) {
    if (!data.length)
      return { labels: [], counts: [], minValue: 0, maxValue: 0 };

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

    // e.g. "3.1 - 5.1", "5.1 - 7.1", ...
    const labels = counts.map((_, i) => {
      const start = minValue + i * binSize;
      const end = start + binSize;
      return `${start.toFixed(1)} - ${end.toFixed(1)}`;
    });

    return { labels, counts, minValue, maxValue };
  }

  // -------------------
  //  Confidence Slider
  // -------------------
  const [confidence, setConfidence] = useState<number>(95); // e.g. 95%

  // Find the numeric time at the chosen percentile
  const percentileValue = useMemo(() => {
    if (simulationData.length === 0) return 0;
    const sortedSim = [...simulationData].sort((a, b) => a - b);
    const index = Math.floor((confidence / 100) * sortedSim.length);
    return sortedSim[index] || 0;
  }, [simulationData, confidence]);

  // We’ll create the histogram data from simulationData
  const numberOfBins = 20;
  const { labels, counts, minValue, maxValue } = useMemo(
    () => createHistogram(simulationData, numberOfBins),
    [simulationData],
  );

  // Compute which bin the percentileValue falls into, to display a red line
  // that lines up with the bin index on the category axis.
  const percentileBinIndex = useMemo(() => {
    if (simulationData.length === 0) return null;
    const binSize = (maxValue - minValue) / numberOfBins;
    const idx = Math.floor((percentileValue - minValue) / binSize);
    // clamp between 0 and numberOfBins - 1
    return Math.min(Math.max(idx, 0), numberOfBins - 1);
  }, [percentileValue, minValue, maxValue, numberOfBins, simulationData]);

  // Prepare bar chart data
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

  // Chart options with annotation line
  const chartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Histogram of Total Task Times",
      },
      // annotation plugin for the vertical line
      annotation: {
        annotations:
          percentileBinIndex !== null && simulationData.length > 0
            ? {
                percentileLine: {
                  type: "line",
                  // On a category axis, x=binIndex is valid.
                  // xMin and xMax must both be that bin index to draw a vertical line
                  xMin: percentileBinIndex + 0.5, // +0.5 shifts the line to the right edge of the bin
                  xMax: percentileBinIndex + 0.5,
                  borderColor: "red",
                  borderWidth: 2,
                  label: {
                    enabled: true,
                    position: "start",
                    content: `${confidence}% ~ ${percentileValue.toFixed(1)}`,
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
        // Category axis
        title: { display: true, text: "Total Time" },
      },
      y: {
        title: { display: true, text: "Frequency" },
      },
    },
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Monte Carlo Task Estimation</h1>

      {/* The TaskForm for adding or editing */}
      <TaskForm
        mode={isEditing ? "edit" : "create"}
        initialTask={taskBeingEdited}
        taskIndex={isEditing ? editIndex! : undefined}
        onSubmit={handleSubmitTask}
        onCancel={handleCancelEdit}
      />

      {/* Our table of tasks with edit/remove actions */}
      {tasks.length > 0 && (
        <TaskTable
          tasks={tasks}
          onEdit={handleEditTask}
          onRemove={handleRemoveTask}
        />
      )}

      {/* Run simulation */}
      <Button onClick={handleSimulate} disabled={tasks.length === 0}>
        Run Monte Carlo Simulation
      </Button>

      {/* Show the slider and the current percentile value */}
      {simulationData.length > 0 && (
        <div className="mt-8 max-w-lg space-y-2">
          <p className="font-semibold">Confidence: {confidence}%</p>
          <Slider
            defaultValue={[confidence]}
            min={0}
            max={100}
            step={1}
            onValueChange={(val) => setConfidence(val[0])}
          />
          <p className="text-sm text-gray-500">
            The <strong>{confidence}%</strong> cutoff time is approximately
            <strong> {percentileValue.toFixed(2)}</strong> units (by which{" "}
            {confidence}% of simulations have completed all tasks).
          </p>
        </div>
      )}

      {/* Chart */}
      {simulationData.length > 0 && (
        <div className="max-w-3xl mt-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
