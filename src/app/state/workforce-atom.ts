import { Atom } from "@effect-atom/atom";
import { useAtomSet, useAtomValue } from "@effect-atom/atom-react/Hooks";
import { Schema } from "effect";
import { WorkforceSchema } from "@/domain/Workforce";
import { atomRuntime } from "./atom-runtime";

export const workforceState = Atom.kvs({
  runtime: atomRuntime,
  key: "workforce",
  schema: Schema.Array(WorkforceSchema),
  defaultValue: () => [],
});

export function useWorkforce() {
  return useAtomValue(workforceState);
}

export function useSetWorkforce() {
  return useAtomSet(workforceState);
}
