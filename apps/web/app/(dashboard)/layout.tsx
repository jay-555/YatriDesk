"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useCurrentUser } from "@/hooks/use-auth";
import { BranchProvider, useBranch } from "@/hooks/use-branch";
import { useRealtime } from "@/hooks/use-realtime";
import { NativeBridge } from "@/components/native/native-bridge";
import { BtPrinterDialog } from "@/components/native/bt-printer-dialog";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { useFeatures } from "@/hooks/use-features";
import { modulePageAllowed } from "@/lib/modules";
import { canOpen, firstAllowedHref } from "@/lib/route-access";

// Subscribes every route in this layout group to realtime push (order/KOT/
// table updates) instead of only the one page (KDS) that happened to call
// useRealtime itself — the Dashboard summary page had NO push subscription
// at all and relied solely on its own 15s/60s polling (see use-dashboard.ts),
// so a payment completed at one terminal took up to 15s to show up on a
// manager's dashboard tab elsewhere, or never did if that tab predates the
// poll window. Rendered as a child of BranchProvider (not the layout
// component itself) since useBranch() needs to run below the provider.
function RealtimeBridge() {
  const { branchId } = useBranch();
  useRealtime(branchId);
  return null;
}

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useCurrentUser();
  const permissions = data?.user.permissions;
  const flags = useFeatures().data?.flags;
  const featureAllowed = modulePageAllowed(pathname ?? "", flags);
  const allowed = (!permissions || canOpen(pathname ?? "", permissions, NAV_ITEMS)) && featureAllowed;
  const fallback = permissions
    ? firstAllowedHref(
        permissions,
        NAV_ITEMS.filter((item) => !item.featureKey || flags?.[item.featureKey] !== false),
      )
    : undefined;

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace("/login");
    }
    if (!isLoading && data?.user.mustChangePassword) {
      router.replace("/change-password");
    }
  }, [isLoading, isError, data?.user.mustChangePassword, router]);

  // Direct URL to a page the role may not use (e.g. a waiter opening /dashboard
  // after login): send them to their first permitted screen.
  useEffect(() => {
    if (!allowed && fallback && fallback !== pathname) router.replace(fallback);
  }, [allowed, fallback, pathname, router]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-background" />;
  }

  if (isError || !data || data.user.mustChangePassword) {
    return null;
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center text-sm text-muted-foreground">
        {fallback ? "Redirecting…" : "Your role has no access to this page. Ask an administrator."}
      </div>
    );
  }

  return (
    <BranchProvider>
      <RealtimeBridge />
      <NativeBridge />
      <BtPrinterDialog />
      <AppShell user={data.user}>{children}</AppShell>
    </BranchProvider>
  );
}
