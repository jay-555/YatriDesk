"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { loadAnalytics, readConsent, saveConsent, type Consent } from "@/lib/analytics";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    if (consent === "all") loadAnalytics();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- consent lives in localStorage, only readable after mount
    if (!consent) setShow(true);
  }, []);

  if (!show) return null;

  const choose = (value: Consent) => {
    saveConsent(value);
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-24 z-50 animate-rise rounded-card border border-line bg-surface p-4 shadow-lift sm:inset-x-auto sm:left-6 sm:max-w-sm md:bottom-6"
    >
      <div className="flex gap-3">
        <Cookie className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        <p className="text-sm text-fg-muted">
          We use essential cookies to run this site and, with your permission, analytics to improve it.{" "}
          <Link href="/privacy" className="font-medium text-brand underline underline-offset-2">
            Privacy policy
          </Link>
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => choose("all")} className="flex-1">
          Accept
        </Button>
        <Button variant="secondary" onClick={() => choose("essential")} className="flex-1">
          Only essential
        </Button>
      </div>
    </div>
  );
}
