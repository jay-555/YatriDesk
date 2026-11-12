"use client";

const CONSENT_KEY = "yd-consent";
export type Consent = "all" | "essential";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage blocked: banner simply shows again next visit */
  }
  if (value === "all") loadAnalytics();
}

let loaded = false;
/** PLACEHOLDER: load your analytics script here (only after consent). */
export function loadAnalytics() {
  if (loaded || readConsent() !== "all") return;
  loaded = true;
}

/** Records a conversion event once analytics is wired up. */
export function track(event: string, props?: Record<string, string>) {
  if (!loaded) return;
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props);
}
