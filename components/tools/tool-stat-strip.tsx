import { cn } from "cn";

interface ToolStatStripProps {
  items: Array<{ label: string; value: string; tone?: "default" | "success" | "brand" }>;
  className?: string;
}

const TONE_CLASSES = {
  default: "text-foreground",
  success: "text-success",
  brand: "text-brand",
} as const;

export function ToolStatStrip({ items, className }: ToolStatStripProps) {
  return (
    <dl
      className={cn(
        "grid gap-2 rounded-xl border border-border/70 bg-background/40 p-3 sm:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {item.label}
          </dt>
          <dd
            className={cn(
              "mt-1 truncate font-mono text-xs tabular-nums",
              TONE_CLASSES[item.tone ?? "default"],
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
