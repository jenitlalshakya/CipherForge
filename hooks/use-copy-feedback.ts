"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { copyToClipboard } from "@/lib/utils/clipboard";

interface CopyOptions {
  id?: string;
  label?: string;
  description?: string;
}

export function useCopyFeedback(resetAfter = 1_800) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (value: string, options: CopyOptions = {}) => {
      const { id = "default", label = "Copied to clipboard" } = options;
      const copied = await copyToClipboard(value);

      if (!copied) {
        toast.error("Clipboard unavailable", {
          description:
            "Your browser blocked clipboard access. Select the value and copy it manually.",
        });
        return false;
      }

      setCopiedId(id);
      toast.success(label, {
        description: options.description ?? "Copied locally. Nothing left your browser.",
      });

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, resetAfter);

      return true;
    },
    [resetAfter],
  );

  const isCopied = useCallback(
    (id = "default") => copiedId === id,
    [copiedId],
  );

  return { copy, copiedId, isCopied };
}
