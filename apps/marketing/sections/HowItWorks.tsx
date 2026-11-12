import { ArrowRight, BarChart3, BookOpenCheck, ReceiptIndianRupee } from "lucide-react";
import { T } from "@/components/i18n/LanguageProvider";
import { DrawLine } from "@/components/motion/DrawLine";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: BookOpenCheck,
    title: "Set up your menu",
    body: "Send us your menu as a photo, PDF or sheet. We add dishes, prices, GST rates and printers with you, usually the same day.",
    time: "Day 1 · about 2 hours",
  },
  {
    icon: ReceiptIndianRupee,
    title: "Start billing",
    body: "Take orders, print KOTs and collect UPI, card or cash from the device you already own. Staff learn it in one shift.",
    time: "Day 1 · first service",
  },
  {
    icon: BarChart3,
    title: "Track your growth",
    body: "Check sales, top dishes and stock from your phone every morning, and fix what's leaking before it costs you.",
    time: "Every day after",
  },
];

export function HowItWorks() {
  return (
    <Section id="how" labelledBy="how-title" className="bg-bg-alt">
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow="how.eyebrow"
          title="how.title"
          lead="No long training sessions, no new hardware to order. Most outlets go live the same day."
        />
        <div className="relative mt-14">
          <DrawLine className="absolute top-7 right-[16%] left-[16%] hidden h-1 lg:block" />
          <ol className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.12} className="relative">
                <div className="flex flex-col items-start lg:items-center lg:text-center">
                  <span className="relative z-10 inline-flex size-14 items-center justify-center rounded-2xl bg-ink text-cream shadow-lift dark:bg-cream dark:text-ink">
                    <s.icon className="size-6" aria-hidden />
                    <span className="absolute -top-2 -right-2 inline-flex size-6 items-center justify-center rounded-full bg-saffron text-xs font-bold text-ink">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-fg">{s.title}</h3>
                  <p className="mt-2 max-w-sm text-fg-muted">{s.body}</p>
                  <p className="mt-3 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-herb">{s.time}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/contact#demo" size="lg">
            <T k="cta.demo" />
            <ArrowRight className="size-5" aria-hidden />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
