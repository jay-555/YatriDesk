import { AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

const bars = [28, 42, 35, 58, 46, 72, 90];
const days = ["S", "M", "T", "W", "T", "F", "S"];

export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Owner's phone app showing today's sales of ₹48,250, up 12%, a weekly chart and a low-stock alert for paneer."
      className={cn(
        "rounded-[30px] border-[6px] border-ink bg-ink p-0 shadow-lift select-none dark:border-[#2a2f37]",
        className,
      )}
    >
      <div aria-hidden className="relative overflow-hidden rounded-[24px] bg-surface text-[10px] leading-snug text-fg">
        <div className="mx-auto mt-1.5 h-4 w-16 rounded-full bg-ink dark:bg-[#2a2f37]" aria-hidden />
        <div className="px-3 pt-2 pb-3">
          <p className="text-fg-muted">Today · Main outlet</p>
          <p className="font-display text-[20px] leading-tight font-bold">₹48,250</p>
          <p className="flex items-center gap-1 font-semibold text-herb">
            <TrendingUp className="size-3" aria-hidden /> 12% vs last Friday
          </p>

          <div className="mt-3 flex h-16 items-end gap-1.5" aria-hidden>
            {bars.map((h, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn("w-full rounded-t-[4px]", i === bars.length - 1 ? "bg-brand" : "bg-saffron-soft")}
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[8px] text-fg-muted">{days[i]}</span>
              </div>
            ))}
          </div>

          <ul className="mt-3 space-y-1 tabular-nums">
            {[
              ["UPI", "₹21,400"],
              ["Cash", "₹14,850"],
              ["Card", "₹11,000"],
              ["Other", "₹1,000"],
            ].map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-line pb-1 last:border-0">
                <span className="text-fg-muted">{k}</span>
                <span className="font-semibold">{v}</span>
              </li>
            ))}
          </ul>

          <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-saffron-soft p-2 text-brand">
            <AlertTriangle className="mt-px size-3 shrink-0" aria-hidden />
            <span>
              <b>Paneer</b> is low: 1.8 kg left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
