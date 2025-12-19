"use client";

import type { Task } from "@/app/hooks/useTasks";
import { useSetTasks } from "@/app/hooks/useTasks";
import {
  type UploadDataItem,
  UploadForm,
} from "@/features/tasks/components/upload-form";

interface TaskCsvImportProps {
  onImport?: (tasks: Task[]) => void;
}

export function TaskCsvImport({ onImport }: TaskCsvImportProps) {
  const setTasks = useSetTasks();

  const handleUploadData = (data: UploadDataItem[]) => {
    const nextTasks = data.map((item) => ({
      ...item,
      distribution: "uniform" as const,
    }));

    setTasks(nextTasks);
    onImport?.(nextTasks);
  };

  return <UploadForm onData={handleUploadData} />;
}
