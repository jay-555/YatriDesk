import type { ReactNode } from "react";

export function BrandedPage({ children }: { children: ReactNode }) {
  return (
    <div className="brand-theme -mx-4 -mt-4 min-h-full bg-background px-4 py-6 sm:-mx-6 sm:-mt-6 sm:px-6 sm:py-8 lg:-mx-8 lg:-mt-8 lg:px-8">
      {children}
    </div>
  );
}
