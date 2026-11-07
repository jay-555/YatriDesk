"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 text-sm leading-6">
      <h1 className="text-2xl font-semibold">Privacy</h1>
      <p>
        YatriDesk stores the outlet&apos;s orders, bills, staff accounts, and guest contact details so the restaurant can run service and keep its tax records. On the hosted service that data stays in an Indian region.
      </p>
      <p>
        The restaurant is responsible for the guest data it collects. The account owner can delete their own login from{" "}
        <Link href="/settings/security" className="underline">Security</Link>. A guest record can be deleted by anyone with the customers permission, from the guest&apos;s page.
      </p>
      <p>
        This page describes the product behaviour. It is not a legal opinion and it does not replace the restaurant&apos;s own notice to guests.
      </p>
    </div>
  );
}
