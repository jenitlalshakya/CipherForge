"use client";

import { useMemo, useState } from "react";
import { KeySquare, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { cn } from "cn";

import { StrengthMeter } from "@/components/generator/strength-meter";
import { SecretListOutput } from "@/components/shared/secret-list-output";
import { SliderField } from "@/components/shared/form-controls";
import { ToolShell } from "@/components/tools/tool-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAutoGenerate } from "@/hooks/use-auto-generate";
import { DEFAULT_API_KEY_OPTIONS } from "@/lib/constants";
import { estimateEntropy } from "@/lib/crypto/entropy";
import { isWebCryptoAvailable } from "@/lib/crypto/random";
import { generateApiKeys } from "@/lib/crypto/tokens";
import { apiKeySchema } from "@/lib/validation";

const PREFIX_SUGGESTIONS = ["cf_live_", "sk_", "pk_", "token_"];

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Secure key generation failed. Try again in a modern browser.";
}

export function ApiKeyTool() {
  const [prefix, setPrefix] = useState(DEFAULT_API_KEY_OPTIONS.prefix);
  const [tokenLength, setTokenLength] = useState(
    DEFAULT_API_KEY_OPTIONS.tokenLength,
  );
  const [count, setCount] = useState(DEFAULT_API_KEY_OPTIONS.count);
  const [values, setValues] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAutoGenerate(() => {
    try {
      setValues(
        generateApiKeys(
          DEFAULT_API_KEY_OPTIONS.prefix,
          DEFAULT_API_KEY_OPTIONS.tokenLength,
          DEFAULT_API_KEY_OPTIONS.count,
        ),
      );
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  });

  const validation = useMemo(
    () => apiKeySchema.safeParse({ prefix, tokenLength, count }),
    [prefix, tokenLength, count],
  );

  const validationMessage = validation.success
    ? null
    : validation.error.issues[0]?.message;

  const entropy = useMemo(
    () => estimateEntropy(62, tokenLength),
    [tokenLength],
  );

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
      setValues(generateApiKeys(prefix, tokenLength, count));
      setVisible(true);
      setError(null);
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  }

  return (
    <ToolShell
      icon={KeySquare}
      title="API Key Generator"
      description="Create Base62 API tokens with a custom namespace prefix. Ideal for service credentials, webhook signing secrets, and development keys."
      accent="brand-2"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="api-prefix">Prefix</Label>
            <Input
              id="api-prefix"
              value={prefix}
              maxLength={32}
              autoComplete="off"
              spellCheck={false}
              placeholder="cf_live_"
              aria-invalid={Boolean(validationMessage)}
              aria-describedby="api-prefix-help"
              onChange={(event) => setPrefix(event.target.value)}
              className="bg-background/40 font-mono"
            />
            <div className="flex flex-wrap gap-1.5">
              {PREFIX_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setPrefix(suggestion)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-[0.65rem] transition-colors",
                    prefix === suggestion
                      ? "border-brand/40 bg-brand/10 text-brand"
                      : "border-border/70 bg-background/40 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <p
              id="api-prefix-help"
              className={cn(
                "text-xs leading-relaxed",
                validationMessage
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {validationMessage ??
                "Letters, numbers, underscores, and hyphens only. Up to 32 characters."}
            </p>
          </div>

          <SliderField
            id="api-token-length"
            label="Token length"
            value={tokenLength}
            min={16}
            max={64}
            hint="Random Base62 characters after the prefix."
            onChange={setTokenLength}
          />

          <SliderField
            id="api-key-count"
            label="How many API keys"
            value={count}
            min={1}
            max={20}
            hint="Generate between 1 and 20 keys at once."
            onChange={setCount}
          />

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
            Generate API key
          </Button>
        </div>

        <div className="space-y-3">
          <StrengthMeter entropy={entropy} />

          <SecretListOutput
            values={values}
            label="Generated API key"
            placeholder="Generate an API key to begin."
            copyIdPrefix="api-key-tool"
            visible={visible}
            onToggleVisibility={() => setVisible((current) => !current)}
            meta={
              <span className="font-mono text-[0.6rem] text-muted-foreground">
                {values.length > 0
                  ? `${values.length} × ${tokenLength} chars`
                  : `${tokenLength} chars`}
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
            The token body is drawn from a 62-character alphabet with unbiased
            rejection sampling. Prefixes are cosmetic and add no entropy.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
