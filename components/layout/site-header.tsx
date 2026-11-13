"use client";

import { useState } from "react";
import { ArrowRight, Menu, ShieldCheck } from "lucide-react";
import { cn } from "cn";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 -z-10 border-b border-border/60 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60" />
      <div className="hairline-top absolute inset-x-0 top-0 -z-10 h-px opacity-60" />

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <a
          href="#home"
          className="rounded-lg focus-visible:outline-none"
          aria-label="CipherForge home"
        >
          <Logo />
        </a>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <ThemeToggle />
          <a
            href="#generator"
            className={cn(
              buttonVariants({ size: "lg" }),
              "forge-cta hidden h-9 rounded-full px-4 text-[0.8rem] font-semibold sm:inline-flex",
            )}
          >
            Start Generating
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full border border-border/70 text-muted-foreground md:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-4.5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(88vw,22rem)] border-border/70 bg-background/95 p-0 backdrop-blur-2xl"
            >
              <SheetHeader className="border-b border-border/60 p-5">
                <SheetTitle className="sr-only">CipherForge navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate to the generator, security details, and about
                  sections. Use the theme control to switch appearance.
                </SheetDescription>
                <Logo showTagline />
              </SheetHeader>

              <nav
                className="flex flex-1 flex-col gap-1 p-4"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-foreground/80 transition-colors hover:bg-muted/70 hover:text-foreground"
                  >
                    {link.label}
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </a>
                ))}
              </nav>

              <div className="mt-auto space-y-3 border-t border-border/60 p-5">
                <a
                  href="#generator"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "forge-cta h-11 w-full rounded-xl text-sm font-semibold",
                  )}
                >
                  Start Generating
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
                    Generation stays local
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
