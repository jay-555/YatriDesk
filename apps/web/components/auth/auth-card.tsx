"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="brand-theme relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-56 left-1/2 h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_9%,transparent),transparent_68%)]" />
        <div className="absolute -bottom-72 -left-48 h-[34rem] w-[40rem] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--success)_7%,transparent),transparent_68%)]" />
      </div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn("my-auto w-full max-w-md", className)}
      >
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- "/" may be served by the marketing site zone (proxy.ts): needs a full page load */}
        <a
          href="/"
          aria-label="YatriDesk home"
          className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-card)]">
            <Logo size={32} />
          </span>
          <span className="text-left">
            <span className="block font-heading text-base font-bold tracking-tight text-foreground">
              YatriDesk
            </span>
            <span className="block text-xs text-muted-foreground">Restaurant operations</span>
          </span>
        </a>

        <section className="rounded-[28px] border border-border/80 bg-card/95 p-6 shadow-[var(--shadow-card)] backdrop-blur sm:p-8">
          <header className="mb-7">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              Made for restaurant teams
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </header>

          {children}
        </section>

        <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>
        <p className="mt-6 text-center text-xs text-muted-foreground/80">
          Built for India <span className="mx-1.5 text-border" aria-hidden>·</span> Works online and offline
        </p>
      </motion.div>
    </main>
  );
}
