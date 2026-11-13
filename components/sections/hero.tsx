import {
  ArrowRight,
  Cpu,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { cn } from "cn";

import { Reveal } from "@/components/motion/reveal";
import { HeroVisual } from "@/components/sections/hero-visual";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TRUST_POINTS = [
  {
    icon: Cpu,
    title: "Web Crypto only",
    detail: "CSPRNG, never Math.random",
  },
  {
    icon: WifiOff,
    title: "Zero network calls",
    detail: "Nothing is uploaded",
  },
  {
    icon: LockKeyhole,
    title: "Zero storage",
    detail: "No cookies, no logs, no traces",
  },
];

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pb-20 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24"
    >
      <div className="page-grid pointer-events-none absolute inset-0 -z-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,color-mix(in_oklab,var(--brand)_16%,transparent),transparent_70%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-[28rem] rounded-full bg-brand-3/[0.08] blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 top-16 -z-10 size-[26rem] rounded-full bg-brand-2/[0.08] blur-[120px]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8 xl:gap-12">
          <div className="max-w-2xl">
            <Reveal y={14}>
              <Badge
                variant="outline"
                className="h-auto gap-2 rounded-full border-brand/25 bg-brand/[0.07] px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-brand-2 backdrop-blur-sm"
              >
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                </span>
                Browser-native cryptography
              </Badge>
            </Reveal>

            <Reveal y={20} delay={0.06}>
              <h1
                id="hero-heading"
                className="mt-6 text-balance text-[2.7rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[4.15rem] xl:text-[4.6rem]"
              >
                Generate secrets.
                <span className="mt-1 block text-gradient">
                  Stay secure.
                </span>
              </h1>
            </Reveal>

            <Reveal y={20} delay={0.12}>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Create strong passwords, API keys, hashes, and cryptographic
                tokens with the same browser APIs trusted by security teams.
                Everything is generated locally — <span className="text-foreground">nothing is sent, logged, or stored.</span>
              </p>
            </Reveal>

            <Reveal y={18} delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#generator"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "forge-cta h-12 rounded-xl px-6 text-sm font-semibold",
                  )}
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                  Generate a secret
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a
                  href="#tools"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 rounded-xl border-border/80 bg-background/40 px-6 text-sm font-medium backdrop-blur-sm hover:bg-muted/60",
                  )}
                >
                  Explore security tools
                </a>
              </div>
            </Reveal>

            <Reveal y={16} delay={0.24}>
              <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
                No account. No upload. No trace.
                <span className="mx-1 hidden h-3 w-px bg-border sm:block" />
                <span className="hidden sm:inline">
                  Works fully offline after load.
                </span>
              </p>
            </Reveal>

            <Reveal y={18} delay={0.3}>
              <ul className="mt-9 grid gap-2.5 sm:grid-cols-3">
                {TRUST_POINTS.map((point) => (
                  <li
                    key={point.title}
                    className="glass-subtle flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                  >
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                      <point.icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[0.7rem] font-semibold leading-tight text-foreground">
                        {point.title}
                      </span>
                      <span className="mt-0.5 text-[0.65rem] leading-snug text-muted-foreground">
                        {point.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal y={24} delay={0.12} className="relative">
            <HeroVisual />
          </Reveal>
        </div>

        <Reveal y={16} delay={0.36}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border/50 pt-6 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground/70 sm:mt-16">
            <span className="flex items-center gap-2">
              <Fingerprint className="size-3.5 text-brand/70" aria-hidden="true" />
              256-bit secure entropy
            </span>
            <span className="hidden size-1 rounded-full bg-border sm:block" />
            <span className="flex items-center gap-2">
              <Cpu className="size-3.5 text-brand/70" aria-hidden="true" />
              Runs entirely in your browser
            </span>
            <span className="hidden size-1 rounded-full bg-border sm:block" />
            <span className="flex items-center gap-2">
              <LockKeyhole className="size-3.5 text-brand/70" aria-hidden="true" />
              No server ever sees a secret
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
