import { Printer, QrCode, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { AppWindow, DietMark, Pill, rupee } from "./parts";

const menu = [
  { name: "Paneer Butter Masala", price: 280, veg: true },
  { name: "Dal Makhani", price: 240, veg: true },
  { name: "Butter Naan", price: 55, veg: true },
  { name: "Chicken 65", price: 260, veg: false },
  { name: "Veg Biryani", price: 220, veg: true },
  { name: "Masala Chai", price: 40, veg: true },
];

const order = [
  { name: "Paneer Butter Masala", qty: 1, price: 280, veg: true },
  { name: "Butter Naan", qty: 3, price: 55, veg: true },
  { name: "Dal Makhani", qty: 1, price: 240, veg: true },
  { name: "Masala Chai", qty: 2, price: 40, veg: true },
];

// 5% GST on restaurant service = CGST 2.5% + SGST 2.5%, rounded to the rupee.
const subtotal = order.reduce((s, l) => s + l.qty * l.price, 0);
const cgst = Math.round(subtotal * 2.5) / 100;
const exact = subtotal + cgst * 2;
const total = Math.round(exact);

export function PosMockup({ className }: { className?: string }) {
  return (
    <AppWindow
      className={className}
      title="Billing · Table 7 · Dine-in"
      label={`POS billing screen for table 7: four dishes, CGST and SGST at 2.5% each, total ${rupee(total)}.`}
      right={<span className="rounded-full bg-herb-soft px-2 py-0.5 font-semibold text-herb">● Online</span>}
    >
      <div className="grid @[34rem]:grid-cols-[1fr_46%]">
        <div className="hidden p-3 @[34rem]:block">
          <div className="mb-2.5 flex items-center gap-2 rounded-lg border border-line px-2 py-1.5 text-fg-muted">
            <Search className="size-3" aria-hidden /> Search dish or code…
          </div>
          <div className="no-scrollbar mb-2.5 flex gap-1.5 overflow-hidden">
            <Pill active>Main course</Pill>
            <Pill>Breads</Pill>
            <Pill>Starters</Pill>
            <Pill>Beverages</Pill>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {menu.map((m, i) => (
              <div
                key={m.name}
                className={cn(
                  "flex min-h-14 flex-col justify-between rounded-lg border p-1.5",
                  i === 0 ? "border-brand/50 bg-saffron-soft/60" : "border-line bg-surface-2",
                )}
              >
                <span className="flex items-start gap-1 font-medium">
                  <DietMark veg={m.veg} />
                  <span className="line-clamp-2">{m.name}</span>
                </span>
                <span className="font-semibold text-fg-muted">{rupee(m.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col border-line p-3 @[34rem]:border-s">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-[13px] font-bold">Order #1042</span>
            <span className="text-fg-muted">4 guests · Ravi</span>
          </div>
          <ul className="space-y-1.5">
            {order.map((l) => (
              <li key={l.name} className="flex items-center gap-1.5">
                <DietMark veg={l.veg} />
                <span className="min-w-0 flex-1 truncate">{l.name}</span>
                <span className="rounded bg-bg-alt px-1.5 font-semibold tabular-nums">×{l.qty}</span>
                <span className="w-12 text-end font-medium tabular-nums">{rupee(l.qty * l.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-0.5 border-t border-dashed border-line pt-2 text-fg-muted tabular-nums">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{rupee(subtotal, true)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>CGST 2.5%</dt>
              <dd>{rupee(cgst, true)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>SGST 2.5%</dt>
              <dd>{rupee(cgst, true)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Round off</dt>
              <dd>{(total - exact).toFixed(2)}</dd>
            </div>
          </dl>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-[18px] font-bold text-brand tabular-nums">{rupee(total)}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <span className="flex items-center justify-center gap-1 rounded-lg border border-line py-2 font-semibold">
              <Printer className="size-3" aria-hidden /> KOT
            </span>
            <span className="flex items-center justify-center gap-1 rounded-lg bg-brand py-2 font-semibold text-brand-fg">
              <QrCode className="size-3" aria-hidden /> Bill · UPI
            </span>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
