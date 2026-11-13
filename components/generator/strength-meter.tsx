import { cn } from "cn";

import type { EntropyEstimate, StrengthLabel } from "@/types/crypto";
import { formatEntropy } from "@/lib/crypto/entropy";

const TONE: Record<
  StrengthLabel,
  { text: string; bar: string; dot: string }
> = {
  "Very weak": {
    text: "text-destructive",
    bar: "bg-destructive",
    dot: "bg-destructive",
  },
  Weak: {
    text: "text-destructive",
    bar: "bg-destructive/80",
    dot: "bg-destructive/80",
  },
  Fair: {
    text: "text-warning",
    bar: "bg-warning",
    dot: "bg-warning",
  },
  Strong: {
    text: "text-success",
    bar: "bg-success",
    dot: "bg-success",
  },
  "Very strong": {
    text: "text-success",
    bar: "bg-[linear-gradient(90deg,var(--success),var(--brand-2))]",
    dot: "bg-brand-2",
  },
  Excellent: {
    text: "text-brand",
    bar: "bg-[linear-gradient(90deg,var(--brand-2),var(--brand),var(--brand-3))]",
    dot: "bg-brand",
  },
};

interface StrengthMeterProps {
  entropy: EntropyEstimate;
  className?: string;
}

export function StrengthMeter({ entropy, className }: StrengthMeterProps) {
  const tone = TONE[entropy.label];

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-background/40 p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Estimated strength
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs font-semibold",
            tone.text,
          )}
        >
          <span className={cn("size-1.5 rounded-full", tone.dot)} />
          {entropy.label}
        </span>
      </div>

      <div
        role="meter"
        aria-label="Estimated secret strength"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={entropy.score}
        aria-valuetext={`${entropy.label}, ${formatEntropy(entropy.bits)} of entropy`}
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            tone.bar,
          )}
          style={{ width: `${Math.max(entropy.score, 2)}%` }}
        />
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[0.65rem] text-muted-foreground">
        <span className="tabular-nums">{formatEntropy(entropy.bits)}</span>
        <span className="tabular-nums">{entropy.poolSize} char pool</span>
      </div>
    </div>
  );
}
