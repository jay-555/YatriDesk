"use client";

import { LazyMotion, MotionConfig } from "motion/react";

// Animation features load in their own chunk after the page is interactive.
const loadFeatures = () => import("./features").then((m) => m.default);

/** Loads only the DOM animation features (lazily), and honours prefers-reduced-motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
