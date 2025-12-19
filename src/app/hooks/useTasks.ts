"use client";

import { useAtomSet, useAtomValue } from "@effect-atom/atom-react/Hooks";
import type { Task } from "@/app/lib/monte-carlo";
import { tasksState } from "@/app/state/tasks-atom";

export function useTasks() {
  return useAtomValue(tasksState);
}

export function useSetTasks() {
  return useAtomSet(tasksState);
}

export type { Task };
