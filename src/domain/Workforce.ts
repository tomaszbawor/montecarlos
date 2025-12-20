import { Schema } from "effect";

export const WorkforceSchema = Schema.Struct({
  developerIdentifier: Schema.String,
  sickLeaveMinWeeks: Schema.NonNegativeInt,
  sickLeaveMaxWeeks: Schema.NonNegativeInt,
  engagementMinPercentage: Schema.Number.pipe(Schema.between(0.0, 0.99)),
  engagementMaxPercentage: Schema.Number.pipe(Schema.between(0.01, 1.0)),
  vacationDays: Schema.NonNegativeInt,
});

export interface Workforce extends Schema.Schema.Type<typeof WorkforceSchema> {}

export const ProjectTimelineSchema = Schema.Struct({
  startDate: Schema.Date,
  endDate: Schema.Date,
});

export interface ProjectTimeline
  extends Schema.Schema.Type<typeof ProjectTimelineSchema> {}

export const calculateWorkforceEgagement = (_wf: Workforce): number => {
  // TODO: Implement
  // sample how many sick days
  // sample vacationDays

  return 1;
};
