"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { T } from "@/components/i18n/LanguageProvider";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Disclosure dropdown: Enter/Space/ArrowDown opens it, arrows move between
 * links, Esc closes and returns focus to the trigger, clicking outside closes.
 */
export function ResourcesMenu() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const links = () => Array.from(root.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-link]") ?? []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = links();
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      requestAnimationFrame(() => links()[index < 0 ? 0 : (index + 1) % items.length]?.focus());
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      items[index <= 0 ? items.length - 1 : index - 1]?.focus();
    } else if (e.key === "Tab" && open && index === items.length - 1 && !e.shiftKey) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!root.current?.contains(document.activeElement)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-11 items-center gap-1 rounded-full px-3.5 text-sm font-medium text-fg transition-colors hover:bg-bg-alt aria-expanded:bg-bg-alt"
      >
        <T k="nav.resources" />
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <div
        id={id}
        hidden={!open}
        className="absolute top-full left-1/2 z-50 mt-2 w-80 -translate-x-1/2 animate-fade rounded-card border border-line bg-surface p-2 shadow-lift before:absolute before:inset-x-0 before:-top-3 before:h-3 before:content-['']"
      >
        <ul>
          {site.nav.resources.map((r) => (
            <li key={r.label}>
              <a
                data-menu-link
                href={r.href}
                onClick={() => setOpen(false)}
                className="flex flex-col rounded-xl px-3 py-2.5 transition-colors hover:bg-bg-alt focus-visible:bg-bg-alt"
              >
                <span className="text-sm font-semibold text-fg">{r.label}</span>
                <span className="text-xs text-fg-muted">{r.description}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="border-t border-line px-3 pt-2 pb-1 text-xs text-fg-muted">Coming soon — guides are being written.</p>
      </div>
    </div>
  );
}
