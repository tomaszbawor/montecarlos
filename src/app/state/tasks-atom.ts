import * as Atom from "@effect-atom/atom/Atom";
import { globalValue } from "effect/GlobalValue";
import type { Task } from "@/app/lib/monte-carlo";

export const tasksState = Atom.make<Task[]>([]).pipe(Atom.keepAlive);
