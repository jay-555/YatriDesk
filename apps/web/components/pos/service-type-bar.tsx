"use client";

import { cn } from "@/lib/utils";

export type PosOrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

const OPTIONS: { value: PosOrderType; label: string }[] = [
  { value: "DINE_IN", label: "Dine-in" },
  { value: "TAKEAWAY", label: "Takeaway" },
  { value: "DELIVERY", label: "Delivery" },
];

export function ServiceTypeBar({
  value,
  onChange,
}: {
  value: PosOrderType;
  onChange: (type: PosOrderType) => void;
}) {
  return (
    <div role="group" aria-label="Order type" className="grid shrink-0 grid-cols-3 gap-2">
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-11 rounded-lg border px-2 text-sm font-medium transition-colors",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
