"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  Binary,
  Braces,
  Fingerprint,
  Hash,
  KeyRound,
  KeySquare,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { ApiKeyTool } from "@/components/tools/api-key-tool";
import { Base64Tool } from "@/components/tools/base64-tool";
import { HexTool } from "@/components/tools/hex-tool";
import { PasswordTool } from "@/components/tools/password-tool";
import { Sha256Tool } from "@/components/tools/sha256-tool";
import { UuidTool } from "@/components/tools/uuid-tool";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "cn";

const TOOLS: Array<{
  value: string;
  label: string;
  hash: string;
  icon: ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  component: ComponentType;
}> = [
  {
    value: "password",
    label: "Password",
    hash: "password-generator",
    icon: KeyRound,
    component: PasswordTool,
  },
  {
    value: "api-key",
    label: "API Key",
    hash: "api-key-generator",
    icon: KeySquare,
    component: ApiKeyTool,
  },
  {
    value: "hex",
    label: "Hex",
    hash: "hex-generator",
    icon: Binary,
    component: HexTool,
  },
  {
    value: "base64",
    label: "Base64",
    hash: "base64-generator",
    icon: Braces,
    component: Base64Tool,
  },
  {
    value: "sha256",
    label: "SHA-256",
    hash: "sha256-generator",
    icon: Hash,
    component: Sha256Tool,
  },
  {
    value: "uuid",
    label: "UUID v4",
    hash: "uuid-generator",
    icon: Fingerprint,
    component: UuidTool,
  },
];

function toolForHash(hash: string) {
  return TOOLS.find((tool) => `#${tool.hash}` === hash);
}

export function ToolsSection() {
  const [activeTool, setActiveTool] = useState(TOOLS[0].value);

  useEffect(() => {
    function syncFromHash() {
      const match = toolForHash(window.location.hash);

      if (match) {
        setActiveTool(match.value);
      }
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    function handleAnchorClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute("href");

      if (!href) {
        return;
      }

      const match = toolForHash(href);

      if (match) {
        setActiveTool(match.value);
      }
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  function handleValueChange(value: string | number | null) {
    if (typeof value !== "string") {
      return;
    }

    setActiveTool(value);

    const tool = TOOLS.find((item) => item.value === value);

    if (tool) {
      window.history.replaceState(null, "", `#${tool.hash}`);
    }
  }

  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="relative scroll-mt-24 border-y border-border/50 bg-card/20 py-20 sm:py-24 lg:py-28"
    >
      <div className="fine-grid pointer-events-none absolute inset-0 -z-10 opacity-40 mask-fade-b" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[24rem] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,color-mix(in_oklab,var(--brand-3)_10%,transparent),transparent_70%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="tools-heading"
          align="center"
          eyebrow="Security toolkit"
          eyebrowIcon={<Wrench className="size-3 text-brand" aria-hidden="true" />}
          title={
            <>
              Six tools.{" "}
              <span className="text-gradient">Zero exposure.</span>
            </>
          }
          description="From credentials to hashes, every utility runs entirely in your browser. Pick a tool, tune it, and keep the result on your own device."
        />

        <div className="mt-9 grid gap-2.5 sm:grid-cols-3">
          {[
            "One-click secure copy",
            "Keyboard and screen-reader friendly",
            "No sign-up, tracking, or server round-trip",
          ].map((item) => (
            <div
              key={item}
              className="glass-subtle flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-muted-foreground"
            >
              <ShieldCheck className="size-3.5 shrink-0 text-success" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="pointer-events-none mb-2 block h-0 scroll-mt-28">
            {TOOLS.map((tool) => (
              <span key={tool.hash} id={tool.hash} className="block h-0" />
            ))}
          </div>

          <Tabs
            value={activeTool}
            onValueChange={handleValueChange}
            className="gap-4"
          >
            <div className="glass-panel rounded-2xl p-1.5">
              <TabsList className="group-data-horizontal/tabs:h-auto grid h-auto w-full grid-cols-2 gap-1 bg-transparent p-0 sm:grid-cols-3 lg:grid-cols-6">
                {TOOLS.map((tool) => (
                  <TabsTrigger
                    key={tool.value}
                    value={tool.value}
                    className={cn(
                      "h-10 gap-2 rounded-xl px-3 text-[0.8rem] font-medium text-muted-foreground",
                      "hover:bg-muted/50 hover:text-foreground",
                      "data-active:bg-brand/10 data-active:text-brand",
                      "dark:data-active:border-transparent dark:data-active:bg-brand/10 dark:data-active:text-brand",
                    )}
                  >
                    <tool.icon className="size-4" aria-hidden="true" />
                    {tool.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <Card className="gradient-border glass-panel relative overflow-hidden rounded-2xl bg-card/55 py-0 ring-0">
              <CardContent className="p-4 sm:p-6">
                {TOOLS.map((tool) => (
                  <TabsContent
                    key={tool.value}
                    value={tool.value}
                    className="m-0 focus-visible:outline-none"
                  >
                    <tool.component />
                  </TabsContent>
                ))}
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
