import {
  ArrowRight,
  ArrowUp,
  Code2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { cn } from "cn";
import { getCopyrightYear } from "../copyright-year";
import { Logo } from "@/components/brand/logo";
import {
  DocumentationDialog,
  PrivacyDialog,
  SecurityDialog,
} from "@/components/layout/info-dialogs";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PRODUCT_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Generator", href: "#generator" },
  { label: "Tools", href: "#tools" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
];

const TOOL_LINKS = [
  { label: "Password generator", href: "#password-generator" },
  { label: "API key generator", href: "#api-key-generator" },
  { label: "Hex generator", href: "#hex-generator" },
  { label: "Base64 generator", href: "#base64-generator" },
  { label: "SHA-256 hash", href: "#sha256-generator" },
  { label: "UUID v4 generator", href: "#uuid-generator" },
];

export const SiteFooter = async () => {
  const year = await getCopyrightYear();

  return (
    <footer className="relative border-t border-border/60 bg-card/20">
      <div className="noise-overlay pointer-events-none absolute inset-0" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="gradient-border glass-panel flex flex-col gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-brand">
              <LockKeyhole className="size-3" aria-hidden="true" />
              Local by architecture
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Ready to forge something secure?
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              No sign-up, no upload, no trace. Just strong secrets, generated in
              the tab you already trust.
            </p>
          </div>
          <a
            href="#generator"
            className={cn(
              buttonVariants({ size: "lg" }),
              "forge-cta h-11 shrink-0 rounded-xl px-5 text-sm font-semibold",
            )}
          >
            Open the generator
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_0.9fr] lg:gap-8">
          <div>
            <a
              href="#home"
              className="inline-flex rounded-lg focus-visible:outline-none"
              aria-label="CipherForge home"
            >
              <Logo showTagline />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A premium, local-first cryptographic secret generator. Built for
              people who would rather not hand their credentials to a server.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="h-6 rounded-full border-success/25 bg-success/[0.06] px-2.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-success"
              >
                <span className="size-1.5 rounded-full bg-success" />
                No cookies
              </Badge>
              <span
                title="GitHub repository coming soon"
                aria-label="GitHub repository coming soon"
                className="inline-flex h-6 cursor-not-allowed items-center gap-1.5 rounded-full border border-border/70 bg-background/40 px-2.5 text-[0.65rem] text-muted-foreground/70"
              >
                <Code2 className="size-3" aria-hidden="true" />
                GitHub
                <span className="rounded-full border border-border/70 px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.1em]">
                  soon
                </span>
              </span>
            </div>
          </div>

          <nav aria-label="Footer product links">
            <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer tool links">
            <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Tools
            </h3>
            <ul className="mt-4 space-y-2.5">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <DocumentationDialog />
              </li>
              <li>
                <SecurityDialog />
              </li>
              <li>
                <PrivacyDialog />
              </li>
              <li>
                <a
                  href="#security"
                  className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Security model
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-border/60 bg-background/30 p-3">
              <p className="text-[0.62rem] leading-relaxed text-muted-foreground">
                Browser support: current Chrome, Edge, Firefox, and Safari in a
                secure context.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              © {year} CipherForge. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground/80">
              <ShieldCheck className="size-3 text-success" aria-hidden="true" />
              Built for privacy. Designed for security.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground/60 sm:inline">
              Local generation active
            </span>
            <a
              href="#home"
              className="inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/40 text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label="Back to top"
            >
              <ArrowUp className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
