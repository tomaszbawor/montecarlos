import { Schema } from "effect";
import type { Distribution } from "@/lib/distribution/Distribution";
export const TaskSchema = Schema.Struct({
  id: Schema.UUID,
  title: Schema.String,
  minEstimate: Schema.Number,
  maxEstimate: Schema.Number,
  meanEstimate: Schema.optional(Schema.Number),
});

export interface Task extends Schema.Schema.Type<typeof TaskSchema> {}

export const calculateTaskEffort = (task: Task, dist: Distribution) => {
  return dist.calculateDistribution(dist.paramsFromTask(task));
};
