import { T } from "@/components/i18n/LanguageProvider";
import type { DictKey } from "@/components/i18n/dictionaries";
import { cn } from "@/lib/cn";

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  id: string;
  eyebrow?: DictKey;
  title: DictKey;
  lead?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">
          <T k={eyebrow} />
        </p>
      )}
      <h2 id={id} className="text-h2 font-bold text-fg">
        <T k={title} />
      </h2>
      {lead && <p className="mt-4 text-lead text-fg-muted">{lead}</p>}
    </div>
  );
}
