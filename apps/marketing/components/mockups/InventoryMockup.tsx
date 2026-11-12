import { cn } from "@/lib/cn";
import { AppWindow } from "./parts";

const stock = [
  { item: "Paneer", have: 1.8, par: 5, unit: "kg" },
  { item: "Full-cream milk", have: 6, par: 20, unit: "L" },
  { item: "Basmati rice", have: 22, par: 25, unit: "kg" },
  { item: "Tomatoes", have: 9, par: 10, unit: "kg" },
  { item: "Butter", have: 3.5, par: 4, unit: "kg" },
];

export function InventoryMockup({ className }: { className?: string }) {
  return (
    <AppWindow
      className={className}
      title="Inventory · Kitchen store"
      label="Inventory screen: paneer and milk flagged as low stock, a recipe cost card for paneer butter masala at ₹92 with a 67% margin, and wastage of ₹1,240 this week."
      right={<span className="rounded-full bg-[#FDE2E1] px-2 py-0.5 font-semibold text-[#B42318]">2 low</span>}
    >
      <div className="grid gap-3 p-3 @[34rem]:grid-cols-[1fr_40%]">
        <table className="w-full border-separate border-spacing-y-1.5">
          <thead className="text-start text-fg-muted">
            <tr>
              <th className="text-start font-medium">Item</th>
              <th className="text-end font-medium">In stock</th>
              <th className="w-[38%] ps-3 text-start font-medium">Level</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((s) => {
              const pct = Math.min(100, Math.round((s.have / s.par) * 100));
              const low = pct < 40;
              return (
                <tr key={s.item}>
                  <td className="font-medium">{s.item}</td>
                  <td className={cn("text-end tabular-nums", low && "font-semibold text-[#B42318]")}>
                    {s.have} {s.unit}
                  </td>
                  <td className="ps-3">
                    <div className="h-1.5 rounded-full bg-bg-alt">
                      <div
                        className={cn("h-full rounded-full", low ? "bg-[#E5484D]" : "bg-herb")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="space-y-2">
          <div className="rounded-xl border border-line bg-surface-2 p-2.5">
            <p className="text-fg-muted">Recipe cost</p>
            <p className="font-semibold">Paneer Butter Masala</p>
            <div className="mt-1.5 flex justify-between tabular-nums">
              <span>Cost ₹92</span>
              <span>Price ₹280</span>
            </div>
            <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-herb-soft">
              <div className="h-full w-[33%] bg-saffron" />
            </div>
            <p className="mt-1 font-semibold text-herb">67% margin</p>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 p-2.5">
            <p className="text-fg-muted">Wastage this week</p>
            <p className="font-display text-[15px] font-bold">₹1,240</p>
            <p className="text-fg-muted">Top: spoiled milk, burnt naan</p>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
