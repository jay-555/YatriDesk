import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site, whatsappHref } from "@/config/site";

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title" className="bg-bg-alt">
      <Container className="max-w-4xl">
        <SectionHeading id="faq-title" eyebrow="faq.eyebrow" title="faq.title" />
        <div className="mt-10">
          <Accordion items={site.faq} />
        </div>
        <p className="mt-8 text-center text-fg-muted">
          Still have a question?{" "}
          <a href={whatsappHref} target="_blank" rel="noopener" className="font-semibold text-brand underline-offset-4 hover:underline">
            Ask us on WhatsApp
          </a>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-brand underline-offset-4 hover:underline">
            book a demo
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
