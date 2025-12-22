"use client";

import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Workforce } from "@/domain/Workforce";
import { WorkforceDialog } from "@/features/worforce/workforce-dialog";
import { useSetWorkforce, useWorkforce } from "@/state/workforce-atom";

export default function WorkforcePage() {
  const workforce = useWorkforce();
  const setWorkforce = useSetWorkforce();

  const [editedWorker, setEditedWorker] = useState<Workforce | undefined>(
    undefined,
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onDialogStatusChange = (newIsOpen: boolean) => {
    if (!newIsOpen) {
      setEditedWorker(undefined);
    }

    setIsDialogOpen(newIsOpen);
  };

  useEffect(() => {
    if (workforce.length === 0) {
      const exampleWorkforce: Workforce = {
        id: v4(),
        developerIdentifier: "John Doe",
        engagementMinPercentage: 0.4,
        engagementMaxPercentage: 0.9,
        vacationDays: 10,
      };
      setWorkforce([exampleWorkforce]);
    }
  });

  const onEdit = (id: string) => {
    setEditedWorker(workforce.find((wf) => wf.id === id));
    setIsDialogOpen(true);
  };

  const onRemove = (id: string) => {
    console.log("Deleting workforce with id: ", id);
    setWorkforce(workforce.filter((wf) => wf.id !== id));
  };

  const onSave = (newWorker: Workforce) => {
    console.log("Saving workforce", newWorker);

    const workers = workforce.filter((worker) => worker.id !== newWorker.id);

    setWorkforce([...workers, newWorker]);
    setEditedWorker(undefined);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="text-xl text-center">Workforce Management</div>

      {isDialogOpen && (
        <WorkforceDialog
          workforce={editedWorker}
          isDialogOpen={isDialogOpen}
          onOpenChange={onDialogStatusChange}
          onSave={onSave}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Engagement Min</TableHead>
            <TableHead>Engagement Max</TableHead>
            <TableHead>Vacations Days Left</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workforce.map((worker) => (
            <TableRow key={worker.id}>
              <TableCell>{worker.developerIdentifier}</TableCell>
              <TableCell>{worker.engagementMinPercentage}</TableCell>
              <TableCell>{worker.engagementMaxPercentage}</TableCell>
              <TableCell>{worker.vacationDays}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(worker.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(worker.id)}
                  >
                    Remove
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Button
          onClick={() => {
            setIsDialogOpen(!isDialogOpen);
          }}
        >
          Create New Worker
        </Button>
      </div>
    </div>
  );
}
