"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delay={250}>
        {children}
        <Toaster
          position="bottom-right"
          offset={20}
          gap={10}
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "!rounded-xl !border-border !bg-popover/95 !text-popover-foreground !backdrop-blur-xl !shadow-[0_20px_70px_-30px_rgba(0,0,0,0.8)]",
              description: "!text-muted-foreground",
            },
          }}
        />
      </TooltipProvider>
    </ThemeProvider>
  );
}
