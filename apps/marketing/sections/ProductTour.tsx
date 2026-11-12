import { Check } from "lucide-react";
import Link from "next/link";
import { AnalyticsMockup } from "@/components/mockups/AnalyticsMockup";
import { InventoryMockup } from "@/components/mockups/InventoryMockup";
import { KdsMockup } from "@/components/mockups/KdsMockup";
import { PosMockup } from "@/components/mockups/PosMockup";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs, type TabItem } from "@/components/ui/Tabs";

const tabs: (TabItem & { heading: string; points: string[]; mockup: React.ReactNode })[] = [
  {
    id: "billing",
    label: "Billing",
    icon: "receipt",
    heading: "A counter that keeps up with the rush",
    points: [
      "Search by name or short code, add notes and modifiers in a tap",
      "CGST/SGST worked out on every bill, with round-off",
      "UPI QR on the bill; split by item, seat or amount",
    ],
    mockup: <PosMockup />,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    icon: "chef-hat",
    heading: "The kitchen always knows what's next",
    points: [
      "KOTs go to the right station: tandoor, chinese, bar",
      "Colour timers flag tickets that are running late",
      "Notes like \"less spicy\" stay on the ticket, never lost",
    ],
    mockup: <KdsMockup />,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "package",
    heading: "Stock that counts itself",
    points: [
      "Every sale deducts ingredients using your recipes",
      "Low-stock alerts before the evening rush, not during it",
      "Recipe cost and margin for every dish, plus wastage logs",
    ],
    mockup: <InventoryMockup />,
  },
  {
    id: "reports",
    label: "Reports",
    icon: "bar-chart",
    heading: "Your numbers, every morning",
    points: [
      "Sales by day, hour, dish, staff and payment mode",
      "Peak hours so you can plan staff and prep",
      "Export GST-ready summaries for your CA",
    ],
    mockup: <AnalyticsMockup />,
  },
];

export function ProductTour() {
  return (
    <Section id="tour" labelledBy="tour-title">
      <Container>
        <SectionHeading
          id="tour-title"
          eyebrow="tour.eyebrow"
          title="tour.title"
          lead="Tap through the screens your team will use every day."
        />
        <Tabs
          className="mt-10"
          label="Product areas"
          listClassName="mx-auto w-fit max-w-full"
          scrollable
          tabs={tabs.map(({ id, label, icon }) => ({ id, label, icon }))}
          panels={tabs.map((t) => (
            <div key={t.id} className="grid items-center gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-bold text-fg">{t.heading}</h3>
                <ul className="mt-5 space-y-3">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-3 text-fg-muted">
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-herb-soft text-herb">
                        <Check className="size-3.5" strokeWidth={3} aria-hidden />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact#demo"
                  className="mt-6 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
                >
                  See {t.label.toLowerCase()} live in a demo →
                </Link>
              </div>
              <div className="order-1 lg:order-2">{t.mockup}</div>
            </div>
          ))}
        />
      </Container>
    </Section>
  );
}
