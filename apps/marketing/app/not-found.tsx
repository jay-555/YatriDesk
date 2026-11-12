import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { T } from "@/components/i18n/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col items-center text-center">
        <div
          role="img"
          aria-label="An empty restaurant table with a reserved sign reading 404"
          className="relative flex h-40 w-64 items-end justify-center"
        >
          <div className="absolute bottom-6 h-3 w-60 rounded-full bg-fg/10 blur-sm" aria-hidden />
          <div className="relative w-56 rounded-2xl border-2 border-line-strong bg-surface p-4 shadow-lift" aria-hidden>
            <div className="mx-auto -mt-12 mb-2 flex h-16 w-28 flex-col items-center justify-center rounded-xl bg-ink text-cream shadow-soft dark:bg-cream dark:text-ink">
              <span className="text-[10px] tracking-widest uppercase opacity-70">Reserved</span>
              <span className="font-display text-2xl font-extrabold">404</span>
            </div>
            <div className="flex justify-between text-xs text-fg-muted">
              <span>Table —</span>
              <span>0 guests</span>
            </div>
          </div>
        </div>
        <h1 className="mt-10 max-w-xl text-h2 font-extrabold text-fg">
          <T k="notFound.title" />
        </h1>
        <p className="mt-4 max-w-md text-lead text-fg-muted">
          The page you&apos;re looking for has moved or never existed. Let&apos;s get you back to the main floor.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            <ArrowLeft className="size-5" aria-hidden /> Back to home
          </ButtonLink>
          <ButtonLink href="/contact#demo" variant="secondary" size="lg">
            <T k="cta.demo" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
