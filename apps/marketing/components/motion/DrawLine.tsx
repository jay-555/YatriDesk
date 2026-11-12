"use client";

import { m } from "motion/react";
import { cn } from "@/lib/cn";

/** A connector line that draws itself (left to right, or top to bottom) when scrolled into view. */
export function DrawLine({ vertical = false, className }: { vertical?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("overflow-hidden rounded-full bg-line", className)}>
      <m.div
        className={cn("h-full w-full rounded-full bg-gradient-to-r from-saffron to-herb", vertical && "bg-gradient-to-b")}
        style={{ originX: 0, originY: 0 }}
        initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
        whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
