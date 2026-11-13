"use client";

import type { ReactNode } from "react";
import { BookOpen, Cookie, ShieldCheck } from "lucide-react";
import { cn } from "cn";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface InfoDialogProps {
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

function InfoDialog({
  label,
  title,
  description,
  icon,
  children,
  className,
}: InfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md text-left text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              className,
            )}
          />
        }
      >
        {label}
      </DialogTrigger>
      <DialogContent className="scrollbar-thin max-h-[86vh] overflow-y-auto border border-border/70 bg-popover/95 p-5 backdrop-blur-xl sm:max-w-2xl sm:p-6">
        <DialogHeader className="pr-8">
          <div className="mb-1 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
              {icon}
            </span>
            <Badge
              variant="outline"
              className="h-5 rounded-full border-border/70 px-2 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground"
            >
              CipherForge
            </Badge>
          </div>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="font-heading text-sm font-semibold text-foreground">
        {title}
      </h3>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function PrivacyDialog() {
  return (
    <InfoDialog
      label="Privacy"
      title="Privacy, without fine print"
      description="The short version: CipherForge has no server-side secret handling, no analytics, and no persistence."
      icon={<Cookie className="size-4" aria-hidden="true" />}
    >
      <InfoSection title="What we collect">
        <p>
          Nothing. This build does not include analytics, advertising pixels,
          session replay, fingerprinting, or error reporting that could include
          generated values.
        </p>
      </InfoSection>

      <InfoSection title="What stays on your device">
        <p>
          Generated secrets and hash inputs remain in this page&apos;s memory
          while the tab is open. They are never written to localStorage,
          sessionStorage, cookies, IndexedDB, or a remote database.
        </p>
      </InfoSection>

      <InfoSection title="Clipboard and downloads">
        <p>
          The clipboard is touched only when you press a copy control. TXT
          downloads are created locally with a Blob URL. CipherForge does not
          inspect or retain either result.
        </p>
      </InfoSection>

      <InfoSection title="Network activity">
        <p>
          Secret generation, hashing, and encoding do not make network
          requests. The site itself may load its own static assets, but no
          generated value is ever included in a request, URL, or log.
        </p>
      </InfoSection>

      <InfoSection title="Your responsibility">
        <p>
          Treat the device, browser profile, and extensions you use as part of
          your security boundary. A compromised environment can observe
          anything on screen or in the clipboard.
        </p>
      </InfoSection>
    </InfoDialog>
  );
}

export function SecurityDialog() {
  return (
    <InfoDialog
      label="Security"
      title="How the cryptography works"
      description="A plain-language summary of the primitives and fail-closed behavior behind CipherForge."
      icon={<ShieldCheck className="size-4" aria-hidden="true" />}
    >
      <InfoSection title="Secure randomness">
        <p>
          Every random value originates from{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em] text-foreground">
            crypto.getRandomValues()
          </code>
          . There is no <code className="font-mono text-[0.8em]">Math.random</code>{" "}
          path and no insecure fallback. If the browser cannot provide secure
          randomness, generation stops.
        </p>
      </InfoSection>

      <InfoSection title="No modulo bias">
        <p>
          Character selection uses rejection sampling. Values that fall into an
          incomplete final bucket of the 32-bit range are discarded, so each
          character in a pool has an equal chance of being chosen.
        </p>
      </InfoSection>

      <InfoSection title="Guaranteed character sets">
        <p>
          When you enable uppercase, lowercase, numbers, and symbols, each set
          is guaranteed to appear at least once. The result is then shuffled
          with a cryptographically secure Fisher–Yates pass.
        </p>
      </InfoSection>

      <InfoSection title="Hashing and identifiers">
        <p>
          SHA-256 uses SubtleCrypto&apos;s native digest implementation. UUID
          v4 uses crypto.randomUUID() when available, with a secure
          getRandomValues() fallback that applies the RFC 9562 version and
          variant bits.
        </p>
      </InfoSection>

      <InfoSection title="Secure context">
        <p>
          The Web Crypto API requires a secure context. Use the site over HTTPS
          or localhost. CipherForge fails closed rather than downgrading to an
          insecure source.
        </p>
      </InfoSection>

      <InfoSection title="Honest limitations">
        <p>
          Client-side cryptography cannot defend against malware, hostile
          extensions, clipboard monitors, or someone looking over your
          shoulder. For high-value credentials, use a hardened device and a
          reputable password manager.
        </p>
      </InfoSection>
    </InfoDialog>
  );
}

export function DocumentationDialog() {
  return (
    <InfoDialog
      label="Documentation"
      title="Quick start and reference"
      description="Everything you need to use the forge, the toolkit, and the local security model."
      icon={<BookOpen className="size-4" aria-hidden="true" />}
    >
      <InfoSection title="1. Forge a secret">
        <p>
          Start in the Generator section. Choose a length between 4 and 128,
          select the character sets you need, and set how many values to create.
          Use numbers only with a short length for PIN codes. Presets cover
          balanced, maximum-strength, and human-readable output.
        </p>
      </InfoSection>

      <InfoSection title="2. Use the six tools">
        <p>
          The toolkit includes Password, API Key, Hex, Base64, SHA-256, and UUID
          v4 generators. Use the tabs or deep links such as{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em] text-foreground">
            #hex-generator
          </code>{" "}
          to jump directly to a tool.
        </p>
      </InfoSection>

      <InfoSection title="3. Copy or download">
        <p>
          Copy individual values, copy the whole set, or download a TXT file.
          Masking is visual only: copying always uses the real value. Clear the
          output when you are finished to remove secrets from page memory.
        </p>
      </InfoSection>

      <InfoSection title="Keyboard and accessibility">
        <p>
          All controls are keyboard reachable with visible focus rings. Use
          arrow keys on sliders, Space or Enter on buttons and switches, and
          Ctrl/⌘ + Enter in the SHA-256 input to hash immediately. Reduced-motion
          preferences are respected.
        </p>
      </InfoSection>

      <InfoSection title="Browser support">
        <p>
          Use a current version of Chrome, Edge, Firefox, or Safari in a secure
          context. Browsers without Web Crypto receive an explicit error
          instead of a weakened fallback.
        </p>
      </InfoSection>

      <InfoSection title="Privacy checklist">
        <ul className="list-disc space-y-1 pl-4">
          <li>No account or email required.</li>
          <li>No cookies, analytics, or local storage of secrets.</li>
          <li>No network transmission of generated values.</li>
          <li>Works offline after the page has loaded.</li>
        </ul>
      </InfoSection>
    </InfoDialog>
  );
}
