import type { ComponentType, ReactNode } from "react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";

interface ToolShellProps {
  icon: ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  title: string;
  description: string;
  children: ReactNode;
  accent?: "brand" | "brand-2" | "brand-3";
}

const ACCENT_CLASSES = {
  brand: "border-brand/25 bg-brand/10 text-brand",
  "brand-2": "border-brand-2/25 bg-brand-2/10 text-brand-2",
  "brand-3": "border-brand-3/25 bg-brand-3/10 text-brand-3",
} as const;

export function ToolShell({
  icon: Icon,
  title,
  description,
  children,
  accent = "brand",
}: ToolShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl border",
              ACCENT_CLASSES[accent],
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 max-w-xl text-pretty text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {description}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="h-6 shrink-0 gap-1.5 rounded-full border-success/25 bg-success/[0.06] px-2.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-success"
        >
          <span className="size-1.5 rounded-full bg-success" />
          Local only
        </Badge>
      </div>

      {children}
    </div>
  );
}
