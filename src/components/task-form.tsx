// components/task-form.tsx

"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/app/lib/monte-carlo";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [name, setName] = useState("");
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("3");
  const [distribution, setDistribution] = useState("uniform");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newTask: Task = {
      name,
      distribution,
      min: parseFloat(min),
      max: parseFloat(max),
    };
    onAddTask(newTask);
    // Reset form
    setName("");
    setMin("1");
    setMax("3");
    setDistribution("uniform");
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
            <SelectValue placeholder="Select a distribution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uniform">Uniform</SelectItem>
            <SelectItem value="triangular">Triangular</SelectItem>
            {/* Add more distributions if desired */}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  );
}
