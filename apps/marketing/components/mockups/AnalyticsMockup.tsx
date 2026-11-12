import { AppWindow } from "./parts";

// Sales per hour, 11am–11pm: lunch and dinner peaks.
const hourly = [6, 18, 34, 30, 14, 8, 7, 12, 26, 44, 52, 38, 16];
const W = 320;
const H = 110;
const step = W / (hourly.length - 1);
const max = Math.max(...hourly);
const pts = hourly.map((v, i) => [i * step, H - (v / max) * (H - 10) - 4] as const);
const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
const area = `${line} L${W},${H} L0,${H} Z`;

const top = [
  { name: "Masala Dosa", qty: 412 },
  { name: "Filter Coffee", qty: 388 },
  { name: "Veg Biryani", qty: 241 },
  { name: "Paneer Butter Masala", qty: 198 },
];

export function AnalyticsMockup({ className }: { className?: string }) {
  return (
    <AppWindow
      className={className}
      title="Reports · This week"
      label="Reports dashboard: ₹3.42 lakh sales this week, 1,286 orders, ₹266 average bill, an hourly sales chart peaking at lunch and dinner, and the top-selling dishes."
      right={<span className="text-fg-muted">Mon – Sun</span>}
    >
      <div className="space-y-3 p-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Sales", "₹3.42L", "+9%"],
            ["Orders", "1,286", "+6%"],
            ["Avg bill", "₹266", "+3%"],
          ].map(([k, v, d]) => (
            <div key={k} className="rounded-xl border border-line bg-surface-2 p-2">
              <p className="text-fg-muted">{k}</p>
              <p className="font-display text-[15px] font-bold tabular-nums">{v}</p>
              <p className="font-semibold text-herb">{d}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 @[34rem]:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-line bg-surface-2 p-2">
            <p className="mb-1 font-semibold">Sales by hour</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
              <defs>
                <linearGradient id="yd-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--saffron)" stopOpacity="0.35" />
                  <stop offset="1" stopColor="var(--saffron)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#yd-area)" />
              <path d={line} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" />
              <circle cx={pts[10][0]} cy={pts[10][1]} r="3.5" fill="var(--brand)" />
            </svg>
            <div className="flex justify-between text-[9px] text-fg-muted">
              <span>11am</span>
              <span>5pm</span>
              <span>11pm</span>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 p-2">
            <p className="mb-1.5 font-semibold">Top dishes</p>
            <ul className="space-y-1.5">
              {top.map((t) => (
                <li key={t.name}>
                  <div className="flex justify-between">
                    <span className="truncate">{t.name}</span>
                    <span className="tabular-nums text-fg-muted">{t.qty}</span>
                  </div>
                  <div className="mt-0.5 h-1 rounded-full bg-bg-alt">
                    <div className="h-full rounded-full bg-herb" style={{ width: `${(t.qty / top[0].qty) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
