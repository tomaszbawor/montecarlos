// hooks/useTasks.ts
"use client";

import { useAtomSet, useAtomValue } from "@effect-atom/atom-react/Hooks";
import { useEffect, useRef } from "react";
import type { Task } from "@/app/lib/monte-carlo";
import { tasksAtom } from "@/app/state/tasks-atom";

const STORAGE_KEY = "montecarlos.tasks.v1";

export function useTasks() {
  const tasks = useAtomValue(tasksAtom);
  const setTasks = useAtomSet(tasksAtom);
  const hasHydrated = useRef(false);
  const pendingHydrationValue = useRef<Task[] | null>(null);

  useEffect(() => {
    if (hasHydrated.current || pendingHydrationValue.current) return;
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      hasHydrated.current = true;
      return;
    }
    try {
      const parsed = JSON.parse(stored) as Task[];
      pendingHydrationValue.current = parsed;
      setTasks(parsed);
    } catch {
      hasHydrated.current = true;
    }
  }, [setTasks]);

  useEffect(() => {
    if (!hasHydrated.current) {
      if (
        pendingHydrationValue.current &&
        pendingHydrationValue.current === tasks
      ) {
        pendingHydrationValue.current = null;
        hasHydrated.current = true;
      } else if (!pendingHydrationValue.current) {
        hasHydrated.current = true;
      } else {
        return;
      }
    }

    if (typeof window === "undefined") return;
    if (!hasHydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  return tasks;
}

export function useSetTasks() {
  return useAtomSet(tasksAtom);
}

export type { Task };
