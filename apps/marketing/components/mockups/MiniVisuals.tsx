import { cn } from "@/lib/cn";
import { DietMark } from "./parts";

/** Small decorative UI snippets for the feature cards (aria-hidden: the card text carries the meaning). */

const frame = "rounded-2xl border border-line bg-surface-2 p-3 text-[11px] leading-snug text-fg select-none";

export function BillingVisual() {
  return (
    <div aria-hidden className="space-y-2">
      <div className={cn(frame, "grid grid-cols-3 gap-2 text-center")}>
        {[
          ["142", "bills today"],
          ["24 sec", "avg. bill time"],
          ["0", "missed KOTs"],
        ].map(([v, k]) => (
          <div key={k}>
            <p className="font-display text-[17px] font-bold">{v}</p>
            <p className="text-fg-muted">{k}</p>
          </div>
        ))}
      </div>
      <BillingDocs />
      <div className={cn(frame, "flex flex-wrap items-center gap-1.5")}>
        <span className="me-1 text-fg-muted">Paid by</span>
        {[
          ["UPI", "58%"],
          ["Cash", "27%"],
          ["Card", "13%"],
          ["Split", "2%"],
        ].map(([m, p]) => (
          <span key={m} className="rounded-full border border-line bg-surface px-2 py-0.5 font-semibold">
            {m} <span className="font-normal text-fg-muted">{p}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function BillingDocs() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className={frame}>
        <p className="mb-1.5 flex justify-between font-bold">
          KOT 219 <span className="font-medium text-fg-muted">Table 3</span>
        </p>
        {[
          ["2×", "Idli Sambar", true],
          ["1×", "Medu Vada", true],
          ["2×", "Filter Coffee", true],
        ].map(([q, n, v]) => (
          <p key={n as string} className="flex items-center gap-1.5 py-0.5">
            <DietMark veg={v as boolean} />
            <b>{q as string}</b> {n as string}
          </p>
        ))}
        <p className="mt-1.5 rounded-md bg-herb-soft px-2 py-1 font-semibold text-herb">Sent to kitchen ✓</p>
      </div>
      <div className={frame}>
        <p className="font-bold">Tax invoice</p>
        <p className="text-fg-muted">GSTIN 29ABCDE1234F1Z5</p>
        <div className="mt-1.5 space-y-0.5 tabular-nums">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>₹420.00</span>
          </p>
          <p className="flex justify-between text-herb">
            <span>Discount 10%</span>
            <span>−₹42.00</span>
          </p>
          <p className="flex justify-between text-fg-muted">
            <span>CGST + SGST 5%</span>
            <span>₹18.90</span>
          </p>
          <p className="flex justify-between border-t border-dashed border-line pt-1 font-bold">
            <span>Split 2 ways</span>
            <span>₹198.45 each</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function TablesVisual() {
  const tables = ["free", "busy", "bill", "free", "busy", "busy", "free", "bill"] as const;
  const tone = {
    free: "border-line bg-surface text-fg-muted",
    busy: "border-brand/40 bg-saffron-soft text-brand",
    bill: "border-herb/40 bg-herb-soft text-herb",
  };
  return (
    <div aria-hidden className={frame}>
      <div className="grid grid-cols-4 gap-1.5">
        {tables.map((t, i) => (
          <div key={i} className={cn("flex aspect-square flex-col items-center justify-center rounded-lg border font-bold", tone[t])}>
            T{i + 1}
            <span className="text-[9px] font-medium">{t === "free" ? "Free" : t === "busy" ? "24m" : "Bill"}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 text-[10px] font-semibold">
        <span className="rounded-full bg-bg-alt px-2 py-0.5">Dine-in 6</span>
        <span className="rounded-full bg-bg-alt px-2 py-0.5">Takeaway 3</span>
        <span className="rounded-full bg-bg-alt px-2 py-0.5">Delivery 2</span>
      </div>
    </div>
  );
}

export function KdsVisual() {
  return (
    <div aria-hidden className={cn(frame, "space-y-1.5")}>
      {[
        ["KOT 221", "Table 5", "1m", "bg-herb-soft text-herb"],
        ["KOT 220", "Takeaway", "6m", "bg-[#FEF3C7] text-[#92400E]"],
      ].map(([k, w, t, c]) => (
        <div key={k} className="flex items-center justify-between rounded-lg border border-line bg-surface px-2 py-1.5">
          <span>
            <b>{k}</b> <span className="text-fg-muted">· {w}</span>
          </span>
          <span className={cn("rounded-full px-1.5 font-semibold", c)}>{t}</span>
        </div>
      ))}
    </div>
  );
}

export function InventoryVisual() {
  const rows = [
    ["Paneer", 36, true],
    ["Basmati rice", 88, false],
    ["Milk", 30, true],
    ["Onions", 72, false],
  ] as const;
  return (
    <div aria-hidden className={cn(frame, "grid gap-3 sm:grid-cols-[1.3fr_1fr]")}>
      <div className="space-y-1.5">
        {rows.map(([n, p, low]) => (
          <div key={n}>
            <p className="flex justify-between">
              <span>{n}</span>
              {low && <span className="font-semibold text-[#B42318]">Low</span>}
            </p>
            <div className="mt-0.5 h-1.5 rounded-full bg-bg-alt">
              <div className={cn("h-full rounded-full", low ? "bg-[#E5484D]" : "bg-herb")} style={{ width: `${p}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-surface p-2">
        <p className="text-fg-muted">Recipe cost · Veg Biryani</p>
        <p className="font-display text-[15px] font-bold">₹64 → ₹220</p>
        <p className="font-semibold text-herb">71% margin</p>
        <p className="mt-1 text-fg-muted">Wastage today ₹180</p>
      </div>
    </div>
  );
}

export function MenuVisual() {
  return (
    <div aria-hidden className={frame}>
      <p className="flex items-center gap-1.5 font-bold">
        <DietMark veg /> Cold Coffee
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {["Regular ₹150", "Large ₹190"].map((v, i) => (
          <span key={v} className={cn("rounded-full border px-2 py-0.5", i === 0 ? "border-brand bg-saffron-soft text-brand" : "border-line")}>
            {v}
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {["+ Ice cream ₹40", "+ Hazelnut ₹30"].map((a) => (
          <span key={a} className="rounded-full bg-bg-alt px-2 py-0.5 text-fg-muted">
            {a}
          </span>
        ))}
      </div>
      <p className="mt-2 rounded-md bg-herb-soft px-2 py-1 font-semibold text-herb">Happy hour 4–7pm · 20% off</p>
    </div>
  );
}

export function ReportsVisual() {
  const d = "M0,46 L20,40 L40,42 L60,30 L80,34 L100,20 L120,24 L140,10 L160,14";
  return (
    <div aria-hidden className={cn(frame, "flex items-end justify-between gap-4")}>
      <div>
        <p className="text-fg-muted">Sales today</p>
        <p className="font-display text-[18px] font-bold">₹62,480</p>
        <p className="font-semibold text-herb">▲ 14% vs last week</p>
        <p className="mt-1 text-fg-muted">Peak: 8–9pm · Top: Masala Dosa</p>
      </div>
      <svg viewBox="0 0 160 50" className="h-14 w-36 shrink-0">
        <path d={`${d} L160,50 L0,50 Z`} fill="var(--saffron)" opacity="0.15" />
        <path d={d} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function StaffVisual() {
  const roles = [
    ["Owner", "All outlets", "bg-ink text-cream dark:bg-cream dark:text-ink"],
    ["Manager", "Koramangala", "bg-saffron-soft text-brand"],
    ["Cashier", "Billing only", "bg-herb-soft text-herb"],
    ["Captain", "Orders & tables", "bg-bg-alt text-fg"],
  ];
  return (
    <div aria-hidden className={cn(frame, "space-y-1.5")}>
      {roles.map(([r, s, c]) => (
        <p key={r} className="flex items-center justify-between">
          <span className={cn("rounded-full px-2 py-0.5 font-semibold", c)}>{r}</span>
          <span className="text-fg-muted">{s}</span>
        </p>
      ))}
    </div>
  );
}

export function LoyaltyVisual() {
  return (
    <div aria-hidden className={cn(frame, "flex items-center gap-3")}>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-saffron-soft font-bold text-brand">PK</span>
      <div className="min-w-0 flex-1">
        <p className="font-bold">Regular guest · 14 visits</p>
        <p className="text-fg-muted">Favourite: Masala Dosa, Filter Coffee</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-bg-alt">
          <div className="h-full w-[72%] rounded-full bg-saffron" />
        </div>
        <p className="mt-0.5 text-fg-muted">360 / 500 points to a free meal</p>
      </div>
    </div>
  );
}
