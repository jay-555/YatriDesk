import { IntegrationRequestForm } from "@/components/forms/IntegrationRequestForm";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";

export function Integrations() {
  return (
    <Section id="integrations" labelledBy="integrations-title" className="bg-bg-alt">
      <Container>
        <SectionHeading
          id="integrations-title"
          eyebrow="integrations.eyebrow"
          title="integrations.title"
          lead="We don't have integration partners yet, and we won't pretend otherwise. Here's what's on our roadmap. Tell us what you need and we'll prioritise it."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {site.integrations.map((i, idx) => (
              <Reveal as="li" key={i.title} delay={(idx % 2) * 0.06}>
                <div className="flex h-full flex-col rounded-panel border border-dashed border-line-strong bg-surface/70 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <IconTile name={i.icon} tone={idx % 2 ? "herb" : "saffron"} />
                    <Badge tone="neutral">Coming soon</Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-fg">{i.title}</h3>
                  <p className="mt-1 text-fg-muted">{i.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <IntegrationRequestForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
