// app/page.tsx

"use client";

import React, { useState } from "react";
import { TaskForm } from "@/components/task-form";
import { TaskTable } from "@/components/task-table";
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

  // Track if we are editing an existing task
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Helper to determine if in "create" or "edit" mode
  const isEditing = editIndex !== null;

  // The task currently being edited, if any
  const taskBeingEdited = isEditing ? tasks[editIndex!] : undefined;

  // -------------------
  //  Add or Edit Task
  // -------------------
  const handleSubmitTask = (task: Task, index?: number) => {
    // If editing, replace existing task
    if (typeof index === "number") {
      setTasks((prev) => {
        const newTasks = [...prev];
        newTasks[index] = task;
        return newTasks;
      });
      setEditIndex(null); // reset
    }
    // Otherwise, add new
    else {
      setTasks((prev) => [...prev, task]);
    }
  };

  // User clicks "Remove"
  const handleRemoveTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      // if we removed the one we're editing, reset
      setEditIndex(null);
    }
  };

  // User clicks "Edit"
  const handleEditTask = (task: Task, index: number) => {
    setEditIndex(index);
  };

  // User cancels editing
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
  //   Histogram
  // -------------------
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

  const { labels, counts } = createHistogram(simulationData, 20);
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

      {/* The TaskForm for adding or editing */}
      <TaskForm
        mode={isEditing ? "edit" : "create"}
        initialTask={taskBeingEdited}
        taskIndex={isEditing ? editIndex! : undefined}
        onSubmit={handleSubmitTask}
        onCancel={handleCancelEdit}
      />

      {/* Our new table of tasks with edit/remove actions */}
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

      {/* Chart */}
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
                x: { title: { display: true, text: "Total Time" } },
                y: { title: { display: true, text: "Frequency" } },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
