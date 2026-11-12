import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { T } from "@/components/i18n/LanguageProvider";

export function Testimonials() {
  const { items, placeholder } = site.testimonials;
  return (
    <Section id="testimonials" labelledBy="testimonials-title">
      <Container>
        <SectionHeading id="testimonials-title" eyebrow="testimonials.eyebrow" title="testimonials.title" />
        {placeholder && (
          <p className="mt-4 text-center">
            <Badge tone="placeholder">Sample testimonials shown for layout only. Replace with real customers before launch.</Badge>
          </p>
        )}
        <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {items.map((t, i) => (
            <Reveal as="li" key={t.name} delay={i * 0.08} className="w-[85%] shrink-0 snap-center md:w-auto">
              <figure className="flex h-full flex-col rounded-panel border border-line bg-surface p-6 shadow-soft">
                <Quote className="size-8 text-saffron" aria-hidden />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-fg">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex size-11 items-center justify-center rounded-full bg-saffron-soft font-bold text-brand"
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="block font-semibold text-fg">{t.name}</span>
                    <span className="block text-sm text-fg-muted">{t.role}</span>
                  </span>
                  {placeholder && (
                    <Badge tone="placeholder" className="ms-auto">
                      Sample
                    </Badge>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/contact#demo" variant="secondary" size="lg">
            <T k="cta.demo" />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
