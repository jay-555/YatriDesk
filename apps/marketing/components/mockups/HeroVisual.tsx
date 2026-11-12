"use client";

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useRef } from "react";

/**
 * Layered mockups that drift slightly with the pointer on desktop (each layer
 * by a different amount, for depth). Phones get the POS full-width with a
 * payment toast; the kitchen display and phone layers appear from `sm` up.
 * Pointer drift is off for reduced motion and touch.
 */
export function HeroVisual({
  back,
  middle,
  front,
}: {
  back: React.ReactNode;
  middle: React.ReactNode;
  front: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 20 });
  const sy = useSpring(py, { stiffness: 80, damping: 20 });

  const backX = useTransform(sx, (v) => v * -10);
  const backY = useTransform(sy, (v) => v * -8);
  const midX = useTransform(sx, (v) => v * 6);
  const midY = useTransform(sy, (v) => v * 4);
  const frontX = useTransform(sx, (v) => v * 16);
  const frontY = useTransform(sy, (v) => v * 12);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  // Entrance animations sit on inner wrappers: a CSS transform animation on
  // the m.div itself would override the pointer-driven transform.
  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className="relative mx-auto w-full max-w-[660px] pb-6 sm:aspect-[6/5] sm:pb-0"
    >
      {/* A soft gradient, not a filter blur: blur on an element this large is very costly to paint on low-end phones. */}
      <div aria-hidden className="absolute inset-[-12%] -z-10 bg-glow" />

      <m.div style={{ x: backX, y: backY }} className="absolute top-0 right-0 hidden w-[60%] sm:block">
        <div className="animate-rise opacity-95 [animation-delay:250ms]">{back}</div>
      </m.div>

      <m.div style={{ x: midX, y: midY }} className="relative z-10 w-full sm:absolute sm:top-[16%] sm:left-0 sm:w-[72%]">
        <div className="animate-rise [animation-delay:100ms]">{middle}</div>
      </m.div>

      {/* The phone sits right of the POS, never over its price column. */}
      <m.div style={{ x: frontX, y: frontY }} className="absolute right-0 bottom-0 z-20 hidden w-[27%] sm:block">
        <div className="animate-rise [animation-delay:400ms]">
          <div className="motion-safe:animate-float">{front}</div>
        </div>
      </m.div>

      <div
        aria-hidden
        className="absolute bottom-0 left-4 z-20 flex animate-rise items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-fg shadow-lift [animation-delay:450ms] sm:hidden"
      >
        <CheckCircle2 className="size-4 text-herb" />
        UPI payment received · ₹803 · Table 7
      </div>
    </div>
  );
}
