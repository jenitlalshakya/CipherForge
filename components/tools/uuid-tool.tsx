"use client";

import { useMemo, useState } from "react";
import { Copy, Fingerprint, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";

import { CopyButton } from "@/components/shared/copy-button";
import { SliderField } from "@/components/shared/form-controls";
import { ToolShell } from "@/components/tools/tool-shell";
import { ToolStatStrip } from "@/components/tools/tool-stat-strip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { useAutoGenerate } from "@/hooks/use-auto-generate";
import { DEFAULT_UUID_COUNT } from "@/lib/constants";
import { isWebCryptoAvailable } from "@/lib/crypto/random";
import { generateUuidV4Batch } from "@/lib/crypto/uuid";
import { uuidCountSchema } from "@/lib/validation";

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "UUID generation failed. Try again in a modern browser.";
}

export function UuidTool() {
  const [count, setCount] = useState(DEFAULT_UUID_COUNT);
  const [uuids, setUuids] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { copy, isCopied } = useCopyFeedback();

  useAutoGenerate(() => {
    try {
      setUuids(generateUuidV4Batch(DEFAULT_UUID_COUNT));
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  });

  const validation = useMemo(
    () => uuidCountSchema.safeParse({ count }),
    [count],
  );

  const validationMessage = validation.success
    ? null
    : validation.error.issues[0]?.message;

  function handleGenerate() {
    if (!validation.success) {
      return;
    }

    if (!isWebCryptoAvailable()) {
      setError(
        "Secure browser cryptography is unavailable. CipherForge will not fall back to an insecure source.",
      );
      return;
    }

    try {
      setUuids(generateUuidV4Batch(count));
      setError(null);
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  }

  function handleCopyAll() {
    if (uuids.length === 0) {
      return;
    }

    void copy(uuids.join("\n"), {
      id: "uuid-all",
      label:
        uuids.length === 1
          ? "UUID copied to clipboard"
          : `${uuids.length} UUIDs copied to clipboard`,
    });
  }

  return (
    <ToolShell
      icon={Fingerprint}
      title="UUID v4 Generator"
      description="Generate RFC 9562 version 4 UUIDs with cryptographically random bits. Use them as opaque identifiers without revealing sequencing or host information."
      accent="brand-3"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-5">
          <SliderField
            id="uuid-count"
            label="How many UUIDs"
            value={count}
            min={1}
            max={10}
            hint="Generate between 1 and 10 identifiers at a time."
            onChange={setCount}
          />

          {validationMessage ? (
            <p className="text-xs text-destructive" role="alert">
              {validationMessage}
            </p>
          ) : null}

          {error ? (
            <Alert
              variant="destructive"
              className="border-destructive/30 bg-destructive/[0.06]"
            >
              <ShieldAlert aria-hidden="true" />
              <AlertTitle>Generation unavailable</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="button"
            size="lg"
            onClick={handleGenerate}
            disabled={!validation.success}
            className="forge-cta h-11 w-full rounded-xl text-sm font-semibold disabled:opacity-45"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Generate UUIDs
          </Button>

          <p className="text-[0.68rem] leading-relaxed text-muted-foreground">
            Uses crypto.randomUUID() when available, otherwise a secure
            getRandomValues() implementation that sets the RFC 9562 version and
            variant bits. UUIDs are identifiers, not secrets.
          </p>
        </div>

        <div className="space-y-3">
          <ToolStatStrip
            items={[
              { label: "Version", value: "UUID v4", tone: "brand" },
              { label: "Entropy", value: "122 bits each", tone: "success" },
              { label: "Generated", value: `${uuids.length} items` },
            ]}
          />

          {uuids.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/30 px-6 py-10 text-center">
              <span className="grid size-11 place-items-center rounded-2xl border border-border/70 bg-muted/50 text-muted-foreground">
                <Fingerprint className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-medium">No UUIDs generated</p>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Choose a quantity and generate fresh version 4 identifiers.
              </p>
            </div>
          ) : (
            <ol
              className="scrollbar-thin max-h-72 space-y-2 overflow-y-auto pr-1"
              aria-label="Generated UUIDs"
            >
              {uuids.map((uuid, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/45 px-2.5 py-2 transition-colors hover:border-border hover:bg-background/70"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted/70 font-mono text-[0.58rem] tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <code className="min-w-0 flex-1 select-all break-all font-mono text-[0.74rem] leading-relaxed text-foreground/90">
                    {uuid}
                  </code>
                  <CopyButton
                    copied={isCopied(`uuid-${index}`)}
                    onCopy={() =>
                      void copy(uuid, {
                        id: `uuid-${index}`,
                        label: `UUID ${index + 1} copied`,
                      })
                    }
                    label={`Copy UUID ${index + 1}`}
                    size="icon-xs"
                  />
                </li>
              ))}
            </ol>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              disabled={uuids.length === 0}
              className="flex-1 rounded-lg bg-background/40"
            >
              <Copy className="size-3.5" aria-hidden="true" />
              Copy all
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={!validation.success}
              className="flex-1 rounded-lg bg-background/40"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Regenerate
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUuids([])}
              disabled={uuids.length === 0}
              className="rounded-lg text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
