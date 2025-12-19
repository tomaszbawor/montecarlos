import { Schema } from "effect";
export const TaskSchema = Schema.Struct({
  id: Schema.UUID,
  title: Schema.String,
  minEstimate: Schema.Number,
  maxEstimate: Schema.Number,
});

export type Task = typeof TaskSchema.Type;
