"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const fmt = new Intl.NumberFormat("en-IN");

/**
 * Counts up to `value` when scrolled into view. The server renders the final
 * number (so it's correct without JS); the count-up only runs on the client.
 */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (reduced || started.current) return;
    if (!inView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset off-screen before counting up
      setShown(0);
      return;
    }
    started.current = true;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {fmt.format(shown)}
      {suffix}
    </span>
  );
}
