"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { DistributionParameterControl } from "@/lib/distribution/registry";

export function DistributionParameterControls({
  controls,
  values,
  onChange,
}: {
  controls: readonly DistributionParameterControl[];
  values: Record<string, number | undefined>;
  onChange: (key: string, value: number) => void;
}) {
  return (
    <div className="grid gap-4">
      {controls.map((control) => {
        const value = values[control.key];
        const id = `param-${control.key}`;

        if (control.kind === "slider") {
          const current = value ?? control.min;
          return (
            <div key={control.key} className="grid gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor={id}>{control.label}</Label>
                <div className="text-xs tabular-nums text-muted-foreground">
                  {current.toFixed(2)}
                </div>
              </div>
              <Slider
                id={id}
                value={[current]}
                min={control.min}
                max={control.max}
                step={control.step ?? 0.1}
                onValueChange={(v) => onChange(control.key, v[0] ?? current)}
              />
            </div>
          );
        }

        return (
          <div key={control.key} className="grid gap-2">
            <Label htmlFor={id}>{control.label}</Label>
            <Input
              id={id}
              inputMode="decimal"
              type="number"
              value={Number.isFinite(value) ? String(value) : ""}
              step={control.step ?? 1}
              min={control.min}
              max={control.max}
              onChange={(e) => {
                const next = Number.parseFloat(e.target.value);
                onChange(control.key, next);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
