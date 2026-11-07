"use client";

import Link from "next/link";

const STEPS = [
  { href: "/settings/outlet", title: "Outlet and tax", body: "Legal name, state, GSTIN, FSSAI, composition or regular, and opening hours." },
  { href: "/menu", title: "Menu", body: "Add items, or import a CSV from the menu page. Set an HSN code where you have one; otherwise the bill uses SAC 996331." },
  { href: "/team", title: "First cashier", body: "Create a cashier so the owner is not the only person who can take an order." },
  { href: "/pos", title: "Test bill", body: "Take one dine-in order and print the browser tax invoice or bill of supply." },
  { href: "/reports", title: "GST workbook", body: "Download the workbook for the same dates and check it against the tax report." },
  { href: "/settings/billing", title: "Subscription", body: "Start the Starter plan when you are ready to be billed. A halted subscription suspends this restaurant only." },
];

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Set up this outlet</h1>
        <p className="text-sm text-muted-foreground">Six steps from an empty account to a bill you can hand a guest.</p>
      </div>
      <ol className="flex flex-col gap-3">
        {STEPS.map((step, index) => (
          <li key={step.href} className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Step {index + 1}</p>
            <Link href={step.href} className="text-lg font-medium hover:underline">{step.title}</Link>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
