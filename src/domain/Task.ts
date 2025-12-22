import { Effect, Schema } from "effect";
import type { EffectfullDistribution } from "@/lib/distribution/Distribution";
export const TaskSchema = Schema.Struct({
  id: Schema.UUID,
  title: Schema.String,
  minEstimate: Schema.Number,
  maxEstimate: Schema.Number,
  meanEstimate: Schema.optional(Schema.Number),
});

export interface Task extends Schema.Schema.Type<typeof TaskSchema> {}

export const calculateTaskEffort = (task: Task, dist: EffectfullDistribution) =>
  Effect.gen(function* () {
    return yield* dist.calculate(dist.paramsFromTask(task));
  });
