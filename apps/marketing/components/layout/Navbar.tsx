"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { T } from "@/components/i18n/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { MobileDrawer } from "./MobileDrawer";
import { ResourcesMenu } from "./ResourcesMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled ? "border-line bg-surface/95 shadow-soft backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-18">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {site.nav.main.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="inline-flex h-11 items-center rounded-full px-3.5 text-sm font-medium text-fg transition-colors hover:bg-bg-alt"
            >
              <T k={item.key} />
            </Link>
          ))}
          <ResourcesMenu />
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 lg:flex">
            <LanguageToggle />
            <ThemeToggle />
            <a
              href={site.loginUrl}
              className="inline-flex h-11 items-center rounded-full px-3.5 text-sm font-medium text-fg transition-colors hover:bg-bg-alt"
            >
              <T k="nav.login" />
            </a>
          </div>
          <ButtonLink href="/contact" className="ml-1 hidden sm:inline-flex">
            <T k="cta.demo" />
          </ButtonLink>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-full text-fg transition-colors hover:bg-bg-alt lg:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </Container>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
