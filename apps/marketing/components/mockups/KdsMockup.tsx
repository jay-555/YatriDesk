import { Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { AppWindow } from "./parts";

type Ticket = {
  kot: number;
  where: string;
  mins: number;
  items: { qty: number; name: string; note?: string }[];
};

const columns: { title: string; tone: string; tickets: Ticket[] }[] = [
  {
    title: "New",
    tone: "bg-saffron",
    tickets: [
      { kot: 218, where: "Table 4", mins: 1, items: [{ qty: 2, name: "Masala Dosa" }, { qty: 2, name: "Filter Coffee", note: "Less sugar" }] },
      { kot: 217, where: "Takeaway", mins: 3, items: [{ qty: 1, name: "Veg Biryani" }, { qty: 1, name: "Boondi Raita" }] },
    ],
  },
  {
    title: "Cooking",
    tone: "bg-turmeric",
    tickets: [
      { kot: 215, where: "Table 7", mins: 7, items: [{ qty: 1, name: "Paneer Butter Masala" }, { qty: 3, name: "Butter Naan" }] },
      { kot: 214, where: "Delivery", mins: 11, items: [{ qty: 2, name: "Chicken 65", note: "Extra spicy" }] },
    ],
  },
  {
    title: "Ready",
    tone: "bg-herb",
    tickets: [{ kot: 212, where: "Table 2", mins: 9, items: [{ qty: 4, name: "Gulab Jamun" }] }],
  },
];

const timerTone = (m: number) =>
  m >= 10 ? "bg-[#FDE2E1] text-[#B42318]" : m >= 5 ? "bg-[#FEF3C7] text-[#92400E]" : "bg-herb-soft text-herb";

export function KdsMockup({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <AppWindow
      className={className}
      title="Kitchen display · Main kitchen"
      label="Kitchen display with new, cooking and ready columns of KOT tickets, each with a timer."
      right={<span className="text-fg-muted">5 open</span>}
    >
      <div className={cn("grid gap-2 p-2.5", compact ? "grid-cols-2" : "grid-cols-2 @[30rem]:grid-cols-3")}>
        {columns.slice(0, compact ? 2 : 3).map((col, i) => (
          <div key={col.title} className={cn("space-y-2", i === 2 && "hidden @[30rem]:block")}>
            <div className="flex items-center gap-1.5 px-0.5 font-semibold">
              <i className={cn("size-2 rounded-full", col.tone)} aria-hidden />
              {col.title}
              <span className="text-fg-muted">{col.tickets.length}</span>
            </div>
            {col.tickets.map((t) => (
              <div key={t.kot} className="rounded-xl border border-line bg-surface-2 p-2">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-bold">KOT {t.kot}</span>
                  <span className={cn("flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold", timerTone(t.mins))}>
                    <Clock className="size-2.5" aria-hidden />
                    {t.mins}m
                  </span>
                </div>
                <p className="mb-1 text-fg-muted">{t.where}</p>
                <ul className="space-y-0.5">
                  {t.items.map((it) => (
                    <li key={it.name}>
                      <span className="font-semibold">{it.qty}×</span> {it.name}
                      {it.note && <span className="block ps-3.5 text-[10px] text-brand italic">{it.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AppWindow>
  );
}
