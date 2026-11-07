"use client";

import { useState } from "react";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";

interface BillingStatus {
  restaurantStatus: string;
  plan: string;
  billing: { status: string; razorpaySubscriptionId: string | null } | null;
  invoices: { number: string; total: string; issuedAt: string }[];
}

export default function BillingPage() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  const load = () =>
    api
      .get<BillingStatus>("/billing/status")
      .then(setStatus)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load billing"));

  const subscribe = async () => {
    setError(null);
    try {
      const result = await api.post<{ shortUrl: string | null }>("/billing/subscribe");
      setLink(result.shortUrl);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start the subscription");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Restaurant, branch, and staff configuration</p>
      </div>
      <SettingsTabs />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <h2 className="text-2xl font-semibold">Subscription</h2>
      <p className="text-sm text-muted-foreground">
        Razorpay bills the restaurant for the software. Guest payments stay at the counter. The software invoice is a separate 18% GST series.
      </p>
      <Button type="button" variant="outline" onClick={() => void load()}>Refresh status</Button>
      {status && (
        <p className="text-sm">
          Restaurant {status.restaurantStatus} · plan {status.plan} · billing {status.billing?.status ?? "none"}
        </p>
      )}
      <Button type="button" onClick={() => void subscribe()}>Start Starter subscription</Button>
      {link && (
        <a className="text-sm underline" href={link}>Open Razorpay checkout</a>
      )}
      {status?.invoices.map((invoice) => (
        <p key={invoice.number} className="text-sm">{invoice.number} · {invoice.total}</p>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
