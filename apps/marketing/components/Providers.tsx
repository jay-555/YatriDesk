"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Own storage key: the product app on the same domain uses next-themes'
    // default "theme" key, and toggling here must not change the app's theme.
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="yd-site-theme"
    >
      <LanguageProvider>
        <MotionProvider>{children}</MotionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
