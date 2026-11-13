import {
  Check,
  ChevronRight,
  Cpu,
  DatabaseZap,
  Download,
  Fingerprint,
  GlobeLock,
  Layers,
  LockKeyhole,
  ServerOff,
  ShieldCheck,
  Shuffle,
  WifiOff,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";

const PILLARS = [
  {
    icon: ServerOff,
    title: "Nothing is transmitted",
    description:
      "There is no generation API. No fetch, XHR, WebSocket, or telemetry carries a secret away from this page.",
    detail: "Works offline after first load",
  },
  {
    icon: DatabaseZap,
    title: "Nothing is persisted",
    description:
      "CipherForge never writes secrets to localStorage, sessionStorage, cookies, or IndexedDB. Values live only in memory.",
    detail: "No cookies · no logs · no history",
  },
  {
    icon: ShieldCheck,
    title: "Nothing is weakened",
    description:
      "Only the Web Crypto API is used. Rejection sampling removes modulo bias, and unsupported browsers fail closed.",
    detail: "No Math.random fallback",
  },
];

const FLOW = [
  {
    icon: Cpu,
    label: "CSPRNG",
    title: "Secure entropy",
    description: "crypto.getRandomValues() fills a typed array with OS-backed randomness.",
  },
  {
    icon: Shuffle,
    label: "Unbiased",
    title: "Rejection sampling",
    description: "Out-of-range values are discarded so every character is equally likely.",
  },
  {
    icon: Layers,
    label: "Compose",
    title: "Local construction",
    description: "Guaranteed character sets are placed, then shuffled inside your tab.",
  },
  {
    icon: Download,
    label: "Output",
    title: "You decide",
    description: "Copy to the OS clipboard or download a local file. Nothing else happens.",
  },
];

const COMMITMENTS = [
  "No accounts and no email capture",
  "No analytics, pixels, or session replay",
  "No localStorage, sessionStorage, or IndexedDB",
  "No generated value in URLs, logs, or errors",
  "No insecure random-number fallback",
  "No third-party fonts or scripts at runtime",
];

export function SecuritySection() {
  return (
    <section
      id="security"
      aria-labelledby="security-heading"
      className="relative scroll-mt-24 py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 mx-auto h-[30rem] max-w-4xl rounded-full bg-brand-3/[0.07] blur-[140px]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="security-heading"
          align="center"
          eyebrow="Security model"
          eyebrowIcon={<ShieldCheck className="size-3 text-brand" aria-hidden="true" />}
          title={
            <>
              Your secrets. Your browser.{" "}
              <span className="text-gradient">Your control.</span>
            </>
          }
          description="CipherForge is built around a simple rule: a secret should never leave the device that created it. Here is exactly how that rule is enforced."
        />

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.06} className="h-full">
              <article className="glass-panel group relative h-full overflow-hidden rounded-2xl p-5 transition-colors hover:border-brand/25">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--brand),transparent)] opacity-0 transition-opacity group-hover:opacity-60" />
                <span className="grid size-10 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                  <pillar.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
                <p className="mt-4 flex items-center gap-1.5 border-t border-border/50 pt-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-success">
                  <Check className="size-3" aria-hidden="true" />
                  {pillar.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal y={24} className="mt-4">
          <div className="gradient-border glass-panel relative overflow-hidden rounded-2xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg border border-success/25 bg-success/10 text-success">
                  <LockKeyhole className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Inside the browser boundary</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    The entire pipeline, from entropy to clipboard.
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="h-6 rounded-full border-success/25 bg-success/[0.07] px-2.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-success"
              >
                <span className="size-1.5 rounded-full bg-success" />
                100% local
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FLOW.map((step, index) => (
                <div
                  key={step.label}
                  className="relative rounded-xl border border-border/60 bg-background/40 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-muted/70 text-brand">
                      <step.icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground/60">
                      0{index + 1}
                    </span>
                  </div>
                  <h4 className="mt-3 text-sm font-semibold">{step.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  {index < FLOW.length - 1 ? (
                    <ChevronRight
                      className="absolute -right-[0.7rem] top-1/2 hidden size-4 -translate-y-1/2 text-border lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed border-border/70 bg-background/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <WifiOff className="size-3.5 text-destructive/80" aria-hidden="true" />
                No network request leaves this boundary during generation.
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground/70">
                fetch · xhr · ws · beacon — none
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal y={20}>
            <div className="glass-subtle h-full rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <GlobeLock className="size-4 text-brand" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Security commitments</h3>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {COMMITMENTS.map((commitment) => (
                  <li
                    key={commitment}
                    className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                      <Check className="size-2.5" aria-hidden="true" />
                    </span>
                    {commitment}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal y={20} delay={0.06}>
            <div className="h-full rounded-2xl border border-warning/20 bg-warning/[0.04] p-5">
              <div className="flex items-center gap-2">
                <Fingerprint className="size-4 text-warning" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Honest threat model</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Client-side generation removes server exposure and accidental
                persistence. It cannot protect against a compromised device,
                malicious browser extensions, clipboard snooping, or shoulder
                surfing. Audit the device and use trusted environments for
                high-value credentials.
              </p>
              <p className="mt-3 text-[0.68rem] leading-relaxed text-muted-foreground/80">
                The Web Crypto API requires a secure context. CipherForge is
                designed to run over HTTPS or localhost.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
