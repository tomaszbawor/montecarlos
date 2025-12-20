"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { runMonteCarlo } from "@/app/lib/monte-carlo";
import { useSetTasks, useTasks } from "@/app/state/tasks-atom";
import { Button } from "@/components/ui/button";
import type { Task } from "@/domain/Task";
import { SimulationResult } from "@/features/simulation/components/simulation-result";
import { TaskCsvImport } from "@/features/tasks/components/task-csv-import";
import { TaskModal } from "@/features/tasks/components/task-modal";
import { TaskTable } from "@/features/tasks/components/task-table";

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

const ITERATION_AMOUNT = 100_000;

export default function HomePage() {
  const tasks = useTasks();
  const setTasks = useSetTasks();

  // init at start with one task only if no tasks are present (e.g., first visit)
  useEffect(() => {
    if (tasks.length === 0) {
      setTasks([
        {
          id: v4(),
          title: "Test",
          minEstimate: 1,
          maxEstimate: 4,
        },
      ]);
    }
  }, [setTasks, tasks.length]);

  // -------------------------------------------------------------------
  //  Local state for editing tasks
  // -------------------------------------------------------------------
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);

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
      closeModal();
    } else {
      // Adding a new task
      setTasks([...tasks, newTask]);
    }
  }

  function handleRemoveTask(index: number) {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  }

  function handleEditTask(_: Task, index: number) {
    openModal(index);
  }

  // -------------------------------------------------------------------
  //  Monte Carlo Simulation
  // -------------------------------------------------------------------
  function handleSimulate() {
    if (tasks.length === 0) return;
    const results = runMonteCarlo(tasks, ITERATION_AMOUNT);
    setSimulationData(results);
  }

  const clearAllTasks = () => {
    setTasks([]);
    setSimulationData([]);
  };

  function openModal(taskIndex?: number) {
    if (typeof taskIndex === "number") {
      setEditingTaskIndex(taskIndex);
    } else {
      setEditingTaskIndex(null);
    }
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingTaskIndex(null);
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Monte Carlo Task Estimation
      </h1>
      <div className="flex flex-row gap-4 justify-center">
        <TaskCsvImport />
        <Button disabled={tasks.length === 0} onClick={clearAllTasks}>
          Clear All Tasks
        </Button>
      </div>

      {tasks.length > 0 && (
        <div className="flex flex-row justify-center">
          <Button onClick={handleSimulate}>Run Monte Carlo Simulation</Button>
        </div>
      )}

      <div className="flex flex-row gap-4 justify-around">
        <TaskModal
          isOpen={modalIsOpen}
          initialTask={
            editingTaskIndex !== null ? tasks[editingTaskIndex] : undefined
          }
          taskIndex={editingTaskIndex ?? undefined}
          onSubmit={handleSubmitTask}
          onClose={closeModal}
        />
      </div>

      {simulationData.length > 0 && (
        <SimulationResult simulationData={simulationData} />
      )}

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

      <div className="flex justify-center">
        <Button onClick={() => openModal()}>Add Task</Button>
      </div>
    </div>
  );
}
