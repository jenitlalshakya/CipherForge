import { cn } from "cn";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className, size = 36 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient
          id="cf-mark-gradient"
          x1="6"
          y1="3"
          x2="39"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--brand-2)" />
          <stop offset="0.52" stopColor="var(--brand)" />
          <stop offset="1" stopColor="var(--brand-3)" />
        </linearGradient>
        <linearGradient
          id="cf-mark-fill"
          x1="10"
          y1="8"
          x2="34"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--brand)" stopOpacity="0.26" />
          <stop offset="1" stopColor="var(--brand-3)" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path
        d="M22 2.75 38.5 9.6v10.92c0 9.63-6.42 16.4-16.5 20.73C11.92 36.92 5.5 30.15 5.5 20.52V9.6L22 2.75Z"
        fill="url(#cf-mark-fill)"
        stroke="url(#cf-mark-gradient)"
        strokeWidth="1.7"
      />
      <path
        d="M22 12.25a6.1 6.1 0 0 0-3.5 11.1v4.4a1.9 1.9 0 0 0 1.9 1.9h3.2a1.9 1.9 0 0 0 1.9-1.9v-4.4a6.1 6.1 0 0 0-3.5-11.1Z"
        stroke="url(#cf-mark-gradient)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="18.35" r="2.05" fill="var(--brand-2)" />
      <path
        d="M22 20.4v3.1"
        stroke="var(--brand-2)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.6 15.4h4.1M31.3 15.4h4.1M8.6 22.1h2.8M32.6 22.1h2.8"
        stroke="url(#cf-mark-gradient)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
  size?: number;
}

export function Logo({
  className,
  markClassName,
  showTagline = false,
  size = 36,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex">
        <span className="absolute inset-0 rounded-xl bg-brand/20 blur-lg" />
        <LogoMark size={size} className={cn("relative", markClassName)} />
      </span>
      <span className="flex flex-col">
        <span className="font-heading text-[1.05rem] font-semibold leading-none tracking-tight text-foreground">
          Cipher<span className="text-gradient">Forge</span>
        </span>
        {showTagline ? (
          <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Cryptography, locally
          </span>
        ) : null}
      </span>
    </span>
  );
}
