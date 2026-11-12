import Link from "next/link";
import { T } from "@/components/i18n/LanguageProvider";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/config/site";

export function BusinessTypes() {
  return (
    <section aria-labelledby="types-title" className="border-y border-line bg-surface/60 py-8 sm:py-10">
      <Container>
        <h2 id="types-title" className="text-center text-sm font-semibold tracking-wide text-fg-muted uppercase">
          <T k="types.title" />
        </h2>
        <ul className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {site.businessTypes.map((b) => (
            <li key={b.id} className="snap-start">
              <Link
                href={`/#solutions`}
                className="lift inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold whitespace-nowrap text-fg"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-saffron-soft text-brand">
                  <Icon name={b.icon} className="size-4" />
                </span>
                {b.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
