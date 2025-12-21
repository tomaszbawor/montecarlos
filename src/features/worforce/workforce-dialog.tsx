"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { Effect, Schema } from "effect";
import { useState } from "react";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Workforce, WorkforceSchema } from "@/domain/Workforce";

export interface WorkforceDialogProps {
  workforce?: Workforce;
  onSave: (wf: Workforce) => void;
  isDialogOpen: boolean;
  onOpenChange: (state: boolean) => void;
}
export const WorkforceDialog: React.FC<WorkforceDialogProps> = ({
  workforce,
  isDialogOpen,
  onOpenChange,
  onSave,
}) => {
  const [name, setName] = useState(
    workforce?.developerIdentifier ?? "John Doe",
  );
  const [minEngagement, setMinEngagement] = useState(
    workforce?.engagementMinPercentage ?? 0.4,
  );
  const [maxEngagement, setMaxEngagement] = useState(
    workforce?.engagementMaxPercentage ?? 0.9,
  );
  const [vacationDays, setVacationDays] = useState(
    workforce?.vacationDays ?? 0,
  );

  const trySave = () => {
    console.log("Iam tryign to save stufff");

    const id: string = workforce?.id ?? v4();

    //TODO: Handle Errors with parsing and show them on UI

    const workerToSave = Effect.runSync(
      Schema.validate(WorkforceSchema)({
        id,
        developerIdentifier: name,
        engagementMinPercentage: minEngagement,
        engagementMaxPercentage: maxEngagement,
        vacationDays,
      }),
    );

    onSave(workerToSave);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Worker Editor</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              defaultValue="John Doe"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="minEngagement">Min Engagement</Label>
            <Input
              id="minEngagement"
              value={minEngagement}
              onChange={(e) => {
                setMinEngagement(e.target.valueAsNumber);
              }}
              name="minEngagement"
              type="number"
              defaultValue="0.40"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="username-1">Max Engagement</Label>
            <Input
              id="maxEngagement"
              value={maxEngagement}
              onChange={(e) => {
                setMaxEngagement(e.target.valueAsNumber);
              }}
              name="maxEngagement"
              type="number"
              defaultValue="0.90"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="vacDays">Vacation Days</Label>
            <Input
              value={vacationDays}
              onChange={(e) => {
                setVacationDays(e.target.valueAsNumber);
              }}
              id="vacDays"
              name="vacDays"
              defaultValue="1"
              type="number"
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
