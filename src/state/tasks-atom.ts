import * as Atom from "@effect-atom/atom/Atom";
import { useAtomSet, useAtomValue } from "@effect-atom/atom-react/Hooks";
import { Schema } from "effect";
import { TaskSchema } from "@/domain/Task";
import { atomRuntime } from "./atom-runtime";

export const tasksState = Atom.kvs({
  runtime: atomRuntime,
  key: "jira-tasks",
  schema: Schema.Array(TaskSchema),
  defaultValue: () => [],
});

export function useTasks() {
  return useAtomValue(tasksState);
}

export function useSetTasks() {
  return useAtomSet(tasksState);
}
