import type { ReactNode } from "react";
import { cn } from "cn";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  eyebrowIcon?: ReactNode;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
  eyebrowIcon,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Badge
        variant="outline"
        className="mb-5 h-auto gap-2 rounded-full border-border/80 bg-card/45 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm"
      >
        {eyebrowIcon ?? (
          <Sparkles className="size-3 text-brand" aria-hidden="true" />
        )}
        {eyebrow}
      </Badge>
      <h2
        id={id}
        className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl lg:text-[2.85rem]"
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]",
            align === "center" && "mx-auto max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
