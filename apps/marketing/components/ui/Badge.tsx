import { cn } from "@/lib/cn";

type Tone = "saffron" | "herb" | "neutral" | "placeholder";

const tones: Record<Tone, string> = {
  saffron: "bg-saffron-soft text-brand",
  herb: "bg-herb-soft text-herb",
  neutral: "bg-bg-alt text-fg-muted",
  placeholder: "border border-dashed border-brand/50 bg-saffron-soft/60 text-brand",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
