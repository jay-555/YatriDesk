"use client";

import Link from "next/link";
import { useManagedOrders } from "@/hooks/use-orders";
import { openEntity } from "@/lib/entity-events";

export function NeedsActionStrip({ branchId }: { branchId: string | null }) {
  const { data } = useManagedOrders(branchId, "pending");
  if (!data || data.length === 0) return null;
  const shown = data.slice(0, 3);
  return (
    <div className="flex shrink-0 flex-col gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Needs action</p>
        <Link href="/orders" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
          Live orders
        </Link>
      </div>
      <ul className="flex flex-col gap-1">
        {shown.map((order) => (
          <li key={order.id}>
            <button
              type="button"
              onClick={() => openEntity("Order", order.id)}
              className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-2 text-left text-sm hover:bg-secondary"
            >
              <span className="min-w-0 truncate">
                <span className="font-medium text-foreground">#{order.orderNumber}</span>
                <span className="text-muted-foreground"> · {order.guestName ?? order.customer?.name ?? "Walk-in guest"}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">Accept</span>
            </button>
          </li>
        ))}
      </ul>
      {data.length > shown.length && (
        <p className="text-xs text-muted-foreground">+{data.length - shown.length} more waiting</p>
      )}
    </div>
  );
}
