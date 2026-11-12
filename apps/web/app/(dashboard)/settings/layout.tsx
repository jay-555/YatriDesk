import type { ReactNode } from "react";
import { BrandedPage } from "@/components/layout/branded-page";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <BrandedPage>{children}</BrandedPage>;
}
