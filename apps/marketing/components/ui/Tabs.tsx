"use client";

import { useId, useRef, useState } from "react";
import type { IconName } from "@/config/site";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export interface TabItem {
  id: string;
  label: string;
  icon?: IconName;
}

/**
 * WAI-ARIA tabs with automatic activation: arrow keys move and select,
 * Home/End jump to the ends. Inactive panels stay in the HTML (hidden) so
 * their content is still indexable.
 */
export function Tabs({
  label,
  tabs,
  panels,
  className,
  listClassName,
  scrollable = false,
}: {
  label: string;
  tabs: TabItem[];
  panels: React.ReactNode[];
  className?: string;
  listClassName?: string;
  scrollable?: boolean;
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
    refs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowDown: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      ArrowUp: () => select(active - 1),
      Home: () => select(0),
      End: () => select(tabs.length - 1),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn(
          "flex gap-1.5 rounded-full border border-line bg-surface p-1.5 shadow-soft",
          scrollable ? "no-scrollbar overflow-x-auto" : "flex-wrap justify-center",
          listClassName,
        )}
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${base}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
              i === active ? "bg-ink text-cream shadow-soft dark:bg-cream dark:text-ink" : "text-fg-muted hover:bg-bg-alt hover:text-fg",
            )}
          >
            {t.icon && <Icon name={t.icon} className="size-4" />}
            {t.label}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div
          key={tabs[i].id}
          role="tabpanel"
          id={`${base}-panel-${tabs[i].id}`}
          aria-labelledby={`${base}-tab-${tabs[i].id}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-8 animate-fade rounded-panel focus-visible:outline-offset-8"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
