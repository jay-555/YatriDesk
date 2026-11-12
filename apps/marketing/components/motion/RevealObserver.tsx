"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveals every [data-reveal] element as it scrolls into view. Hiding is only
 * switched on after the observer's first report, by which time anything
 * already on screen is marked visible, so nothing above the fold flickers.
 * (No getBoundingClientRect here: it would force layout of sections that
 * content-visibility is skipping.)
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
        if (first) {
          first = false;
          root.classList.add("reveal-ready");
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
