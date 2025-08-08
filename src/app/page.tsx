"use client";

import React, { useMemo, useState } from "react";

// --- React Query Tasks Hooks ---
import { useTasks, useSetTasks, Task } from "@/app/hooks/useTasks";

// --- UI Components for tasks ---
import { TaskForm } from "@/components/task-form";
import { TaskTable } from "@/components/task-table";
import {UploadDataItem, UploadForm} from '@/components/upload-form'

// --- Monte Carlo logic ---
import { runMonteCarlo } from "@/app/lib/monte-carlo";

// --- shadcn/ui components ---
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// --- Chart.js + annotation plugin ---
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

// Register Chart.js components and plugins
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
  // -------------------------------------------------------------------
  //  React Query: get and set tasks (persisted in localStorage)
  // -------------------------------------------------------------------
  const tasks = useTasks(); // read tasks from the React Query cache
  const setTasks = useSetTasks(); // update tasks in the React Query cache

  // -------------------------------------------------------------------
  //  Local state for editing tasks
  // -------------------------------------------------------------------
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const isEditing = editIndex !== null;
  const taskBeingEdited = isEditing ? tasks[editIndex!] : undefined;

  // -------------------------------------------------------------------
  //  Local state for simulation results + confidence slider
  // -------------------------------------------------------------------
  const [simulationData, setSimulationData] = useState<number[]>([]);
  const [confidence, setConfidence] = useState<number>(95);

  // -------------------------------------------------------------------
  //  Handlers for adding / editing / removing tasks
  // -------------------------------------------------------------------
  function handleSubmitTask(newTask: Task, index?: number) {
    if (typeof index === "number") {
      // Editing an existing task
      const updated = [...tasks];
      updated[index] = newTask;
      setTasks(updated);
      setEditIndex(null);
    } else {
      // Adding a new task
      setTasks([...tasks, newTask]);
    }
  }

  function handleRemoveTask(index: number) {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    if (editIndex === index) {
      setEditIndex(null);
    }
  }

  function handleEditTask(task: Task, index: number) {
    setEditIndex(index);
  }

  function handleCancelEdit() {
    setEditIndex(null);
  }

  // -------------------------------------------------------------------
  //  Monte Carlo Simulation
  // -------------------------------------------------------------------
  function handleSimulate() {
    if (tasks.length === 0) return;
    const results = runMonteCarlo(tasks, 20000); // 5,000 iterations
    setSimulationData(results);
  }

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

  const handleUploadData = (data: UploadDataItem[]) => {
    setTasks(data.map(item => {
        return {
            ...item,
            distribution: "uniform"
        }
    }));
  };

  // -------------------------------------------------------------------
  //  Render the entire UI
  // -------------------------------------------------------------------
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">Monte Carlo Task Estimation</h1>
      <UploadForm onData={handleUploadData} />
      {/* Task Form for adding / editing */}
      <TaskForm
        mode={isEditing ? "edit" : "create"}
        initialTask={taskBeingEdited}
        taskIndex={isEditing ? editIndex! : undefined}
        onSubmit={handleSubmitTask}
        onCancel={handleCancelEdit}
      />

      <h3 className="text-xl font-bold text-center">List of tasks</h3>
      {/* Table of tasks (with edit/remove actions) */}
      {tasks.length > 0 && (
        <TaskTable
          tasks={tasks}
          onEdit={handleEditTask}
          onRemove={handleRemoveTask}
        />
      )}

      {/* Button to run Monte Carlo */}
      <Button onClick={handleSimulate} disabled={tasks.length === 0}>
        Run Monte Carlo Simulation
      </Button>

      {/* If we have simulationData, show the slider and chart */}
      {simulationData.length > 0 && (
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
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
