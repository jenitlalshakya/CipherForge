"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
  Download,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { StrengthMeter } from "@/components/generator/strength-meter";
import { CopyButton } from "@/components/shared/copy-button";
import {
  CharsetOption,
  SliderField,
  ToggleRow,
} from "@/components/shared/form-controls";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutoGenerate } from "@/hooks/use-auto-generate";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { DEFAULT_SECRET_OPTIONS } from "@/lib/constants";
import { estimateSecretEntropy } from "@/lib/crypto/entropy";
import { isWebCryptoAvailable } from "@/lib/crypto/random";
import { generateSecrets } from "@/lib/crypto/secret";
import {
  CHARSET_META,
  normalizeCustomCharacters,
} from "@/lib/crypto/charsets";
import type { SecretOptions } from "@/types/crypto";
import { createSecretsFilename, downloadTextFile } from "@/lib/utils/download";
import { maskValue } from "@/lib/utils/format";
import { secretOptionsSchema } from "@/lib/validation";
import { CHARSET_KEYS } from "@/types/crypto";

const COUNT_ITEMS = Array.from({ length: 20 }, (_, index) => ({
  label: `${index + 1} ${index === 0 ? "secret" : "secrets"}`,
  value: String(index + 1),
}));

const PRESETS: Array<{
  id: string;
  label: string;
  description: string;
  options: SecretOptions;
}> = [
  {
    id: "balanced",
    label: "Balanced",
    description: "24 chars · every character type",
    options: DEFAULT_SECRET_OPTIONS,
  },
  {
    id: "maximum",
    label: "Maximum",
    description: "64 chars · all character types",
    options: { ...DEFAULT_SECRET_OPTIONS, length: 64 },
  },
  {
    id: "readable",
    label: "Readable",
    description: "20 chars · no ambiguous glyphs",
    options: {
      ...DEFAULT_SECRET_OPTIONS,
      length: 20,
      symbols: false,
      excludeAmbiguous: true,
    },
  },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Secure generation failed. Refresh the page and try again.";
}

export function GeneratorStudio() {
  const [options, setOptions] = useState<SecretOptions>(DEFAULT_SECRET_OPTIONS);
  const [secrets, setSecrets] = useState<string[]>([]);
  const [valuesVisible, setValuesVisible] = useState(true);
  const [cryptoReady, setCryptoReady] = useState<boolean | null>(null);
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const { copy, isCopied } = useCopyFeedback();

  useAutoGenerate(() => {
    const available = isWebCryptoAvailable();
    setCryptoReady(available);

    if (!available) {
      setCryptoError(
        "Secure browser cryptography is unavailable. CipherForge will not generate secrets with an insecure fallback. Try a current version of Chrome, Edge, Firefox, or Safari over HTTPS.",
      );
      return;
    }

    try {
      setSecrets(
        generateSecrets(DEFAULT_SECRET_OPTIONS, DEFAULT_SECRET_OPTIONS.count),
      );
    } catch (error) {
      setCryptoError(getErrorMessage(error));
    }
  });

  const validation = useMemo(
    () => secretOptionsSchema.safeParse(options),
    [options],
  );

  const errors = useMemo<Record<string, string>>(() => {
    if (validation.success) {
      return {};
    }

    return validation.error.issues.reduce<Record<string, string>>(
      (accumulator, issue) => {
        const key = String(issue.path[0] ?? "form");

        if (!accumulator[key]) {
          accumulator[key] = issue.message;
        }

        return accumulator;
      },
      {},
    );
  }, [validation]);

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

  const customCharacterCount = useMemo(
    () =>
      normalizeCustomCharacters(
        options.customCharacters,
        options.excludeAmbiguous,
      ).length,
    [options.customCharacters, options.excludeAmbiguous],
  );

  const canGenerate = validation.success && cryptoReady !== false;

  function updateOption<Key extends keyof SecretOptions>(
    key: Key,
    value: SecretOptions[Key],
  ) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function runGeneration(nextOptions: SecretOptions) {
    if (!isWebCryptoAvailable()) {
      setCryptoReady(false);
      setCryptoError(
        "Secure browser cryptography is unavailable. CipherForge will not generate secrets with an insecure fallback.",
      );
      return;
    }

    try {
      const nextSecrets = generateSecrets(nextOptions, nextOptions.count);
      setSecrets(nextSecrets);
      setValuesVisible(true);
      setCryptoError(null);
    } catch (error) {
      setCryptoError(getErrorMessage(error));
    }
  }

  function handleGenerate() {
    if (!validation.success) {
      return;
    }

    runGeneration(options);
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    const nextOptions = { ...preset.options, count: options.count };
    setOptions(nextOptions);
    runGeneration(nextOptions);
  }

  function handleReset() {
    setOptions(DEFAULT_SECRET_OPTIONS);
    runGeneration(DEFAULT_SECRET_OPTIONS);
  }

  function handleCopyAll() {
    if (secrets.length === 0) {
      return;
    }

    void copy(secrets.join("\n"), {
      id: "all-secrets",
      label:
        secrets.length === 1
          ? "Secret copied to clipboard"
          : `${secrets.length} secrets copied to clipboard`,
    });
  }

  function handleDownload() {
    if (secrets.length === 0) {
      return;
    }

    downloadTextFile(secrets.join("\n"), createSecretsFilename());
    toast.success("Download started", {
      description: "The file is being written locally by your browser.",
    });
  }

  function handleClear() {
    setSecrets([]);
    setValuesVisible(true);
    toast.success("Values cleared", {
      description: "Generated secrets were removed from this page.",
    });
  }

  return (
    <section
      id="generator"
      aria-labelledby="generator-heading"
      className="relative scroll-mt-24 py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 mx-auto h-[32rem] max-w-4xl rounded-full bg-brand/[0.08] blur-[130px]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="generator-heading"
          align="center"
          eyebrow="The Forge"
          eyebrowIcon={<KeyRound className="size-3 text-brand" aria-hidden="true" />}
          title={
            <>
              Forge a secret you can{" "}
              <span className="text-gradient">actually trust.</span>
            </>
          }
          description="Tune the character pool, length, and quantity. Every value is created with the Web Crypto API inside this tab — never on a server, never in a log, never in storage."
        />

        <div className="mt-10 sm:mt-12">
          <div className="gradient-border glass-panel inner-glow relative overflow-hidden rounded-3xl p-3 sm:p-4 lg:p-5">
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--brand-2),transparent)] opacity-70" />

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-4">
              {/* Options panel */}
              <div className="rounded-2xl border border-border/60 bg-card/45 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
                      <Sparkles className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold leading-tight">
                        Generator settings
                      </h3>
                      <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                        Changes apply to the next generation.
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="h-6 rounded-full border-success/25 bg-success/[0.07] px-2.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-success"
                  >
                    <span className="size-1.5 rounded-full bg-success" />
                    Client-side
                  </Badge>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      title={preset.description}
                      className="rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/[0.07] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    <RotateCcw className="size-3" aria-hidden="true" />
                    Reset
                  </button>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <SliderField
                      id="secret-length"
                      label="Length"
                      value={options.length}
                      min={4}
                      max={128}
                      hint="Between 4 and 128 characters per secret."
                      onChange={(value) => updateOption("length", value)}
                    />
                    {errors.length ? (
                      <p className="mt-2 text-xs text-destructive" role="alert">
                        {errors.length}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secret-count">How many</Label>
                    <Select
                      items={COUNT_ITEMS}
                      value={String(options.count)}
                      onValueChange={(value) => {
                        if (value) {
                          updateOption("count", Number(value));
                        }
                      }}
                    >
                      <SelectTrigger
                        id="secret-count"
                        className="w-full justify-between bg-background/40"
                        aria-label="Number of secrets to generate"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNT_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Generate up to 20 values at once.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Visibility</span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setValuesVisible((current) => !current)}
                      aria-pressed={valuesVisible}
                      className="w-full justify-between bg-background/40 text-sm font-normal"
                    >
                      <span className="flex items-center gap-2">
                        {valuesVisible ? (
                          <EyeOff className="size-4 text-muted-foreground" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4 text-muted-foreground" aria-hidden="true" />
                        )}
                        {valuesVisible ? "Values visible" : "Values masked"}
                      </span>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
                        {valuesVisible ? "Hide" : "Show"}
                      </span>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Masking is visual only. Copy still uses the real value.
                    </p>
                  </div>
                </div>

                <fieldset className="mt-6">
                  <legend className="text-sm font-medium">Character sets</legend>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Each enabled built-in set is guaranteed to appear at least once.
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {CHARSET_KEYS.map((key) => (
                      <CharsetOption
                        key={key}
                        id={`charset-${key}`}
                        label={CHARSET_META[key].label}
                        sample={CHARSET_META[key].sample}
                        checked={options[key]}
                        disabled={options.customOnly}
                        onCheckedChange={(checked) =>
                          updateOption(key, checked)
                        }
                      />
                    ))}
                  </div>
                  {errors.uppercase ? (
                    <p className="mt-2 text-xs text-destructive" role="alert">
                      {errors.uppercase}
                    </p>
                  ) : null}
                  {options.customOnly ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Built-in sets are ignored while custom-only mode is on.
                    </p>
                  ) : null}
                </fieldset>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="custom-characters" className="justify-between">
                    <span>Custom characters</span>
                    <span className="font-mono text-[0.65rem] font-normal text-muted-foreground">
                      {customCharacterCount}/128
                    </span>
                  </Label>
                  <Input
                    id="custom-characters"
                    value={options.customCharacters}
                    maxLength={128}
                    placeholder="Add extra glyphs, e.g. @#%+="
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={Boolean(errors.customCharacters)}
                    aria-describedby="custom-characters-help"
                    onChange={(event) =>
                      updateOption("customCharacters", event.target.value)
                    }
                    className="bg-background/40 font-mono"
                  />
                  <p
                    id="custom-characters-help"
                    className={cn(
                      "text-xs leading-relaxed",
                      errors.customCharacters
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {errors.customCharacters ??
                      "Whitespace is removed and duplicates are merged before generation."}
                  </p>
                </div>

                <div className="mt-5 grid gap-2">
                  <ToggleRow
                    id="exclude-ambiguous"
                    label="Exclude ambiguous characters"
                    description="Removes I, l, 1, O, 0, o, and | to make secrets easier to read aloud."
                    checked={options.excludeAmbiguous}
                    onCheckedChange={(checked) =>
                      updateOption("excludeAmbiguous", checked)
                    }
                  />
                  <ToggleRow
                    id="custom-only"
                    label="Custom characters only"
                    description="Generate exclusively from your custom set. At least two unique characters are required."
                    checked={options.customOnly}
                    onCheckedChange={(checked) =>
                      updateOption("customOnly", checked)
                    }
                  />
                </div>

                {cryptoError ? (
                  <Alert variant="destructive" className="mt-5 border-destructive/30 bg-destructive/[0.06]">
                    <ShieldAlert aria-hidden="true" />
                    <AlertTitle>Secure generation unavailable</AlertTitle>
                    <AlertDescription>{cryptoError}</AlertDescription>
                  </Alert>
                ) : null}

                {!validation.success ? (
                  <Alert variant="destructive" className="mt-5 border-warning/25 bg-warning/[0.06] text-warning">
                    <ShieldAlert aria-hidden="true" />
                    <AlertTitle>Check your generator settings</AlertTitle>
                    <AlertDescription>
                      {Object.values(errors)[0] ??
                        "Adjust the options above before generating."}
                    </AlertDescription>
                  </Alert>
                ) : null}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="forge-cta h-11 flex-1 rounded-xl text-sm font-semibold disabled:opacity-45"
                  >
                    <RefreshCw className="size-4" aria-hidden="true" />
                    {secrets.length > 0 ? "Regenerate secrets" : "Generate secrets"}
                  </Button>
                </div>
              </div>

              {/* Output panel */}
              <div className="flex min-h-[28rem] flex-col rounded-2xl border border-border/60 bg-card/45 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg border border-brand-3/25 bg-brand-3/10 text-brand-3">
                      <LockKeyhole className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold leading-tight">
                        Generated output
                      </h3>
                      <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                        {secrets.length > 0
                          ? `${secrets.length} × ${secrets[0]?.length ?? options.length} characters`
                          : "Nothing held in memory"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="h-6 rounded-full border-border/80 bg-background/40 px-2.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {secrets.length > 0 ? "In memory" : "Empty"}
                  </Badge>
                </div>

                <StrengthMeter entropy={entropy} className="mt-4" />

                <p className="sr-only" role="status" aria-live="polite">
                  {secrets.length > 0
                    ? `${secrets.length} ${secrets.length === 1 ? "secret" : "secrets"} generated`
                    : "No secrets generated"}
                </p>

                <div className="mt-4 flex-1">
                  {secrets.length === 0 ? (
                    <div className="flex h-full min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/30 px-6 py-10 text-center">
                      <span className="grid size-12 place-items-center rounded-2xl border border-border/70 bg-muted/50 text-muted-foreground">
                        <KeyRound className="size-5" aria-hidden="true" />
                      </span>
                      <p className="mt-4 text-sm font-medium">
                        No secrets in memory
                      </p>
                      <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
                        Generate a fresh set, or adjust the options and forge exactly what you need.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        className="mt-4 rounded-full bg-background/60"
                      >
                        <Sparkles className="size-3.5" aria-hidden="true" />
                        Generate now
                      </Button>
                    </div>
                  ) : (
                    <ol
                      className="scrollbar-thin max-h-[23rem] space-y-2 overflow-y-auto pr-1"
                      aria-label="Generated secrets"
                    >
                      {secrets.map((secret, index) => (
                        <li
                          key={index}
                          className="group flex items-center gap-2 rounded-xl border border-border/60 bg-background/45 px-2.5 py-2 transition-colors hover:border-border hover:bg-background/70"
                        >
                          <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted/70 font-mono text-[0.58rem] tabular-nums text-muted-foreground">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <code
                            className={cn(
                              "min-w-0 flex-1 select-all break-all font-mono text-[0.78rem] leading-relaxed text-foreground/90",
                              !valuesVisible && "tracking-[0.16em] text-muted-foreground",
                            )}
                          >
                            {valuesVisible ? secret : maskValue(secret)}
                          </code>
                          <CopyButton
                            copied={isCopied(`secret-${index}`)}
                            onCopy={() =>
                              void copy(secret, {
                                id: `secret-${index}`,
                                label: `Secret ${index + 1} copied`,
                              })
                            }
                            label={`Copy secret ${index + 1}`}
                            size="icon-xs"
                          />
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAll}
                    disabled={secrets.length === 0}
                    className="rounded-lg bg-background/40"
                  >
                    <Copy className="size-3.5" aria-hidden="true" />
                    Copy all
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={secrets.length === 0}
                    className="rounded-lg bg-background/40"
                  >
                    <Download className="size-3.5" aria-hidden="true" />
                    Download TXT
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setValuesVisible((current) => !current)}
                    disabled={secrets.length === 0}
                    aria-pressed={valuesVisible}
                    className="rounded-lg justify-start text-muted-foreground"
                  >
                    {valuesVisible ? (
                      <EyeOff className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-3.5" aria-hidden="true" />
                    )}
                    {valuesVisible ? "Hide values" : "Show values"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={secrets.length === 0}
                    className="rounded-lg justify-start text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Clear
                  </Button>
                </div>

                <p className="mt-3 flex items-start gap-1.5 border-t border-border/50 pt-3 text-[0.68rem] leading-relaxed text-muted-foreground">
                  <LockKeyhole className="mt-0.5 size-3 shrink-0 text-success" aria-hidden="true" />
                  Values live only in this page&apos;s memory. CipherForge never
                  stores, logs, or transmits them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
