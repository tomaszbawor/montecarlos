"use client";

import React, { useState } from "react";

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
import { SimulationResult } from "@/components/simulation-result";

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

const ITERATION_AMOUNT = 20000;

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
    const results = runMonteCarlo(tasks, ITERATION_AMOUNT);
    setSimulationData(results);
  }

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
      <div className="grid grid-cols-2 gap-4 w-72 place-self-center">
        <UploadForm onData={handleUploadData} />
        <Button disabled={tasks.length === 0} onClick={() => setTasks([])}>Clear All Tasks</Button>
      </div>

      {tasks.length > 0 && <div className="flex flex-row justify-center">
        <Button onClick={handleSimulate}>
           Run Monte Carlo Simulation
        </Button>
      </div>}

      {isEditing && <TaskForm
        mode={isEditing ? "edit" : "create"}
        initialTask={taskBeingEdited}
        taskIndex={isEditing ? editIndex! : undefined}
        onSubmit={handleSubmitTask}
        onCancel={handleCancelEdit}
      />}

      {tasks.length > 0 && (
          <>
            <h3 className="text-xl font-bold text-center">List of tasks</h3>
            <TaskTable
              tasks={tasks}
              onEdit={handleEditTask}
              onRemove={handleRemoveTask}
            />
          </>
      )}

      {simulationData.length > 0 && (
        <SimulationResult simulationData={simulationData} />
      )}
    </div>
  );
}
