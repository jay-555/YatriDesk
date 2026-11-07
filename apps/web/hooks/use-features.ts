"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface FeatureFlags {
  saasMode: boolean;
  flags: Record<string, boolean>;
}

export function useFeatures() {
  return useQuery({
    queryKey: ["features"],
    queryFn: () => api.get<FeatureFlags>("/features"),
    staleTime: 60_000,
  });
}
