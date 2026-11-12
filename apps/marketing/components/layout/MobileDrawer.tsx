"use client";

import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { T } from "@/components/i18n/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { site, whatsappHref } from "@/config/site";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Native modal <dialog>: the browser traps focus, makes the page behind it
 * inert and closes on Esc. Page scrolling is locked while it's open.
 */
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onDialogClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, [onClose]);

  const linkClass =
    "flex min-h-12 items-center justify-between rounded-xl px-3 text-base font-semibold text-fg transition-colors hover:bg-bg-alt";

  return (
    <dialog
      ref={ref}
      aria-label="Site menu"
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-0 ms-auto h-dvh max-h-none w-[min(22rem,100vw)] max-w-none bg-surface p-0 text-fg shadow-lift open:animate-[rise_0.3s_cubic-bezier(0.22,1,0.36,1)]"
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-bg-alt"
            aria-label="Close menu"
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {site.nav.main.map((item) => (
              <li key={item.key}>
                <Link href={item.href} onClick={onClose} className={linkClass}>
                  <T k={item.key} />
                  <ChevronRight className="size-5 text-fg-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 mb-2 px-3 text-xs font-semibold tracking-wide text-fg-muted uppercase">
            <T k="nav.resources" />
          </p>
          <ul className="space-y-1">
            {site.nav.resources.map((r) => (
              <li key={r.label}>
                <a href={r.href} onClick={onClose} className={linkClass}>
                  <span className="font-medium">{r.label}</span>
                  <span className="text-xs font-normal text-fg-muted">Soon</span>
                </a>
              </li>
            ))}
            <li>
              <a href={site.loginUrl} className={linkClass}>
                <T k="nav.login" />
                <ChevronRight className="size-5 text-fg-muted" aria-hidden />
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-3 border-t border-line p-4">
          <div className="flex items-center justify-between">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <ButtonLink href="/contact" size="lg" className="w-full" onClick={onClose}>
            <T k="cta.demo" />
          </ButtonLink>
          <ButtonLink href={whatsappHref} variant="secondary" size="lg" className="w-full" target="_blank" rel="noopener">
            <T k="cta.whatsapp" />
          </ButtonLink>
        </div>
      </div>
    </dialog>
  );
}
