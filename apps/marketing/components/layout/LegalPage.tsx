import { Container } from "@/components/ui/Container";

/** Shared shell for the placeholder legal pages. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <p className="mb-4 rounded-card border border-dashed border-brand/50 bg-saffron-soft/60 p-4 text-sm font-medium text-brand">
          Placeholder text. Have this page reviewed by a lawyer and replaced before launch.
        </p>
        <h1 className="text-h2 font-extrabold text-fg">{title}</h1>
        <p className="mt-2 text-sm text-fg-muted">Last updated: {updated}</p>
        <div className="mt-8 space-y-6 text-fg-muted [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-fg [&_li]:ms-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
      </Container>
    </article>
  );
}
