"use client";

import { Languages } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const next = lang === "en" ? "hi" : "en";
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      className={cn(
        "inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-bg-alt hover:text-fg",
        className,
      )}
      aria-label={lang === "en" ? "हिंदी में देखें (Switch to Hindi)" : "Switch to English"}
    >
      <Languages className="size-4" aria-hidden />
      <span lang={next === "hi" ? "hi" : "en"}>{next === "hi" ? "हिं" : "EN"}</span>
    </button>
  );
}
