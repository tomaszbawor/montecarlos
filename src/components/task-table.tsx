"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/app/lib/monte-carlo";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task, index: number) => void;
  onRemove: (index: number) => void;
}

export function TaskTable({ tasks, onEdit, onRemove }: TaskTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Min</TableHead>
          <TableHead>Max</TableHead>
          <TableHead>Distribution</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task, index) => (
          <TableRow key={index}>
            <TableCell>{task.name}</TableCell>
            <TableCell>{task.min}</TableCell>
            <TableCell>{task.max}</TableCell>
            <TableCell>{task.distribution}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(task, index)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  Remove
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
