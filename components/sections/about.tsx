import {
  ArrowRight,
  BookOpen,
  Ear,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Privacy is the default",
    description:
      "No account, no cookie banner, no consent maze. The safest data is the data that never leaves your device.",
  },
  {
    icon: Zap,
    title: "Speed without shortcuts",
    description:
      "Native Web Crypto is fast enough that strong security costs you nothing in response time.",
  },
  {
    icon: HeartHandshake,
    title: "No dark patterns",
    description:
      "No fake urgency, no locked features, no upsell after generation. The tools are the product.",
  },
  {
    icon: BookOpen,
    title: "Clear over clever",
    description:
      "Plain-language explanations, honest limitations, and visible security details instead of vague badges.",
  },
];

const AUDIENCES = [
  "Developers",
  "Sysadmins",
  "Founders",
  "Privacy advocates",
  "Security teams",
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative scroll-mt-24 border-t border-border/50 py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[26rem] bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,color-mix(in_oklab,var(--brand)_8%,transparent),transparent_70%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <SectionHeading
              id="about-heading"
              eyebrow="About CipherForge"
              eyebrowIcon={<Users className="size-3 text-brand" aria-hidden="true" />}
              title={
                <>
                  Security tools should feel like a{" "}
                  <span className="text-gradient">workshop, not a warning label.</span>
                </>
              }
              description="CipherForge is a focused, local-first toolkit for the secrets you create every day."
            />

            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
              <p>
                Most online generators ask you to trust a server you cannot
                see. We wanted something better: a tool where the security
                claim is architectural, not a promise. Every operation here
                happens inside your browser using the Web Crypto API.
              </p>
              <p>
                There is no backend to breach, no database to leak, and no
                account to protect. Generated values exist only in this
                page&apos;s memory until you copy or download them — and then
                they are yours alone.
              </p>
              <p className="text-foreground/90">
                One small toolkit. No noise. No telemetry. Just the secrets you
                need, forged locally.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {AUDIENCES.map((audience) => (
                <Badge
                  key={audience}
                  variant="outline"
                  className="h-6 rounded-full border-border/70 bg-card/40 px-2.5 text-[0.65rem] font-normal text-muted-foreground"
                >
                  {audience}
                </Badge>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#generator"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "forge-cta h-11 rounded-xl px-5 text-sm font-semibold",
                )}
              >
                Open the forge
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#security"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-xl border-border/80 bg-background/40 px-5 text-sm",
                )}
              >
                Read the security model
              </a>
            </div>
          </div>

          <Reveal y={24} delay={0.08}>
            <div className="gradient-border glass-panel relative overflow-hidden rounded-2xl p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-brand/15 blur-3xl" />

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Sparkles className="size-3 text-brand" aria-hidden="true" />
                  Local-first by design
                </span>
                <Badge
                  variant="outline"
                  className="h-6 rounded-full border-brand/25 bg-brand/[0.07] px-2.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand"
                >
                  v1.0
                </Badge>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { value: "0", label: "bytes transmitted" },
                  { value: "0", label: "secrets persisted" },
                  { value: "100%", label: "client-side" },
                  { value: "6", label: "focused tools" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/60 bg-background/40 px-3.5 py-4"
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                      {stat.value}
                    </dd>
                    <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>

              <blockquote className="mt-6 border-l-2 border-brand/40 pl-4">
                <p className="text-sm italic leading-relaxed text-foreground/85">
                  &ldquo;The best privacy policy is a product that does not
                  need your data in the first place.&rdquo;
                </p>
                <footer className="mt-2 flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  <Ear className="size-3" aria-hidden="true" />
                  The CipherForge principle
                </footer>
              </blockquote>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-success/20 bg-success/[0.05] px-3 py-2.5 text-[0.68rem] text-muted-foreground">
                <span className="size-1.5 shrink-0 rounded-full bg-success" />
                No cookies, no analytics, no third-party runtime scripts.
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.05} className="h-full">
              <article className="glass-subtle h-full rounded-2xl p-4.5 transition-colors hover:border-brand/20">
                <span className="grid size-9 place-items-center rounded-lg border border-border/70 bg-background/50 text-brand">
                  <principle.icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-semibold">{principle.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {principle.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
