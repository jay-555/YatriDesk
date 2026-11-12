const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "₹1,499" — Indian digit grouping, no paise. */
export function formatInr(amount: number) {
  return `₹${inr.format(Math.round(amount))}`;
}

export type BillingCycle = "monthly" | "yearly";

/**
 * What a plan costs on a cycle. Yearly is billed as `monthsCharged` months
 * for 12 months of service, shown as an effective monthly figure.
 */
export function planPrice(monthly: number, cycle: BillingCycle, monthsCharged = 10) {
  if (cycle === "monthly") {
    return { perMonth: monthly, billed: monthly, saving: 0 };
  }
  const billed = monthly * monthsCharged;
  return {
    perMonth: Math.round(billed / 12),
    billed,
    saving: monthly * 12 - billed,
  };
}
