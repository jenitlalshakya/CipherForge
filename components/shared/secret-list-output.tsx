"use client";

import type { ReactNode } from "react";
import { Copy, Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { maskValue } from "@/lib/utils/format";

interface SecretListOutputProps {
  values: string[];
  label: string;
  placeholder?: string;
  copyIdPrefix: string;
  visible?: boolean;
  onToggleVisibility?: () => void;
  meta?: ReactNode;
  className?: string;
}

export function SecretListOutput({
  values,
  label,
  placeholder = "Nothing generated yet.",
  copyIdPrefix,
  visible = true,
  onToggleVisibility,
  meta,
  className,
}: SecretListOutputProps) {
  const { copy, isCopied } = useCopyFeedback();
  const count = values.length;

  function handleCopyAll() {
    if (count === 0) {
      return;
    }

    void copy(values.join("\n"), {
      id: `${copyIdPrefix}-all`,
      label:
        count === 1
          ? `${label} copied to clipboard`
          : `${count} values copied to clipboard`,
    });
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-background/55",
        className,
      )}
    >
      <div className="flex min-h-9 flex-wrap items-center justify-between gap-2 border-b border-border/60 px-3.5 py-1.5">
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <div className="flex items-center gap-1">
          {meta}
          {onToggleVisibility ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onToggleVisibility}
              aria-label={visible ? "Hide values" : "Show values"}
              className="rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {visible ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="p-3.5 sm:p-4">
        {count === 0 ? (
          <div className="flex min-h-20 items-center">
            <code className="select-none text-sm text-muted-foreground">
              {placeholder}
            </code>
          </div>
        ) : (
          <ol
            className={cn(
              "scrollbar-thin space-y-2 pr-1",
              count > 5 && "max-h-72 overflow-y-auto",
            )}
            aria-label={label}
          >
            {values.map((value, index) => (
              <li
                key={`${index}-${value}`}
                className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/45 px-2.5 py-2"
              >
                {count > 1 ? (
                  <span className="grid size-5 shrink-0 place-items-center rounded bg-muted/70 font-mono text-[0.55rem] tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ) : null}
                <code
                  className={cn(
                    "min-w-0 flex-1 select-all break-all font-mono text-[0.8rem] leading-relaxed text-foreground/90",
                    !visible && "tracking-[0.15em] text-muted-foreground",
                  )}
                >
                  {visible ? value : maskValue(value)}
                </code>
                <CopyButton
                  copied={isCopied(`${copyIdPrefix}-${index}`)}
                  onCopy={() =>
                    void copy(value, {
                      id: `${copyIdPrefix}-${index}`,
                      label: `${label} ${index + 1} copied to clipboard`,
                    })
                  }
                  label={`Copy ${label.toLowerCase()} ${index + 1}`}
                  size="icon-xs"
                />
              </li>
            ))}
          </ol>
        )}
      </div>

      {count > 0 ? (
        <div className="flex items-center justify-between gap-2 border-t border-border/60 px-3.5 py-2">
          <span className="font-mono text-[0.6rem] text-muted-foreground">
            {count} {count === 1 ? "value" : "values"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCopyAll}
            className="rounded-md text-muted-foreground hover:text-foreground"
          >
            <Copy className="size-3" aria-hidden="true" />
            Copy all
          </Button>
        </div>
      ) : null}
    </div>
  );
}
