// hooks/useTasks.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { todo } from "node:test";

// We'll store tasks under this cache key
const TASKS_KEY = ["tasks"];

export interface Task {
  name: string;
  distribution: string;
  min: number;
  max: number;
}

export function useTasks() {
  // This fetcher is local-only. We aren't calling an API,
  // so we just return an empty array as the "base" data.
  // The persisted cache will replace it after hydration.
  const { data = [] } = useQuery<Task[]>({
    queryKey: TASKS_KEY,
    queryFn: () => {
      useQueryClient().getQueryData(TASKS_KEY);
    },
  });
  return data;
}

export function useSetTasks() {
  const queryClient = useQueryClient();

  // We expose a function to update tasks in the React Query cache
  return (newTasks: Task[]) => {
    queryClient.setQueryData(TASKS_KEY, newTasks);
  };
}
