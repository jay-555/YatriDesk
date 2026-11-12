import { cn } from "@/lib/cn";

/**
 * Fades content in and lifts it slightly the first time it scrolls into view.
 * Server-rendered markup only: one shared RevealObserver drives every
 * instance, so these add no hydration cost. Without JS, content stays visible.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  return (
    <Tag data-reveal className={cn(className)} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </Tag>
  );
}
