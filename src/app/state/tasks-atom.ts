import { BrowserKeyValueStore } from "@effect/platform-browser";
import * as Atom from "@effect-atom/atom/Atom";
import { useAtomSet, useAtomValue } from "@effect-atom/atom-react/Hooks";
import { Schema } from "effect";
import { TaskSchema } from "@/domain/Task";

const runtime = Atom.runtime(BrowserKeyValueStore.layerLocalStorage);

export const tasksState = Atom.kvs({
  runtime: runtime,
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
