import { ArrowRight, Check } from "lucide-react";
import { T } from "@/components/i18n/LanguageProvider";
import { HeroVisual } from "@/components/mockups/HeroVisual";
import { KdsMockup } from "@/components/mockups/KdsMockup";
import { PhoneMockup } from "@/components/mockups/PhoneMockup";
import { PosMockup } from "@/components/mockups/PosMockup";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TourButton } from "@/components/ui/TourButton";

const trust = ["No hardware lock-in", "Works offline", "Set up in a day"];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-8 pb-16 sm:pt-14 lg:pt-16 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px] bg-[radial-gradient(70%_60%_at_80%_0%,rgb(234_88_12/0.14),transparent_70%),radial-gradient(50%_50%_at_0%_30%,rgb(242_179_61/0.14),transparent_70%)]"
      />
      <Container className="grid items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-8">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex animate-rise items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-sm font-semibold text-fg-muted">
            <span className="size-2 rounded-full bg-herb" aria-hidden />
            <T k="hero.eyebrow" />
          </p>
          <h1 id="hero-title" className="text-display font-extrabold text-fg">
            <T k="hero.title" />
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lead text-fg-muted [animation-delay:80ms]">
            Bill a table in seconds, send KOTs straight to the kitchen and know your stock and sales from your
            phone. One simple system for your whole outlet.
          </p>
          <div className="mt-8 flex animate-rise flex-col gap-3 [animation-delay:160ms] sm:flex-row">
            <ButtonLink href="/contact#demo" size="lg">
              <T k="cta.demoShort" />
              <ArrowRight className="size-5" aria-hidden />
            </ButtonLink>
            <TourButton />
          </div>
          <ul
            className="mt-8 flex animate-rise flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-fg-muted [animation-delay:240ms]"
            aria-label="Why owners switch"
          >
            {trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-herb-soft text-herb">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual back={<KdsMockup compact />} middle={<PosMockup />} front={<PhoneMockup />} />
      </Container>
    </section>
  );
}
