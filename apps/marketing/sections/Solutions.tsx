import { ArrowRight, Check } from "lucide-react";
import { T } from "@/components/i18n/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs } from "@/components/ui/Tabs";
import { site, type BusinessTypeId } from "@/config/site";

const solutions: Record<BusinessTypeId, { scenario: string; features: string[] }> = {
  restaurant: {
    scenario: "A 60-cover dining room on a Saturday night: captains take orders at the table, the tandoor and main kitchen get their own KOTs, and the cashier closes split bills without a queue.",
    features: ["Table map with live status", "Captain ordering from a phone", "Station-wise KOT routing", "Split and merge bills", "Day-end GST summary"],
  },
  cafe: {
    scenario: "A busy counter where the same guests come back daily: quick-tap favourites, customisations like oat milk or extra shot, and loyalty points that bring them back.",
    features: ["Quick-service counter mode", "Variants and add-ons", "Customer loyalty points", "UPI on the bill", "Morning sales on your phone"],
  },
  "cloud-kitchen": {
    scenario: "Several brands from one kitchen: every order lands on one screen, prep starts the moment it's accepted, and stock is shared across brands.",
    features: ["Multiple brands, one kitchen", "Kitchen display with timers", "Shared inventory", "Packaging cost in recipes", "Brand-wise reports"],
  },
  bakery: {
    scenario: "Cakes by weight, made-to-order customisations and items with a short shelf life: sell by kg or piece and log what didn't sell.",
    features: ["Sell by weight or piece", "Advance orders with notes", "Batch production tracking", "Wastage and expiry logs", "Barcode-ready billing"],
  },
  qsr: {
    scenario: "Speed is everything: combos in one tap, token numbers on the bill, and a kitchen screen that keeps the line moving.",
    features: ["One-tap combos", "Token and queue numbers", "Kitchen display", "Peak-hour reports", "Multiple counters"],
  },
  bar: {
    scenario: "Happy hours, open tabs and pegs: timed pricing kicks in automatically and bar stock is tracked down to the bottle.",
    features: ["Timed menus and happy hours", "Open tabs per table", "Bar inventory by peg/bottle", "Manager approval for voids", "Staff-wise sales"],
  },
  hotel: {
    scenario: "A restaurant plus room service: bill to the room or settle at checkout, with room orders going straight to the kitchen.",
    features: ["Room service orders", "Bill-to-room settlement", "Multiple outlets in one property", "Banquet and advance orders", "Consolidated reports"],
  },
};

export function Solutions() {
  return (
    <Section id="solutions" labelledBy="solutions-title" className="bg-bg-alt">
      <Container>
        <SectionHeading
          id="solutions-title"
          eyebrow="solutions.eyebrow"
          title="solutions.title"
          lead="Same simple system, set up for the way your outlet actually works."
        />
        <Tabs
          className="mt-10"
          label="Business type"
          listClassName="mx-auto w-fit max-w-full"
          scrollable
          tabs={site.businessTypes.map((b) => ({ id: b.id, label: b.label, icon: b.icon }))}
          panels={site.businessTypes.map((b) => {
            const s = solutions[b.id];
            return (
              <div
                key={b.id}
                className="grid gap-6 rounded-panel border border-line bg-surface p-6 shadow-soft sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10"
              >
                <div>
                  <IconTile name={b.icon} />
                  <h3 className="mt-4 text-2xl font-bold text-fg">YatriDesk for {b.label.toLowerCase()}</h3>
                  <p className="mt-3 text-fg-muted">{s.scenario}</p>
                  <ButtonLink href="/contact#demo" className="mt-6">
                    <T k="cta.demoShort" />
                    <ArrowRight className="size-4" aria-hidden />
                  </ButtonLink>
                </div>
                <div className="rounded-card bg-bg-alt p-5">
                  <p className="text-sm font-semibold tracking-wide text-fg-muted uppercase">What matters most</p>
                  <ul className="mt-4 space-y-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 font-medium text-fg">
                        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-herb text-white dark:text-ink">
                          <Check className="size-3.5" strokeWidth={3} aria-hidden />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        />
      </Container>
    </Section>
  );
}
