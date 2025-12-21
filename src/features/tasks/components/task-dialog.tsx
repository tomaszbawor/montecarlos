import { Effect, Schema } from "effect";
import { useState } from "react";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Task, TaskSchema } from "@/domain/Task";

export interface TaskDialogProps {
  task?: Task;
  onSave: (task: Task) => void;
  isDialogOpen: boolean;
  onOpenChange: (state: boolean) => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  task,
  onSave,
  isDialogOpen,
  onOpenChange,
}: TaskDialogProps) => {
  const [title, setTitle] = useState(task?.title ?? "");
  const [minEstimate, setMinEstimate] = useState(task?.minEstimate ?? 1);
  const [meanEstimate, setMeanEstimate] = useState(task?.meanEstimate ?? 2);
  const [maxEstimate, setMaxEstimate] = useState(task?.maxEstimate ?? 3);

  const trySave = () => {
    const id = task?.id ?? v4();

    const taskToSave = Effect.runSync(
      Schema.validate(TaskSchema)({
        id,
        title,
        minEstimate,
        meanEstimate,
        maxEstimate,
      }),
    );

    onSave(taskToSave);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Editor</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              defaultValue="Task"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="min">Min</Label>
            <Input
              id="min"
              value={minEstimate}
              onChange={(e) => {
                setMinEstimate(e.target.valueAsNumber);
              }}
              name="min"
              type="number"
              defaultValue="1"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="mean">Mean</Label>
            <Input
              value={meanEstimate}
              onChange={(e) => {
                setMeanEstimate(e.target.valueAsNumber);
              }}
              id="mean"
              name="mean"
              defaultValue="1"
              type="number"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="max">Max</Label>
            <Input
              id="max"
              value={maxEstimate}
              onChange={(e) => {
                setMaxEstimate(e.target.valueAsNumber);
              }}
              name="max"
              type="number"
              defaultValue="5"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => trySave()}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
