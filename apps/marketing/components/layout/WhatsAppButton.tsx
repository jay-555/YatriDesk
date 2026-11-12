import { whatsappHref } from "@/config/site";
import { cn } from "@/lib/cn";

/** Floating WhatsApp enquiry button. `raised` lifts it above the mobile demo bar. */
export function WhatsAppButton({ raised = false }: { raised?: boolean }) {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp about a demo"
      className={cn(
        "fixed right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#128C4A] text-white shadow-lift transition-[bottom,transform] duration-300 hover:scale-105 md:right-6 md:bottom-6",
        raised ? "bottom-24" : "bottom-4",
      )}
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3a8.2 8.2 0 1 1 6.9 3.8Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5.1 5.1 0 0 0 1 2.7 11.6 11.6 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    </a>
  );
}
