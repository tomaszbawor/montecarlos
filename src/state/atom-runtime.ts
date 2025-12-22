import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Atom } from "@effect-atom/atom";
import { Random } from "effect";

export const atomRuntime = Atom.runtime(BrowserKeyValueStore.layerLocalStorage);
export const RandomService = Random.make("seed");
