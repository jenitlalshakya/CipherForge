"use client";

import { useMemo, useState } from "react";
import { KeyRound, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";

import { StrengthMeter } from "@/components/generator/strength-meter";
import { SecretListOutput } from "@/components/shared/secret-list-output";
import {
  CharsetOption,
  SliderField,
  ToggleRow,
} from "@/components/shared/form-controls";
import { ToolShell } from "@/components/tools/tool-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAutoGenerate } from "@/hooks/use-auto-generate";
import { DEFAULT_OUTPUT_COUNT, DEFAULT_SECRET_OPTIONS } from "@/lib/constants";
import { CHARSET_META } from "@/lib/crypto/charsets";
import { estimateSecretEntropy } from "@/lib/crypto/entropy";
import { isWebCryptoAvailable } from "@/lib/crypto/random";
import { generateSecrets } from "@/lib/crypto/secret";
import { secretOptionsSchema } from "@/lib/validation";
import { CHARSET_KEYS, type SecretOptions } from "@/types/crypto";

const PASSWORD_DEFAULTS: SecretOptions = {
  ...DEFAULT_SECRET_OPTIONS,
  length: 20,
  count: DEFAULT_OUTPUT_COUNT,
};

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Secure generation failed. Try again in a modern browser.";
}

export function PasswordTool() {
  const [options, setOptions] = useState<SecretOptions>(PASSWORD_DEFAULTS);
  const [values, setValues] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAutoGenerate(() => {
    try {
      setValues(generateSecrets(PASSWORD_DEFAULTS, PASSWORD_DEFAULTS.count));
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  });

  const validation = useMemo(
    () => secretOptionsSchema.safeParse(options),
    [options],
  );

  const validationMessage = validation.success
    ? null
    : validation.error.issues[0]?.message;

  const entropy = useMemo(() => {
    try {
      return estimateSecretEntropy(options);
    } catch {
      return {
        bits: 0,
        poolSize: 0,
        label: "Very weak" as const,
        score: 0,
      };
    }
  }, [options]);

  function updateOption<Key extends keyof SecretOptions>(
    key: Key,
    nextValue: SecretOptions[Key],
  ) {
    setOptions((current) => ({ ...current, [key]: nextValue }));
  }

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
      setValues(generateSecrets(options, options.count));
      setVisible(true);
      setError(null);
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  }

  return (
    <ToolShell
      icon={KeyRound}
      title="Password Generator"
      description="Build a high-entropy password with a guaranteed mix of every character type you select. Built for credential managers, databases, PINs, and shared services."
      accent="brand"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-5">
          <SliderField
            id="password-length"
            label="Password length"
            value={options.length}
            min={4}
            max={128}
            hint="Between 4 and 128 characters. Use 4–8 with numbers only for PIN codes."
            onChange={(nextValue) => updateOption("length", nextValue)}
          />

          <SliderField
            id="password-count"
            label="How many passwords"
            value={options.count}
            min={1}
            max={20}
            hint="Generate between 1 and 20 values at once."
            onChange={(nextValue) => updateOption("count", nextValue)}
          />

          <fieldset>
            <legend className="text-sm font-medium">Character sets</legend>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {CHARSET_KEYS.map((key) => (
                <CharsetOption
                  key={key}
                  id={`password-charset-${key}`}
                  label={CHARSET_META[key].label}
                  sample={CHARSET_META[key].sample}
                  checked={options[key]}
                  onCheckedChange={(checked) => updateOption(key, checked)}
                />
              ))}
            </div>
            {validationMessage ? (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {validationMessage}
              </p>
            ) : null}
          </fieldset>

          <ToggleRow
            id="password-exclude-ambiguous"
            label="Exclude ambiguous characters"
            description="Drop I, l, 1, O, 0, o, and | for easier transcription."
            checked={options.excludeAmbiguous}
            onCheckedChange={(checked) =>
              updateOption("excludeAmbiguous", checked)
            }
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
            Generate password
          </Button>
        </div>

        <div className="space-y-3">
          <StrengthMeter entropy={entropy} />

          <SecretListOutput
            values={values}
            label="Generated password"
            placeholder="Generate a password to begin."
            copyIdPrefix="password-tool"
            visible={visible}
            onToggleVisibility={() => setVisible((current) => !current)}
            meta={
              <span className="font-mono text-[0.6rem] text-muted-foreground">
                {values.length > 0
                  ? `${values.length} × ${values[0]?.length ?? options.length} chars`
                  : `${options.length} chars`}
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
            Uses crypto.getRandomValues() with rejection sampling. Nothing is
            saved to your browser, and the password never touches a network.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
