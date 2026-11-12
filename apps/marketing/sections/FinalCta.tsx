import { CheckCircle2 } from "lucide-react";
import { DemoForm } from "@/components/forms/DemoForm";
import { T } from "@/components/i18n/LanguageProvider";
import { Container } from "@/components/ui/Container";

const promises = ["A 20-minute call, on your own menu", "Set up with you, usually the same day", "Free trial, no card needed"];

export function FinalCta() {
  return (
    <section id="demo" aria-labelledby="final-title" className="cv-auto relative overflow-hidden bg-ink py-16 text-cream sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_90%_10%,rgb(234_88_12/0.35),transparent_70%),radial-gradient(40%_60%_at_0%_100%,rgb(47_125_79/0.3),transparent_70%)]"
      />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 id="final-title" className="text-h2 font-bold">
            <T k="final.title" />
          </h2>
          <p className="mt-4 max-w-lg text-lead text-cream/75">
            Tell us a little about your outlet. We&apos;ll call to show you YatriDesk with your own dishes and prices.
          </p>
          <ul className="mt-8 space-y-3">
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-3 text-cream/90">
                <CheckCircle2 className="size-5 shrink-0 text-saffron" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <DemoForm />
      </Container>
    </section>
  );
}
