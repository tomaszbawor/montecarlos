// hooks/useTasks.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface Task {
  name: string;
  distribution: string;
  min: number;
  max: number;
}

const TASKS_KEY = ["tasks"];

// Read tasks from the query cache
export function useTasks() {
  const { data = [] } = useQuery<Task[]>({
    queryKey: TASKS_KEY,
    queryFn: async () => {
      // For local/pure client usage, there's no "real" fetch.
      // Return an empty array if there's nothing in local storage
      // This data will be replaced by the persisted cache once rehydrated.
      return [];
    },
    initialData: [],
  });

  return data;
}

// Update tasks in the query cache
export function useSetTasks() {
  const queryClient = useQueryClient();
  return (newTasks: Task[]) => {
    queryClient.setQueryData(TASKS_KEY, newTasks);
  };
}
