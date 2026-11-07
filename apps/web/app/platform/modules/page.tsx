"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModuleSwitchList, type ModuleSwitchRow } from "@/components/platform/module-switch-list";
import { ApiError, api } from "@/lib/api";

export default function PlatformModulesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ModuleSwitchRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const load = () =>
    api
      .get<ModuleSwitchRow[]>("/platform/modules")
      .then(setRows)
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) router.replace("/platform/login");
        else setError(err instanceof ApiError ? err.message : "Could not load modules");
      });

  useEffect(() => {
    void load();
  }, []);

  const onToggle = async (key: string, enabled: boolean) => {
    setError(null);
    setPendingKey(key);
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, enabled } : row)));
    try {
      await api.put("/platform/modules", { key, enabled });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update the module");
      await load();
    } finally {
      setPendingKey(null);
    }
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/platform" className="text-sm text-muted-foreground">All restaurants</Link>
      <div>
        <h1 className="text-2xl font-semibold">Modules</h1>
        <p className="text-sm text-muted-foreground">
          Turning a module off hides it and blocks it for every restaurant. A restaurant can still be switched off on its own page while the module stays on here.
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ModuleSwitchList rows={rows} pendingKey={pendingKey} onToggle={(key, enabled) => void onToggle(key, enabled)} />
    </main>
  );
}
