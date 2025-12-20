// components/task-form.tsx

"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Task } from "@/domain/Task";

interface TaskFormProps {
  mode: "create" | "edit";
  initialTask?: Task;
  taskIndex?: number;
  onSubmit: (task: Task, index?: number) => void;
  onCancel?: () => void;
}

export function TaskForm({
  mode,
  initialTask,
  taskIndex,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  // Local form state
  const [name, setName] = useState("");
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("3");
  const [mean, setMean] = useState("2");

  // Pre-fill if editing
  useEffect(() => {
    if (initialTask) {
      setName(initialTask.title);
      setMin(initialTask.minEstimate.toString());
      setMax(initialTask.maxEstimate.toString());
      setMean(initialTask.meanEstimate?.toString() ?? "2");
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      id: v4(),
      title: name,
      minEstimate: Number.parseFloat(min),
      maxEstimate: Number.parseFloat(max),
      meanEstimate: Number.parseFloat(mean),
    };
    onSubmit(newTask, taskIndex);
    // Optionally reset if in create mode
    if (mode === "create") {
      setName("");
      setMin("1");
      setMax("3");
      setMean("2");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-md max-w-md"
    >
      <div>
        <Label htmlFor="taskName">Task Name</Label>
        <Input
          id="taskName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Implement login flow"
        />
      </div>
      <div>
        <Label htmlFor="minTime">Min Time</Label>
        <Input
          id="minTime"
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="maxTime">Max Time</Label>
        <Input
          id="maxTime"
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="meanTime">Mean Time</Label>
        <Input
          id="meanTime"
          type="number"
          value={mean}
          onChange={(e) => setMean(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {mode === "create" ? "Add Task" : "Save Changes"}
        </Button>
        {mode === "edit" && onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
