"use client";

import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { maskValue } from "@/lib/utils/format";

interface SecretOutputProps {
  value: string;
  label: string;
  placeholder?: string;
  copied: boolean;
  onCopy: () => void;
  visible?: boolean;
  onToggleVisibility?: () => void;
  meta?: ReactNode;
  className?: string;
  codeClassName?: string;
}

export function SecretOutput({
  value,
  label,
  placeholder = "Nothing generated yet.",
  copied,
  onCopy,
  visible = true,
  onToggleVisibility,
  meta,
  className,
  codeClassName,
}: SecretOutputProps) {
  const displayValue = value
    ? visible
      ? value
      : maskValue(value)
    : null;

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
        {meta}
      </div>

      <div className="flex min-h-24 items-start gap-2 p-3.5 sm:p-4">
        <code
          className={cn(
            "min-w-0 flex-1 select-all break-all font-mono text-[0.82rem] leading-relaxed text-foreground/90",
            !value && "select-none text-sm text-muted-foreground",
            codeClassName,
          )}
        >
          {displayValue ?? placeholder}
        </code>

        <div className="flex shrink-0 items-center gap-0.5">
          {onToggleVisibility ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onToggleVisibility}
              aria-label={visible ? "Hide value" : "Show value"}
              className="rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {visible ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </Button>
          ) : null}
          <CopyButton
            copied={copied}
            onCopy={onCopy}
            disabled={!value}
            label={`Copy ${label.toLowerCase()}`}
          />
        </div>
      </div>
    </div>
  );
}
