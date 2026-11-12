import { cn } from "@/lib/cn";

/** Rounded app window with traffic-light dots and a title. */
export function AppWindow({
  title,
  right,
  className,
  children,
  label,
}: {
  title: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "@container overflow-hidden rounded-[18px] border border-line bg-surface text-[11px] leading-snug text-fg shadow-lift select-none",
        className,
      )}
    >
      {/* The label above describes the screen; its inner text is decorative. */}
      <div aria-hidden>
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-3 py-2">
          <span className="flex gap-1.5">
            <i className="size-2.5 rounded-full bg-[#F87171]" />
            <i className="size-2.5 rounded-full bg-[#FBBF24]" />
            <i className="size-2.5 rounded-full bg-[#34D399]" />
          </span>
          <span className="truncate font-semibold text-fg-muted">{title}</span>
          <span className="ms-auto">{right}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Indian food-label mark: green square/dot = veg, red = non-veg. */
export function DietMark({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-3 shrink-0 items-center justify-center rounded-[3px] border-[1.5px]",
        veg ? "border-[#1E8E3E]" : "border-[#C5221F]",
      )}
      aria-hidden
    >
      <i className={cn("size-1.5 rounded-full", veg ? "bg-[#1E8E3E]" : "bg-[#C5221F]")} />
    </span>
  );
}

export function Pill({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 font-medium whitespace-nowrap",
        active ? "bg-ink text-cream dark:bg-cream dark:text-ink" : "bg-bg-alt text-fg-muted",
      )}
    >
      {children}
    </span>
  );
}

export const rupee = (n: number, paise = false) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: paise ? 2 : 0, maximumFractionDigits: paise ? 2 : 0 })}`;
