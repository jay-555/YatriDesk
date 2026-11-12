import { T } from "@/components/i18n/LanguageProvider";
import { Counter } from "@/components/motion/Counter";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export function Numbers() {
  const { items, placeholder } = site.stats;
  return (
    <section aria-labelledby="numbers-title" className="cv-auto bg-ink py-16 text-cream sm:py-20">
      <Container>
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 id="numbers-title" className="text-h2 font-bold">
            <T k="numbers.title" />
          </h2>
          {placeholder && (
            <Badge tone="placeholder" className="border-saffron/60 bg-transparent text-saffron">
              Placeholder figures, to be replaced with real numbers before launch
            </Badge>
          )}
        </div>
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {items.map((s) => (
            <div key={s.label} className="flex flex-col-reverse items-center text-center">
              <dt className="mt-2 text-sm text-cream/70 sm:text-base">{s.label}</dt>
              <dd className="font-display text-4xl font-extrabold text-saffron sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
