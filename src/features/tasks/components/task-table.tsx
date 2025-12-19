"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Task } from "@/domain/Task";

interface TaskTableProps {
  tasks: readonly Task[];
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
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task, index) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.minEstimate}</TableCell>
            <TableCell>{task.maxEstimate}</TableCell>
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
