"use client";

import { useSetTasks } from "@/app/state/tasks-atom";
import type { Task } from "@/domain/Task";
import {
  type UploadDataItem,
  UploadForm,
} from "@/features/tasks/components/upload-form";

interface TaskCsvImportProps {
  onImport?: (tasks: Task[]) => void;
}

export function TaskCsvImport(_props: TaskCsvImportProps) {
  const _setTasks = useSetTasks();

  const handleUploadData = (data: UploadDataItem[]) => {
    const _nextTasks = data.map((item) => ({
      ...item,
      distribution: "uniform" as const,
    }));
    // TODO: FIX
    //    setTasks(nextTasks);
    //    onImport?.(nextTasks);
  };

  return <UploadForm onData={handleUploadData} />;
}
