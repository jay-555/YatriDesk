import { Check } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { IconName } from "@/config/site";

const points: { icon: IconName; title: string; body: string; detail: string[] }[] = [
  {
    icon: "cloud",
    title: "Cloud-based, from anywhere",
    body: "Your data lives safely online, so you can check every outlet from your phone, wherever you are.",
    detail: ["Automatic backups", "Updates without downtime"],
  },
  {
    icon: "wifi-off",
    title: "Keeps billing offline",
    body: "Internet down at peak hour? Billing and KOTs carry on, and everything syncs once you're back.",
    detail: ["No lost bills", "Auto-sync"],
  },
  {
    icon: "sparkles",
    title: "Simple enough for day one",
    body: "Big buttons, clear screens, and a layout staff pick up in a single shift. No manual to read.",
    detail: ["English & Hindi", "Learns in one shift"],
  },
  {
    icon: "indian-rupee",
    title: "Priced for Indian outlets",
    body: "Clear monthly plans, no setup fee and no surprise charges. Pay yearly and save two months.",
    detail: ["No setup fee", "Cancel anytime"],
  },
  {
    icon: "headset",
    title: "Local support that picks up",
    body: "Real people on WhatsApp and phone who understand restaurants, GST and the dinner rush.",
    detail: ["WhatsApp & phone", "Guided onboarding"],
  },
  {
    icon: "plug",
    title: "Use the hardware you have",
    body: "Runs on your existing PC, tablet or phone and standard thermal printers. No lock-in, ever.",
    detail: ["Windows, Android, iOS", "Standard printers"],
  },
];

export function WhyUs() {
  return (
    <Section id="why" labelledBy="why-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="why-title"
              eyebrow="why.eyebrow"
              title="why.title"
              align="left"
              lead="Built around what owners told us they were missing: something that's quick to learn, doesn't fall over when the internet does, and doesn't cost a fortune."
            />
            <Link
              href="/pricing"
              className="mt-6 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline"
            >
              Compare plans →
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 2) * 0.08}>
                <div className="lift h-full rounded-panel border border-line bg-surface p-6 shadow-soft">
                  <IconTile name={p.icon} tone={i % 2 ? "herb" : "saffron"} />
                  <h3 className="mt-4 text-lg font-bold text-fg">{p.title}</h3>
                  <p className="mt-2 text-fg-muted">{p.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.detail.map((d) => (
                      <li
                        key={d}
                        className="inline-flex items-center gap-1 rounded-full bg-bg-alt px-2.5 py-1 text-xs font-semibold text-fg"
                      >
                        <Check className="size-3 text-herb" strokeWidth={3} aria-hidden />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
