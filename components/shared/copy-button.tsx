"use client";

import { Check, Copy } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyButtonProps {
  copied: boolean;
  onCopy: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  size?: "icon-xs" | "icon-sm" | "icon";
}

export function CopyButton({
  copied,
  onCopy,
  disabled = false,
  label = "Copy value",
  className,
  size = "icon-sm",
}: CopyButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size={size}
            disabled={disabled}
            onClick={onCopy}
            aria-label={copied ? "Copied" : label}
            className={cn(
              "rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              copied && "text-success hover:text-success",
              className,
            )}
          />
        }
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied" : ""}
        </span>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied" : label}</TooltipContent>
    </Tooltip>
  );
}
