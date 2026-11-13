import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Fingerprint,
  Hash,
  Home,
  KeyRound,
  KeySquare,
  SearchX,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "cn";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { getCopyrightYear } from "@/components/copyright-year";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "404 – Page not found",
  description:
    "This page could not be found. Head back to CipherForge to generate passwords, API keys, hashes, and tokens locally in your browser.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: null,
  openGraph: null,
  twitter: null,
};

const DESTINATIONS = [
  {
    label: "Password generator",
    description: "Strong, cryptographically random passwords",
    href: "/#password-generator",
    icon: KeyRound,
  },
  {
    label: "API key generator",
    description: "Prefixed, high-entropy API tokens",
    href: "/#api-key-generator",
    icon: KeySquare,
  },
  {
    label: "SHA-256 hash",
    description: "Hash any text with crypto.subtle",
    href: "/#sha256-generator",
    icon: Hash,
  },
  {
    label: "UUID v4 generator",
    description: "Standards-compliant unique identifiers",
    href: "/#uuid-generator",
    icon: Fingerprint,
  },
];

export default async function NotFound() {
  const year = await getCopyrightYear();

  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="page-grid pointer-events-none absolute inset-0 -z-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[36rem] bg-[radial-gradient(ellipse_65%_60%_at_50%_0%,color-mix(in_oklab,var(--brand)_14%,transparent),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 -z-20 size-[24rem] rounded-full bg-brand-3/[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 -z-20 size-[22rem] rounded-full bg-brand-2/[0.08] blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="noise-overlay pointer-events-none absolute inset-0 -z-10"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className="rounded-lg focus-visible:outline-none"
        >
          <Logo />
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <ThemeToggle />
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden h-9 rounded-full border-border/70 bg-background/40 px-4 text-[0.8rem] font-medium backdrop-blur-sm sm:inline-flex",
            )}
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16"
      >
        <section
          aria-labelledby="not-found-heading"
          className="w-full max-w-2xl"
        >
          <div className="gradient-border glass-panel inner-glow relative overflow-hidden rounded-3xl p-6 text-center sm:p-10">
            <div
              aria-hidden="true"
              className="hairline-top absolute inset-x-0 top-0 h-px opacity-70"
            />

            <Badge
              variant="outline"
              className="h-auto gap-2 rounded-full border-destructive/25 bg-destructive/[0.06] px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-destructive"
            >
              <SearchX className="size-3" aria-hidden="true" />
              Error 404 · Route not found
            </Badge>

            <p
              aria-hidden="true"
              className="text-gradient mt-6 font-mono text-[4.25rem] font-bold leading-none tracking-[-0.07em] sm:text-[5.75rem]"
            >
              404
            </p>

            <h1
              id="not-found-heading"
              className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-[2rem]"
            >
              This path doesn&apos;t decrypt.
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              The page you were looking for was moved, renamed, or never
              existed. Nothing on your device was exposed — every secret stays
              local, so there is nothing stored on a server to recover.
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
              <Link
                href="/"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "forge-cta h-11 w-full rounded-xl px-5 text-sm font-semibold sm:w-auto",
                )}
              >
                <Home className="size-4" aria-hidden="true" />
                Return to the forge
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#generator"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 w-full rounded-xl border-border/80 bg-background/40 px-5 text-sm font-medium backdrop-blur-sm hover:bg-muted/60 sm:w-auto",
                )}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Generate a secret
              </Link>
            </div>

            <div className="mt-9 border-t border-border/60 pt-6 text-left">
              <h2 className="text-center font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Popular destinations
              </h2>

              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {DESTINATIONS.map((destination) => (
                  <li key={destination.href}>
                    <Link
                      href={destination.href}
                      className="group glass-subtle flex h-full items-start gap-3 rounded-xl px-3.5 py-3 transition-colors hover:border-brand/30 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand/15">
                        <destination.icon
                          className="size-4"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-tight text-foreground">
                          {destination.label}
                        </span>
                        <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                          {destination.description}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-1.5 size-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/60 bg-card/20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <p className="text-xs text-muted-foreground">
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground/80">
            <ShieldCheck className="size-3 text-success" aria-hidden="true" />
            Local by architecture — nothing about this request was stored.
          </p>
        </div>
      </footer>
    </div>
  );
}
