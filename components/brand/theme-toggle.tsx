"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "cn";

import { useMounted } from "@/hooks/use-mounted";

const THEME_LABELS = {
  light: "Light",
  dark: "Dark",
  system: "System",
} as const;

const NEXT_THEME = {
  light: "dark",
  dark: "system",
  system: "light",
} as const;

type ThemeName = keyof typeof THEME_LABELS;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="size-9 rounded-full border border-transparent"
      />
    );
  }

  const currentTheme: ThemeName =
    theme === "light" || theme === "dark" ? theme : "system";
  const nextTheme = NEXT_THEME[currentTheme];

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Current theme: ${THEME_LABELS[currentTheme]}. Switch to ${THEME_LABELS[nextTheme]}.`}
      title={`Theme: ${THEME_LABELS[currentTheme]} — click for ${THEME_LABELS[nextTheme]}`}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-transparent text-muted-foreground transition-colors",
        "hover:border-border hover:bg-muted/60 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
      )}
    >
      {currentTheme === "light" ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : currentTheme === "dark" ? (
        <Moon className="size-4" aria-hidden="true" />
      ) : (
        <Monitor className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
