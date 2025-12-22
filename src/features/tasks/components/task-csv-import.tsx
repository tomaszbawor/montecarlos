"use client";

import type { Task } from "@/domain/Task";
import {
  type UploadDataItem,
  UploadForm,
} from "@/features/tasks/components/upload-form";
import { useSetTasks } from "@/state/tasks-atom";

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
