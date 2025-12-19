import { Schema } from "effect";

export const WorkforceSchema = Schema.Struct({
  developerIdentifier: Schema.String,
  sickLeaveMinWeeks: Schema.NonNegativeInt,
  sickLeaveMaxWeeks: Schema.NonNegativeInt,
  engagementMinPercentage: Schema.Number.pipe(Schema.between(0.01, 0.99)),
  engagementMaxPercentage: Schema.Number.pipe(Schema.between(0.01, 0.99)),
  vacationDays: Schema.NonNegativeInt,
});

export interface Workforce extends Schema.Schema.Type<typeof WorkforceSchema> {}
