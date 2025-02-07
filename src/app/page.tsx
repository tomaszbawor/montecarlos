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
import annotationPlugin from "chartjs-plugin-annotation";
import { Bar } from "react-chartjs-2";
import { runMonteCarlo } from "./lib/monte-carlo";
import { useSetTasks, useTasks } from "./hooks/useTasks";

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
  // -------------------
  //  React Query for tasks
  // -------------------
  const tasks = useTasks(); // persisted tasks from the cache
  const setTasks = useSetTasks(); // function to update tasks in the cache

  // For editing
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const isEditing = editIndex !== null;
  const taskBeingEdited = isEditing ? tasks[editIndex!] : undefined;

  // For simulation
  const [simulationData, setSimulationData] = useState<number[]>([]);
  // For confidence
  const [confidence, setConfidence] = useState<number>(95);

  // -------------------
  //  Add or Edit Task
  // -------------------
  function handleSubmitTask(newTask: Task, index?: number) {
    if (typeof index === "number") {
      // Edit existing
      const updated = [...tasks];
      updated[index] = newTask;
      setTasks(updated);
      setEditIndex(null);
    } else {
      // Create new
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

  // -------------------
  //  Run Monte Carlo
  // -------------------
  const handleSimulate = () => {
    if (tasks.length === 0) return;
    const results = runMonteCarlo(tasks, 5000);
    setSimulationData(results);
  };

  // histogram + percentile logic same as before ...
  // ...
  // (omitted here for brevity, but you'd keep your existing code)

  // ...
  // let's assume we have chartData & chartOptions computed

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

      {/* Table of tasks */}
      {tasks.length > 0 && (
        <TaskTable
          tasks={tasks}
          onEdit={handleEditTask}
          onRemove={handleRemoveTask}
        />
      )}

      {/* Simulation button */}
      <Button onClick={handleSimulate} disabled={tasks.length === 0}>
        Run Monte Carlo Simulation
      </Button>

      {/* Confidence slider / chart ... etc */}
      {/* (same code as before to show histogram & vertical line) */}
    </div>
  );
}
