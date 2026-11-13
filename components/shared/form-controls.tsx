"use client";

import type { ReactNode } from "react";
import { cn } from "cn";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface SliderFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  hint?: ReactNode;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function SliderField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  hint,
  onChange,
  disabled = false,
}: SliderFieldProps) {
  const labelId = `${id}-label`;

  function handleInputChange(nextValue: string) {
    const parsed = Number(nextValue);

    if (!Number.isFinite(parsed)) {
      return;
    }

    onChange(Math.min(max, Math.max(min, Math.round(parsed))));
  }

  return (
    <div className={cn("space-y-3", disabled && "opacity-60")}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <Label id={labelId} htmlFor={id} className="text-sm font-medium">
            {label}
          </Label>
          {hint ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) => handleInputChange(event.target.value)}
          className="h-8 w-[4.5rem] shrink-0 text-right font-mono text-sm tabular-nums"
        />
      </div>

      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-labelledby={labelId}
        onValueChange={(nextValue) => {
          const resolved = Array.isArray(nextValue)
            ? nextValue[0]
            : nextValue;

          onChange(Math.round(resolved));
        }}
        className="[&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-muted/80 [&_[data-slot=slider-range]]:bg-[linear-gradient(90deg,var(--brand-2),var(--brand))] [&_[data-slot=slider-thumb]]:size-3.5"
      />

      <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground/70">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

interface CharsetOptionProps {
  id: string;
  label: string;
  sample: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CharsetOption({
  id,
  label,
  sample,
  checked,
  onCheckedChange,
  disabled = false,
}: CharsetOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-background/40 px-3 py-2.5 transition-colors",
        "hover:border-border hover:bg-muted/40",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30",
        checked && "border-brand/30 bg-brand/[0.06]",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked)}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium leading-tight text-foreground">
          {label}
        </span>
        <span className="mt-0.5 font-mono text-[0.65rem] text-muted-foreground">
          {sample}
        </span>
      </span>
    </label>
  );
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: ToggleRowProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/30 px-3.5 py-3 transition-colors",
        "hover:bg-muted/30",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium leading-tight text-foreground">
          {label}
        </span>
        <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked)}
      />
    </label>
  );
}
