import type { ReactNode } from "react";
import { BrandedPage } from "@/components/layout/branded-page";

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return <BrandedPage>{children}</BrandedPage>;
}
