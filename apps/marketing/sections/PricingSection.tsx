"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { T } from "@/components/i18n/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { formatInr, planPrice, type BillingCycle } from "@/lib/pricing";

export function PricingSection({
  headingLevel = "h2",
  children,
}: {
  /** The /pricing page renders this as its h1. */
  headingLevel?: "h1" | "h2";
  children?: React.ReactNode;
}) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const { tiers, yearlyMonthsCharged, placeholder } = site.pricing;
  const freeMonths = 12 - yearlyMonthsCharged;

  return (
    <Section id="pricing" labelledBy="pricing-title">
      <Container>
        {headingLevel === "h1" ? (
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">
              <T k="pricing.eyebrow" />
            </p>
            <h1 id="pricing-title" className="text-display font-extrabold text-fg">
              <T k="pricing.title" />
            </h1>
            <p className="mt-4 text-lead text-fg-muted">
              Every plan includes GST billing, KOT printing, offline mode and free updates. Start with a free trial.
            </p>
          </div>
        ) : (
          <SectionHeading
            id="pricing-title"
            eyebrow="pricing.eyebrow"
            title="pricing.title"
            lead="Every plan includes GST billing, KOT printing, offline mode and free updates. Start with a free trial."
          />
        )}

        <div className="mt-10 flex flex-col items-center gap-3">
          <div role="group" aria-label="Billing cycle" className="inline-flex rounded-full border border-line bg-surface p-1.5 shadow-soft">
            {(["monthly", "yearly"] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cycle === c}
                onClick={() => setCycle(c)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors",
                  cycle === c ? "bg-ink text-cream dark:bg-cream dark:text-ink" : "text-fg-muted hover:text-fg",
                )}
              >
                {c === "monthly" ? "Monthly" : "Yearly"}
                {c === "yearly" && (
                  <span className={cn("rounded-full px-2 py-0.5 text-xs", cycle === c ? "bg-saffron text-ink" : "bg-herb-soft text-herb")}>
                    {freeMonths} months free
                  </span>
                )}
              </button>
            ))}
          </div>
          {placeholder && <Badge tone="placeholder">Sample prices. Final pricing will be confirmed at launch.</Badge>}
        </div>

        <ul className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
          {tiers.map((tier) => {
            const price = planPrice(tier.monthly, cycle, yearlyMonthsCharged);
            return (
              <li
                key={tier.id}
                className={cn(
                  "relative flex flex-col rounded-panel border bg-surface p-6 shadow-soft sm:p-8",
                  tier.popular ? "border-2 border-brand shadow-lift lg:-my-3 lg:py-11" : "border-line",
                )}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-brand-fg">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-fg">{tier.name}</h3>
                <p className="mt-1 min-h-12 text-fg-muted">{tier.blurb}</p>
                <p className="mt-6 flex items-baseline gap-1.5" aria-live="polite">
                  <span className="font-display text-4xl font-extrabold text-fg tabular-nums">{formatInr(price.perMonth)}</span>
                  <span className="text-sm text-fg-muted">/ month</span>
                </p>
                <p className="mt-1 min-h-10 text-sm text-fg-muted">
                  {tier.unit.replace(" / month", "")}
                  {cycle === "yearly" ? (
                    <>
                      {" "}
                      · billed {formatInr(price.billed)} yearly{" "}
                      <span className="font-semibold text-herb">(save {formatInr(price.saving)})</span>
                    </>
                  ) : (
                    " · billed monthly"
                  )}
                </p>
                <ButtonLink
                  href="/contact#demo"
                  variant={tier.popular ? "primary" : "secondary"}
                  size="lg"
                  className="mt-6 w-full"
                >
                  {tier.cta}
                </ButtonLink>
                <ul className="mt-8 space-y-3 border-t border-line pt-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-3 text-fg">
                      <Check className="mt-0.5 size-5 shrink-0 text-herb" strokeWidth={2.5} aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-center text-sm text-fg-muted">
          Prices exclude 18% GST. Free trial on every plan, no card needed.
        </p>
        {children}
      </Container>
    </Section>
  );
}
