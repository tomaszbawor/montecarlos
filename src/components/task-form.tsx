// components/task-form.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Task } from "@/app/hooks/useTasks";

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
  const [distribution, setDistribution] = useState("uniform");

  // Pre-fill if editing
  useEffect(() => {
    if (initialTask) {
      setName(initialTask.name);
      setMin(initialTask.min.toString());
      setMax(initialTask.max.toString());
      setDistribution(initialTask.distribution);
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      name,
      min: parseFloat(min),
      max: parseFloat(max),
      distribution,
    };
    onSubmit(newTask, taskIndex);
    // Optionally reset if in create mode
    if (mode === "create") {
      setName("");
      setMin("1");
      setMax("3");
      setDistribution("uniform");
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
        <Label>Distribution</Label>
        <Select value={distribution} onValueChange={setDistribution}>
          <SelectTrigger>
            <SelectValue placeholder="Select a distribution"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uniform">Uniform</SelectItem>
            <SelectItem value="triangular">Triangular</SelectItem>
            {/* Add more distributions if desired */}
          </SelectContent>
        </Select>
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
