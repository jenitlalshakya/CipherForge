"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Braces,
  Cpu,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const PARTICLES = [
  { left: "8%", top: "18%", delay: 0, size: 3 },
  { left: "18%", top: "72%", delay: 1.2, size: 2 },
  { left: "28%", top: "8%", delay: 2.1, size: 2 },
  { left: "74%", top: "12%", delay: 0.6, size: 3 },
  { left: "88%", top: "36%", delay: 1.8, size: 2 },
  { left: "82%", top: "76%", delay: 2.5, size: 2 },
  { left: "62%", top: "88%", delay: 0.9, size: 2 },
  { left: "42%", top: "92%", delay: 1.5, size: 3 },
  { left: "6%", top: "48%", delay: 2.8, size: 2 },
  { left: "94%", top: "58%", delay: 0.3, size: 2 },
];

const HEX_FRAGMENTS = ["7f a3 9c 2e", "b8 04 e1 6d", "3a f9 12 c7"];

export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 80, damping: 18, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 80, damping: 18, mass: 0.5 });
  const translateX = useTransform(springX, [-0.5, 0.5], [-9, 9]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !containerRef.current) {
      return;
    }

    const bounds = containerRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Animated illustration of a browser-based cryptographic engine: secure random entropy entering a shield, surrounded by encrypted data fragments."
      className="relative mx-auto w-full max-w-[34rem] select-none py-6 lg:py-2"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="absolute inset-8 rounded-full bg-brand/18 blur-[90px]" />
      <div className="absolute inset-20 rounded-full bg-brand-3/12 blur-[70px]" />

      <motion.div
        style={
          reduceMotion
            ? undefined
            : { x: translateX, y: translateY, rotateX, rotateY }
        }
        className="relative aspect-square [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 rounded-full border border-brand/12" />
        <div className="absolute inset-[7%] rounded-full border border-dashed border-brand/20 animate-orbit">
          <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-2 shadow-[0_0_16px_var(--brand-2)]" />
          <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand/70" />
        </div>
        <div className="absolute inset-[16%] rounded-full border border-brand/10 animate-orbit-reverse">
          <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-3 shadow-[0_0_14px_var(--brand-3)]" />
        </div>

        <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklab,var(--brand-2)_24%,transparent),transparent_65%)]" />
        <div className="absolute inset-[30%] rounded-full border border-brand/20 bg-card/30 backdrop-blur-xl" />
        <div className="absolute inset-[34%] rounded-full border border-brand/25 bg-background/55 backdrop-blur-md" />

        <motion.div
          animate={
            reduceMotion ? undefined : { y: [0, -7, 0] }
          }
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 flex size-[31%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <div className="relative grid size-full place-items-center rounded-[2rem] border border-brand/25 bg-card/80 shadow-[0_20px_80px_-20px_var(--brand)] backdrop-blur-2xl">
            <span className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(145deg,color-mix(in_oklab,var(--brand)_18%,transparent),transparent_55%)]" />
            <ShieldCheck
              className="relative size-12 text-brand sm:size-14"
              strokeWidth={1.4}
              aria-hidden="true"
            />
            <span className="absolute -bottom-2.5 flex items-center gap-1.5 rounded-full border border-success/30 bg-background/90 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-success shadow-lg sm:text-[0.6rem]">
              <span className="size-1.5 rounded-full bg-success animate-pulse-soft" />
              CSPRNG active
            </span>
          </div>
        </motion.div>

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
          transition={{
            duration: 7.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute left-0 top-[14%] flex items-center gap-2 rounded-xl border border-brand/20 bg-card/70 px-3 py-2 shadow-xl backdrop-blur-xl"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-brand/10 text-brand">
            <Fingerprint className="size-3.5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground">
              Entropy
            </span>
            <span className="font-mono text-[0.68rem] text-foreground">
              256-bit source
            </span>
          </span>
        </motion.div>

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute right-0 top-[20%] flex items-center gap-2 rounded-xl border border-brand-3/20 bg-card/70 px-3 py-2 shadow-xl backdrop-blur-xl"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-brand-3/10 text-brand-3">
            <Cpu className="size-3.5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground">
              Runtime
            </span>
            <span className="font-mono text-[0.68rem] text-foreground">
              Web Crypto
            </span>
          </span>
        </motion.div>

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{
            duration: 6.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1.6,
          }}
          className="absolute right-[2%] top-[54%] flex items-center gap-2 rounded-xl border border-brand/15 bg-card/65 px-3 py-2 shadow-xl backdrop-blur-xl"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-brand-2/10 text-brand-2">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground">
              Output
            </span>
            <span className="font-mono text-[0.68rem] text-foreground">
              local only
            </span>
          </span>
        </motion.div>

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
          transition={{
            duration: 7.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.8,
          }}
          className="absolute bottom-[13%] left-[1%] flex items-center gap-2 rounded-xl border border-border/80 bg-card/70 px-3 py-2 shadow-xl backdrop-blur-xl"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-muted text-muted-foreground">
            <KeyRound className="size-3.5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground">
              Cipher
            </span>
            <span className="font-mono text-[0.68rem] text-foreground">
              cf_live_•••••
            </span>
          </span>
        </motion.div>

        <div className="absolute bottom-[2%] left-1/2 w-[78%] -translate-x-1/2 overflow-hidden rounded-xl border border-brand/15 bg-background/80 p-3 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-muted-foreground">
              <Braces className="size-3 text-brand" aria-hidden="true" />
              local pipeline
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-success/80" />
              <span className="size-1.5 rounded-full bg-success/60" />
              <span className="size-1.5 rounded-full bg-success/40" />
            </span>
          </div>
          <div className="space-y-1.5">
            {HEX_FRAGMENTS.map((fragment, index) => (
              <div key={fragment} className="flex items-center gap-2">
                <span className="text-[0.55rem] tabular-nums text-muted-foreground/60">
                  0{index + 1}
                </span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-[linear-gradient(90deg,var(--brand-2),var(--brand))]"
                    style={{ width: `${68 - index * 12}%` }}
                  />
                </span>
                <span className="font-mono text-[0.55rem] text-muted-foreground">
                  {fragment}
                </span>
              </div>
            ))}
          </div>
          <AnimatePresence>
            <motion.div
              initial={false}
              animate={reduceMotion ? undefined : { y: ["0%", "280%"] }}
              transition={{
                duration: 4.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--brand-2),transparent)] opacity-60"
            />
          </AnimatePresence>
        </div>

        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="absolute rounded-full bg-brand-2/70 shadow-[0_0_10px_var(--brand-2)] animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${5 + particle.size}s`,
            }}
          />
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_50%,var(--background)_92%)]" />
      <div className="pointer-events-none absolute inset-0 noise-overlay rounded-full" />
    </div>
  );
}
