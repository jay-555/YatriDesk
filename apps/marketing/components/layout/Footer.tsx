import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { site, whatsappHref } from "@/config/site";

const socialPaths: Record<string, string> = {
  instagram:
    "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.9-8.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.3 0 2.5 0 3.4.1 2.3.1 3.4 1.2 3.5 3.5.1.9.1 1.1.1 3.4v2.8c0 2.3 0 2.5-.1 3.4-.1 2.3-1.2 3.4-3.5 3.5-.9.1-1.1.1-3.4.1H9.2c-2.3 0-2.5 0-3.4-.1-2.3-.1-3.4-1.2-3.5-3.5-.1-.9-.1-1.1-.1-3.4V9.2c0-2.3 0-2.5.1-3.4.1-2.3 1.2-3.4 3.5-3.5.9-.1 1.1-.1 3.4-.1H12Z",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-3.95v-11Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  x: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z",
};

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold text-cream">{title}</h2>
      <ul className="mt-4 space-y-1">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="inline-flex min-h-10 items-center text-sm text-cream/70 transition-colors hover:text-cream"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="cv-auto border-t border-white/10 bg-ink text-cream" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              Cloud POS and operations for restaurants, cafes, cloud kitchens, bakeries and hotels across India.
              Bill faster, waste less, and see your numbers every day.
            </p>
            <ul className="mt-6 flex gap-2" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={s.label}
                    className="inline-flex size-11 items-center justify-center rounded-full bg-white/8 text-cream/80 transition-colors hover:bg-white/15 hover:text-cream"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                      <path d={socialPaths[s.icon]} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterColumn title="Product" links={site.footer.product} />
            <FooterColumn title="Company" links={site.footer.company} />
            <FooterColumn title="Resources" links={site.footer.resources} />
            <div>
              <h2 className="font-display text-sm font-semibold text-cream">Contact</h2>
              <ul className="mt-4 space-y-3 text-sm text-cream/70">
                <li>
                  <a href={site.contact.phoneHref} className="inline-flex min-h-10 items-start gap-2 hover:text-cream">
                    <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {site.contact.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="inline-flex min-h-10 items-start gap-2 break-all hover:text-cream"
                  >
                    <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {site.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {site.contact.address}
                </li>
                <li>
                  <a href={whatsappHref} target="_blank" rel="noopener" className="font-semibold text-saffron hover:underline">
                    WhatsApp us →
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved. Made in India.
          </p>
          <ul className="flex gap-6">
            {site.footer.legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="inline-flex min-h-10 items-center hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
