"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-alt hover:text-fg",
        className,
      )}
      aria-label="Toggle dark mode"
    >
      {/* Both icons render; CSS picks one, so there's no hydration mismatch. */}
      <Sun className="size-5 dark:hidden" aria-hidden />
      <Moon className="hidden size-5 dark:block" aria-hidden />
    </button>
  );
}
