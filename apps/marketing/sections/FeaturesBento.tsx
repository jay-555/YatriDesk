import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/i18n/LanguageProvider";
import {
  BillingVisual,
  InventoryVisual,
  KdsVisual,
  LoyaltyVisual,
  MenuVisual,
  ReportsVisual,
  StaffVisual,
  TablesVisual,
} from "@/components/mockups/MiniVisuals";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { IconName } from "@/config/site";
import { cn } from "@/lib/cn";

type Feature = {
  title: string;
  benefit: string;
  icon: IconName;
  points?: string[];
  visual: React.ReactNode;
  span: string;
  tone?: "saffron" | "herb";
};

const features: Feature[] = [
  {
    title: "Billing & POS",
    benefit: "Bill a full table in under 30 seconds, even at peak hour.",
    icon: "receipt",
    points: ["One-tap KOT", "Split & merge bills", "Discounts with approval", "GST-ready invoices"],
    visual: <BillingVisual />,
    span: "md:col-span-2",
  },
  {
    title: "Tables & orders",
    benefit: "Dine-in, takeaway and delivery on one live board.",
    icon: "layout-grid",
    visual: <TablesVisual />,
    span: "",
    tone: "herb",
  },
  {
    title: "Kitchen Display",
    benefit: "Orders reach the right station the moment they're placed.",
    icon: "chef-hat",
    visual: <KdsVisual />,
    span: "",
  },
  {
    title: "Inventory & costing",
    benefit: "Spot low stock before service, and know what every plate really costs.",
    icon: "package",
    points: ["Low-stock alerts", "Recipe costing", "Wastage tracking"],
    visual: <InventoryVisual />,
    span: "md:col-span-2",
    tone: "herb",
  },
  {
    title: "Menu management",
    benefit: "Variants, add-ons, combos and timed menus, changed in seconds.",
    icon: "book-open",
    visual: <MenuVisual />,
    span: "",
  },
  {
    title: "Staff & multi-outlet",
    benefit: "The right access for every person, across every outlet.",
    icon: "users",
    visual: <StaffVisual />,
    span: "",
  },
  {
    title: "Reports & analytics",
    benefit: "Sales, item-wise, staff and peak hours, right on your phone.",
    icon: "bar-chart",
    visual: <ReportsVisual />,
    span: "md:col-span-2",
    tone: "herb",
  },
  {
    title: "Customers & loyalty",
    benefit: "Remember your regulars and give them a reason to return.",
    icon: "heart",
    visual: <LoyaltyVisual />,
    span: "md:col-span-2",
  },
];

export function FeaturesBento() {
  return (
    <Section id="features" labelledBy="features-title">
      <Container>
        <SectionHeading
          id="features-title"
          eyebrow="features.eyebrow"
          title="features.title"
          lead="Everything a busy outlet needs, working together. No add-on modules to stitch up, no separate apps for the kitchen and the counter."
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={(i % 4) * 0.05} className={cn("flex", f.span)}>
              <article className="lift flex w-full flex-col gap-5 rounded-panel border border-line bg-surface p-5 shadow-soft sm:p-6">
                <div className="flex items-start gap-3">
                  <IconTile name={f.icon} tone={f.tone} />
                  <div>
                    <h3 className="text-lg font-bold text-fg">{f.title}</h3>
                    <p className="mt-1 text-[15px] text-fg-muted">{f.benefit}</p>
                  </div>
                </div>
                {f.points && (
                  <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm text-fg sm:grid-cols-2">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-center gap-2">
                        <Check className="size-4 shrink-0 text-herb" strokeWidth={3} aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto">{f.visual}</div>
              </article>
            </Reveal>
          ))}
          <Reveal as="li" className="flex md:col-span-2 lg:col-span-4">
            <div className="flex w-full flex-col justify-between gap-6 rounded-panel bg-ink p-6 text-cream sm:p-8 lg:flex-row lg:items-center dark:bg-surface-2">
              <div>
                <p className="font-display text-2xl font-bold">Need to see it with your own menu?</p>
                <p className="mt-2 text-cream/75">
                  We&apos;ll load a few of your dishes and bill a sample table live, in 20 minutes.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact#demo"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-saffron px-6 font-semibold text-ink transition-colors hover:bg-turmeric"
                >
                  <T k="cta.demo" />
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link href="/#tour" className="inline-flex min-h-11 items-center font-semibold text-cream underline-offset-4 hover:underline">
                  Take the product tour
                </Link>
              </div>
            </div>
          </Reveal>
        </ul>
      </Container>
    </Section>
  );
}
