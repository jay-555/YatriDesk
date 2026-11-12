import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/** Brand mark: a bowl-and-steam "Y" inside a rounded tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden>
      <defs>
        <linearGradient id="yd-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EA580C" />
          <stop offset="1" stopColor="#C2410C" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#yd-mark)" />
      <path
        d="M11 12.5 L20 22 L29 12.5"
        fill="none"
        stroke="#FBF6EE"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20 22 V29" stroke="#FBF6EE" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M12.5 29 H27.5" stroke="#F2B33D" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, tone = "auto" }: { className?: string; tone?: "auto" | "light" }) {
  // "YatriDesk" -> "Yatri" + accented "Desk"; any other name renders as-is.
  const [, lead = site.name, tail = ""] = /^(.+?)([A-Z][a-z]+)$/.exec(site.name) ?? [];
  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 items-center gap-2.5 rounded-lg", className)}
      aria-label={`${site.name} home`}
    >
      <LogoMark />
      <span
        className={cn(
          "font-display text-xl font-bold tracking-tight",
          tone === "light" ? "text-cream" : "text-fg",
        )}
      >
        {lead}
        <span className={tone === "light" ? "text-saffron" : "text-brand"}>{tail}</span>
      </span>
    </Link>
  );
}
