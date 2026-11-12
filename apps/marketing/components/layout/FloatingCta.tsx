"use client";

import { AnimatePresence, m } from "motion/react";
import { CalendarCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { T } from "@/components/i18n/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Mobile: a sticky "Book a Demo" bar at the bottom of the screen.
 * Desktop: a floating pill once the hero has scrolled away.
 * Both hide while a demo form is on screen, so they never cover it. The
 * WhatsApp button rides above the mobile bar only while the bar is showing.
 */
export function FloatingCta() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > 640);
      // The mobile bar waits for a short scroll so it never covers the hero's own CTAs.
      setScrolled(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const forms = document.querySelectorAll("[data-demo-form]");
    if (forms.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no form on this page
      setFormVisible(false);
      return;
    }
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setFormVisible(visible.size > 0);
    });
    forms.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, [pathname]);

  const showDesktop = pastHero && !formVisible;
  const hideMobile = formVisible || !scrolled;

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line glass px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden ${
          hideMobile ? "translate-y-full" : ""
        }`}
        aria-hidden={hideMobile}
        inert={hideMobile}
      >
        <ButtonLink href="/contact#demo" size="lg" className="w-full">
          <CalendarCheck className="size-5" aria-hidden />
          <T k="cta.demoShort" />
        </ButtonLink>
      </div>

      <WhatsAppButton raised={!hideMobile} />

      <AnimatePresence>
        {showDesktop && (
          <m.div
            key="pill"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-24 bottom-6 z-30 hidden md:block"
          >
            <ButtonLink href="/contact#demo" size="lg" className="shadow-lift">
              <CalendarCheck className="size-5" aria-hidden />
              <T k="cta.demo" />
            </ButtonLink>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
