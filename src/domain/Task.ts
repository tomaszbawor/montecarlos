import { Schema } from "effect";
export const TaskSchema = Schema.Struct({
  id: Schema.UUID,
  title: Schema.String,
  minEstimate: Schema.Number,
  maxEstimate: Schema.Number,
});

export interface Task extends Schema.Schema.Type<typeof TaskSchema> {}

// const Task = typeof TaskSchema.Type;
//
