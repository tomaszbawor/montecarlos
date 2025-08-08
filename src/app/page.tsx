"use client";

import React, { useState } from "react";

// --- React Query Tasks Hooks ---
import { Task, useSetTasks, useTasks } from "@/app/hooks/useTasks";

// --- UI Components for tasks ---
import { TaskForm } from "@/components/task-form";
import { TaskTable } from "@/components/task-table";
import { UploadDataItem, UploadForm } from '@/components/upload-form'

// --- Monte Carlo logic ---
import { runMonteCarlo } from "@/app/lib/monte-carlo";

// --- shadcn/ui components ---
import { Button } from "@/components/ui/button";
import Modal from 'react-modal';

// --- Chart.js + annotation plugin ---
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, } from "chart.js";
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

Modal.setAppElement('body');

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '490px',
    marginRight: '-30%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function HomePage() {
  // -------------------------------------------------------------------
  //  React Query: get and set tasks (persisted in localStorage)
  // -------------------------------------------------------------------
  const tasks = useTasks(); // read tasks from the React Query cache
  const setTasks = useSetTasks(); // update tasks in the React Query cache

  // -------------------------------------------------------------------
  //  Local state for editing tasks
  // -------------------------------------------------------------------
  const [taskEdited, setTaskEdited] = useState<Task | null>(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);

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

  function handleEditTask(task: Task) {
    openModal(task);
  }

  function handleCancelEdit() {
    closeModal();
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

  const clearAllTasks = () => {
    setTasks([])
    setSimulationData([])
  }

  function openModal(task?: Task) {
    if (task) setTaskEdited(task);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setTaskEdited(null);
  }

  // -------------------------------------------------------------------
  //  Render the entire UI
  // -------------------------------------------------------------------
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">Monte Carlo Task Estimation</h1>
      <div className="flex flex-row gap-4 justify-center">
        <UploadForm onData={handleUploadData}/>
        <Button disabled={tasks.length === 0} onClick={clearAllTasks}>Clear All Tasks</Button>
      </div>

      {tasks.length > 0 && <div className="flex flex-row justify-center">
          <Button onClick={handleSimulate}>
              Run Monte Carlo Simulation
          </Button>
      </div>}

      <div className="flex flex-row gap-4 justify-around">
        <Modal
          isOpen={modalIsOpen}
          style={modalStyles}
          onRequestClose={closeModal}
          contentLabel="Add/Edit Task"
        >
          <TaskForm
              mode={taskEdited ? "edit" : "create"}
              initialTask={taskEdited || undefined}
              taskIndex={taskEdited ? tasks.indexOf(taskEdited) : undefined}
              onSubmit={handleSubmitTask}
              onCancel={handleCancelEdit}
          />
        </Modal>
      </div>

      {simulationData.length > 0 && (
        <SimulationResult simulationData={simulationData}/>
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

    </div>
  );
}
