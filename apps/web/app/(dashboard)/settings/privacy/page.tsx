"use client";

import Link from "next/link";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Restaurant, branch, and staff configuration</p>
      </div>
      <SettingsTabs />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 text-sm leading-6">
      <h2 className="text-2xl font-semibold">Privacy</h2>
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
    </div>
  );
}
