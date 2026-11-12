import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { DemoForm } from "@/components/forms/DemoForm";
import { T } from "@/components/i18n/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { site, whatsappHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Book a free demo",
  description:
    "See YatriDesk with your own menu in a free 20-minute demo. Billing, KOT, kitchen display, inventory and reports for your restaurant.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: `Book a free demo · ${site.name}` },
};

const steps = [
  { title: "We call you", body: "Within one working day, to understand your outlet and pick a time." },
  { title: "Live demo on your menu", body: "20 minutes on a video call. We bill a few of your own dishes." },
  { title: "Start your free trial", body: "We set it up with you. Most outlets bill the same day." },
];

export default function ContactPage() {
  return (
    <section aria-labelledby="contact-title" className="relative overflow-hidden pt-10 pb-20 sm:pt-16 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_85%_0%,rgb(234_88_12/0.14),transparent_70%)]"
      />
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Free · 20 minutes · No obligation</p>
          <h1 id="contact-title" className="text-display font-extrabold text-fg">
            <T k="contact.title" />
          </h1>
          <p className="mt-5 text-lead text-fg-muted">
            See how YatriDesk would run your outlet, from the first KOT to the day-end report. Bring your questions.
          </p>

          <h2 className="mt-10 font-display text-lg font-bold text-fg">What happens next</h2>
          <ol className="mt-4 space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink font-bold text-cream dark:bg-cream dark:text-ink">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold text-fg">{s.title}</span>
                  <span className="block text-fg-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <h2 className="mt-10 font-display text-lg font-bold text-fg">Prefer to talk now?</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener"
                className="lift flex min-h-14 items-center gap-3 rounded-card border border-line bg-surface p-4"
              >
                <MessageCircle className="size-5 text-herb" aria-hidden />
                <span>
                  <span className="block font-semibold text-fg">WhatsApp</span>
                  <span className="block text-sm text-fg-muted">Fastest reply</span>
                </span>
              </a>
            </li>
            <li>
              <a href={site.contact.phoneHref} className="lift flex min-h-14 items-center gap-3 rounded-card border border-line bg-surface p-4">
                <Phone className="size-5 text-brand" aria-hidden />
                <span>
                  <span className="block font-semibold text-fg">{site.contact.phoneDisplay}</span>
                  <span className="block text-sm text-fg-muted">Call us</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="lift flex min-h-14 items-center gap-3 rounded-card border border-line bg-surface p-4"
              >
                <Mail className="size-5 text-brand" aria-hidden />
                <span className="min-w-0">
                  <span className="block font-semibold text-fg">Email</span>
                  <span className="block truncate text-sm text-fg-muted">{site.contact.email}</span>
                </span>
              </a>
            </li>
            <li className="flex min-h-14 items-center gap-3 rounded-card border border-line bg-surface p-4">
              <Clock className="size-5 text-herb" aria-hidden />
              <span>
                <span className="block font-semibold text-fg">{site.contact.hours}</span>
                <span className="flex items-center gap-1 text-sm text-fg-muted">
                  <MapPin className="size-3.5" aria-hidden /> {site.contact.address}
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div id="demo" className="lg:pt-6">
          <DemoForm />
        </div>
      </Container>
    </section>
  );
}
