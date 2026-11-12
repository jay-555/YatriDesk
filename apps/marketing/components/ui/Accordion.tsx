"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/** Disclosure accordion; the height animation becomes instant under reduced motion (global CSS). */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: readonly { q: string; a: string }[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-panel border border-line bg-surface shadow-soft">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${base}-q-${i}`;
        const panelId = `${base}-a-${i}`;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-semibold text-fg transition-colors hover:bg-surface-2 sm:px-6 sm:text-lg"
              >
                {item.q}
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-alt text-fg transition-transform duration-300",
                    isOpen && "rotate-45 bg-saffron-soft text-brand",
                  )}
                  aria-hidden
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
              inert={!isOpen}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-fg-muted sm:px-6">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
