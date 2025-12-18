"use client";

import { RegistryProvider } from "@effect-atom/atom-react/RegistryContext";
import type React from "react";

export function AtomProvider({ children }: { children: React.ReactNode }) {
  return <RegistryProvider>{children}</RegistryProvider>;
}
