"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { hasPermission, useCurrentUser } from "@/hooks/use-auth";
import { useNavBadges } from "@/hooks/use-nav-badges";
import { useBranch } from "@/hooks/use-branch";
import { useSettings } from "@/hooks/use-settings";
import { useFeatures } from "@/hooks/use-features";
import { cn } from "@/lib/utils";
import { NavDot } from "@/components/layout/nav-dot";

interface SettingsTab {
  label: string;
  href: string;
  /** Omit to show the tab to anyone who can reach /settings at all. */
  permission?: string;
  /** Only shown for branches in this country (ISO code). */
  country?: string;
}

const TABS: SettingsTab[] = [
  { label: "General", href: "/settings" },
  { label: "Billing", href: "/settings/billing", permission: "settings.manage" },
  { label: "Privacy", href: "/settings/privacy" },
  { label: "Staff", href: "/settings/staff", permission: "users.manage" },
  { label: "Roles", href: "/settings/roles", permission: "roles.manage" },
  { label: "Audit Log", href: "/settings/audit-log", permission: "audit_log.view" },
  { label: "Backup", href: "/settings/backup", permission: "backup.manage" },
  { label: "Updates", href: "/settings/updates", permission: "system.update" },
  { label: "Server Sync", href: "/settings/sync", permission: "settings.manage" },
  { label: "Integrations", href: "/settings/integrations", permission: "settings.manage" },
  { label: "API Keys", href: "/settings/api-keys" },
  { label: "Security", href: "/settings/security" },
  { label: "Webhooks", href: "/settings/webhooks", permission: "settings.manage" },
  { label: "VERI*FACTU", href: "/settings/verifactu", permission: "settings.manage", country: "ES" },
];

export function SettingsTabs() {
  const pathname = usePathname();
  const { data } = useCurrentUser();
  const user = data?.user;
  const badges = useNavBadges();
  const { branchId } = useBranch();
  const branchCountry = useSettings(branchId).data?.branch.country;
  const saas = useFeatures().data?.saasMode === true;
  const hostedOff = saas
    ? new Set(["/settings/backup", "/settings/updates", "/settings/sync"])
    : new Set<string>();

  const navRef = useRef<HTMLElement>(null);

  const visibleTabs = TABS.filter(
    (tab) =>
      !hostedOff.has(tab.href) &&
      (!tab.permission || hasPermission(user, tab.permission)) &&
      (!tab.country || branchCountry === tab.country),
  );

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>("[aria-current='page']");
    if (!nav || !active) return;
    const left = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left) });
  }, [pathname, visibleTabs.length]);

  return (
    <nav
      ref={navRef}
      aria-label="Settings"
      className="flex w-full min-w-0 gap-1 overflow-x-auto overscroll-x-contain border-b border-border"
    >
      {visibleTabs.map((tab) => {
        const isActive =
          tab.href === "/settings" ? pathname === "/settings" : pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {badges.settingsTabs[tab.href] ? <NavDot className="ml-0" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
