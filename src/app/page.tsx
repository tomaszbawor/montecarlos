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
import { Button } from "@/components/ui/button";
import type { Task } from "@/domain/Task";
import { SimulationResult } from "@/features/simulation/components/simulation-result";
import { TaskDialog } from "@/features/tasks/components/task-dialog";
import { TaskTable } from "@/features/tasks/components/task-table";
import { runMonteCarlo } from "@/lib/monte-carlo";
import { useSetTasks, useTasks } from "@/state/tasks-atom";

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEditedTask, setCurrentEditedTask] = useState<Task | undefined>(
    undefined,
  );

  const onOpenChange = (isDialogOpen: boolean) => {
    if (!isDialogOpen) {
      // clean on closing
      setCurrentEditedTask(undefined);
    }

    // clearing if closing
    setIsDialogOpen(isDialogOpen);
  };

  const onTaskSave = (newTask: Task) => {
    const tasksWithoutEdited = tasks.filter((t) => t.id !== newTask.id);
    setTasks([...tasksWithoutEdited, newTask]);

    setIsDialogOpen(false);
    setCurrentEditedTask(undefined);
  };

  const handleEditTask = (taskId: Task["id"]) => {
    const taskToEdit = tasks.find((t) => t.id === taskId);

    setCurrentEditedTask(taskToEdit);
    setIsDialogOpen(true);
  };

  const handleRemoveTask = (taskId: Task["id"]) => {
    const newTaskList = tasks.filter((task) => task.id !== taskId);
    setTasks(newTaskList);
    console.log("Removing task...");
  };

  // -------------------------------------------------------------------
  //  Local state for simulation results + confidence slider
  // -------------------------------------------------------------------
  const [simulationData, setSimulationData] = useState<number[]>([]);

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

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Monte Carlo Task Estimation
      </h1>
      <div className="flex flex-row gap-4 justify-center">
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
        {isDialogOpen && (
          <TaskDialog
            task={currentEditedTask}
            isDialogOpen={isDialogOpen}
            onSave={onTaskSave}
            onOpenChange={onOpenChange}
          />
        )}
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
        <Button onClick={() => setIsDialogOpen(true)}>Add Task</Button>
      </div>
    </div>
  );
}
