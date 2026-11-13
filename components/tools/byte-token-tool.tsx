"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { RefreshCw, ShieldAlert, Trash2 } from "lucide-react";

import { SecretListOutput } from "@/components/shared/secret-list-output";
import { SliderField } from "@/components/shared/form-controls";
import { ToolShell } from "@/components/tools/tool-shell";
import { ToolStatStrip } from "@/components/tools/tool-stat-strip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAutoGenerate } from "@/hooks/use-auto-generate";
import { DEFAULT_OUTPUT_COUNT } from "@/lib/constants";
import { formatEntropy, strengthFromBits } from "@/lib/crypto/entropy";
import { isWebCryptoAvailable } from "@/lib/crypto/random";
import { byteOptionsSchema } from "@/lib/validation";

interface ByteTokenToolProps {
  icon: ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  title: string;
  description: string;
  accent: "brand" | "brand-2" | "brand-3";
  idPrefix: string;
  outputLabel: string;
  placeholder: string;
  defaultByteLength: number;
  hint: string;
  note: string;
  generate: (byteLength: number) => string;
}

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Secure generation failed. Try again in a modern browser.";
}

export function ByteTokenTool({
  icon,
  title,
  description,
  accent,
  idPrefix,
  outputLabel,
  placeholder,
  defaultByteLength,
  hint,
  note,
  generate,
}: ByteTokenToolProps) {
  const [byteLength, setByteLength] = useState(defaultByteLength);
  const [count, setCount] = useState(DEFAULT_OUTPUT_COUNT);
  const [values, setValues] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAutoGenerate(() => {
    try {
      setValues(
        Array.from({ length: DEFAULT_OUTPUT_COUNT }, () =>
          generate(defaultByteLength),
        ),
      );
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  });

  const validation = useMemo(
    () => byteOptionsSchema.safeParse({ byteLength, count }),
    [byteLength, count],
  );

  const validationMessage = validation.success
    ? null
    : validation.error.issues[0]?.message;

  const entropyBits = byteLength * 8;
  const strength = strengthFromBits(entropyBits);

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
      setValues(Array.from({ length: count }, () => generate(byteLength)));
      setVisible(true);
      setError(null);
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  }

  return (
    <ToolShell
      icon={icon}
      title={title}
      description={description}
      accent={accent}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-5">
          <SliderField
            id={`${idPrefix}-byte-length`}
            label="Byte length"
            value={byteLength}
            min={8}
            max={64}
            hint={hint}
            onChange={setByteLength}
          />

          <SliderField
            id={`${idPrefix}-count`}
            label="How many values"
            value={count}
            min={1}
            max={20}
            hint="Generate between 1 and 20 values at once."
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
            Generate {outputLabel.toLowerCase()}
          </Button>
        </div>

        <div className="space-y-3">
          <ToolStatStrip
            items={[
              { label: "Entropy", value: formatEntropy(entropyBits), tone: "brand" },
              { label: "Strength", value: strength.label, tone: "success" },
              {
                label: "Output",
                value:
                  values.length > 0
                    ? `${values.length} × ${values[0]?.length ?? 0} chars`
                    : "0 chars",
              },
            ]}
          />

          <SecretListOutput
            values={values}
            label={outputLabel}
            placeholder={placeholder}
            copyIdPrefix={`${idPrefix}-tool`}
            visible={visible}
            onToggleVisibility={() => setVisible((current) => !current)}
            meta={
              <span className="font-mono text-[0.6rem] text-muted-foreground">
                {byteLength} bytes each
              </span>
            }
          />

          <div className="flex gap-2">
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
              onClick={() => {
                setValues([]);
                setVisible(true);
              }}
              disabled={values.length === 0}
              className="rounded-lg text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Clear
            </Button>
          </div>

          <p className="text-[0.68rem] leading-relaxed text-muted-foreground">
            {note}
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
