"use client";

import { useMemo, useState } from "react";
import { Hash, Loader2, ShieldAlert, Sparkles, Trash2 } from "lucide-react";

import { SecretOutput } from "@/components/shared/secret-output";
import { ToolShell } from "@/components/tools/tool-shell";
import { ToolStatStrip } from "@/components/tools/tool-stat-strip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyFeedback } from "@/hooks/use-copy-feedback";
import { MAX_HASH_INPUT_LENGTH, sha256 } from "@/lib/crypto/hash";
import { isSubtleCryptoAvailable } from "@/lib/crypto/random";
import { hashSchema } from "@/lib/validation";

const SAMPLE_TEXT = "CipherForge keeps secrets local by default.";

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Hashing failed. Try again in a modern browser.";
}

export function Sha256Tool() {
  const [input, setInput] = useState("");
  const [digest, setDigest] = useState("");
  const [inputBytes, setInputBytes] = useState(0);
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { copy, isCopied } = useCopyFeedback();

  const validation = useMemo(() => hashSchema.safeParse({ text: input }), [input]);
  const validationMessage = validation.success
    ? null
    : validation.error.issues[0]?.message;

  const previewBytes = useMemo(
    () => new TextEncoder().encode(input).byteLength,
    [input],
  );

  async function handleHash() {
    if (!validation.success || isHashing) {
      return;
    }

    if (!isSubtleCryptoAvailable()) {
      setError(
        "SHA-256 needs the Web Crypto SubtleCrypto API, which this browser does not expose.",
      );
      return;
    }

    setIsHashing(true);

    try {
      const result = await sha256(input);
      setDigest(result.digest);
      setInputBytes(result.inputBytes);
      setError(null);
    } catch (hashingError) {
      setError(errorMessage(hashingError));
    } finally {
      setIsHashing(false);
    }
  }

  function handleClear() {
    setInput("");
    setDigest("");
    setInputBytes(0);
    setError(null);
  }

  return (
    <ToolShell
      icon={Hash}
      title="SHA-256 Hash"
      description="Compute a one-way 256-bit SHA-256 digest with the browser's native SubtleCrypto implementation. Input is processed locally and never uploaded."
      accent="brand"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleHash();
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="sha-input">Text to hash</Label>
              <button
                type="button"
                onClick={() => setInput(SAMPLE_TEXT)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.65rem] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Sparkles className="size-3" aria-hidden="true" />
                Use sample
              </button>
            </div>
            <Textarea
              id="sha-input"
              value={input}
              rows={8}
              maxLength={MAX_HASH_INPUT_LENGTH}
              placeholder="Paste text, a token, or any string. Hashing is one-way."
              spellCheck={false}
              aria-invalid={Boolean(validationMessage)}
              aria-describedby="sha-input-help"
              onChange={(event) => {
                setInput(event.target.value);

                if (digest) {
                  setDigest("");
                  setInputBytes(0);
                }
              }}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  void handleHash();
                }
              }}
              className="min-h-40 resize-y bg-background/40 font-mono text-xs leading-relaxed"
            />
            <div
              id="sha-input-help"
              className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"
            >
              <span className={validationMessage ? "text-destructive" : undefined}>
                {validationMessage ??
                  "Nothing is stored. Ctrl/⌘ + Enter hashes instantly."}
              </span>
              <span className="font-mono tabular-nums">
                {input.length.toLocaleString()} chars ·{" "}
                {previewBytes.toLocaleString()} bytes
              </span>
            </div>
          </div>

          {error ? (
            <Alert
              variant="destructive"
              className="border-destructive/30 bg-destructive/[0.06]"
            >
              <ShieldAlert aria-hidden="true" />
              <AlertTitle>Hashing unavailable</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex gap-2">
            <Button
              type="submit"
              size="lg"
              disabled={!validation.success || isHashing}
              className="forge-cta h-11 flex-1 rounded-xl text-sm font-semibold disabled:opacity-45"
            >
              {isHashing ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Hash className="size-4" aria-hidden="true" />
              )}
              {isHashing ? "Hashing locally…" : "Hash with SHA-256"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleClear}
              disabled={!input && !digest}
              className="h-11 rounded-xl text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Clear
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <ToolStatStrip
            items={[
              { label: "Algorithm", value: "SHA-256", tone: "brand" },
              { label: "Input", value: `${inputBytes} bytes` },
              { label: "Digest", value: "64 hex chars" },
            ]}
          />

          <SecretOutput
            value={digest}
            label="SHA-256 digest"
            placeholder="Your 64-character digest will appear here."
            copied={isCopied("sha256-tool")}
            onCopy={() =>
              void copy(digest, {
                id: "sha256-tool",
                label: "SHA-256 digest copied",
              })
            }
            meta={
              <span className="font-mono text-[0.6rem] text-muted-foreground">
                256-bit
              </span>
            }
            codeClassName="break-all"
          />

          <p className="text-[0.68rem] leading-relaxed text-muted-foreground">
            SHA-256 is a fast one-way hash, not a password KDF. For stored
            passwords, use a memory-hard function such as Argon2id, scrypt, or
            PBKDF2 with a high work factor.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
