import { Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { site } from "@/config/site";
import { FinalCta } from "@/sections/FinalCta";
import { PricingSection } from "@/sections/PricingSection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple monthly or yearly plans for restaurants, cafes, cloud kitchens and chains. GST billing, KOT, offline mode and free updates on every plan.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing", title: `Pricing · ${site.name}` },
};

const pricingFaq = [
  {
    q: "Is GST included in the price?",
    a: "No. Plan prices exclude 18% GST, which is added to your invoice. You'll get a GST invoice you can claim input credit on.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes, upgrade or downgrade any time. Upgrades apply immediately; downgrades take effect from your next billing cycle.",
  },
  {
    q: "How does multi-outlet pricing work?",
    a: "You pay per outlet. Every outlet gets its own billing devices and kitchen screens, and you see all of them from one owner account.",
  },
  site.faq[1],
  site.faq[7],
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <>
        <Check className="mx-auto size-5 text-herb" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus className="mx-auto size-5 text-fg-muted/60" aria-hidden />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="text-sm font-medium text-fg">{value}</span>;
}

export default function PricingPage() {
  const { tiers, compare } = site.pricing;
  return (
    <>
      <PricingSection headingLevel="h1">
        <div className="mt-20">
          <h2 className="text-center text-h2 font-bold text-fg">Compare every feature</h2>
          <div className="mt-8 overflow-x-auto rounded-panel border border-line bg-surface shadow-soft">
            <table className="w-full min-w-[640px] border-collapse text-start">
              <caption className="sr-only">Features included in each plan</caption>
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  <th scope="col" className="px-5 py-4 text-start text-sm font-semibold text-fg-muted">
                    Feature
                  </th>
                  {tiers.map((t) => (
                    <th key={t.id} scope="col" className="px-5 py-4 text-center font-display text-base font-bold text-fg">
                      {t.name}
                      {t.popular && <span className="ms-2 rounded-full bg-saffron-soft px-2 py-0.5 text-xs text-brand">Popular</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.map(([feature, ...values]) => (
                  <tr key={feature} className="border-b border-line last:border-0">
                    <th scope="row" className="px-5 py-3.5 text-start font-medium text-fg">
                      {feature}
                    </th>
                    {values.map((v, i) => (
                      <td key={tiers[i].id} className="px-5 py-3.5 text-center">
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-h2 font-bold text-fg">Pricing questions</h2>
          <div className="mt-8">
            <Accordion items={pricingFaq} defaultOpen={null} />
          </div>
        </div>
      </PricingSection>
      <FinalCta />
    </>
  );
}
