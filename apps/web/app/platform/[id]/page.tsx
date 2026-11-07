"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModuleSwitchList, type ModuleSwitchRow } from "@/components/platform/module-switch-list";
import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";

interface RestaurantDetail {
  id: string;
  name: string;
  status: string;
  plan: string;
  users: { id: string; name: string; email: string | null; role: { name: string } }[];
}

export default function PlatformRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [row, setRow] = useState<RestaurantDetail | null>(null);
  const [modules, setModules] = useState<ModuleSwitchRow[]>([]);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    Promise.all([
      api.get<RestaurantDetail>(`/platform/restaurants/${id}`),
      api.get<ModuleSwitchRow[]>(`/platform/restaurants/${id}/modules`),
    ])
      .then(([detail, switches]) => {
        setRow(detail);
        setModules(switches);
      })
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) router.replace("/platform/login");
        else setError(err instanceof ApiError ? err.message : "Could not load this restaurant");
      });

  useEffect(() => {
    void load();
  }, [id]);

  const setStatus = async (status: "ACTIVE" | "SUSPENDED") => {
    setError(null);
    try {
      await api.post(`/platform/restaurants/${id}/status`, { status });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update the status");
    }
  };

  const onToggle = async (key: string, enabled: boolean) => {
    setError(null);
    setPendingKey(key);
    try {
      await api.put(`/platform/restaurants/${id}/modules`, { key, enabled });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update the module");
    } finally {
      setPendingKey(null);
    }
  };

  if (!row) {
    return <main className="p-10 text-sm text-muted-foreground">{error ?? "Loading…"}</main>;
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
      <Link href="/platform" className="text-sm text-muted-foreground">All restaurants</Link>
      <h1 className="text-2xl font-semibold">{row.name}</h1>
      <p className="text-sm text-muted-foreground">{row.status} · {row.plan}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStatus("ACTIVE")} disabled={row.status === "ACTIVE"}>Reactivate</Button>
        <Button variant="outline" onClick={() => setStatus("SUSPENDED")} disabled={row.status === "SUSPENDED"}>Suspend</Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Modules</h2>
        <ModuleSwitchList rows={modules} pendingKey={pendingKey} onToggle={(key, enabled) => void onToggle(key, enabled)} />
      </div>
      <ul className="flex flex-col gap-2">
        {row.users.map((user) => (
          <li key={user.id} className="rounded-lg border border-border px-4 py-2 text-sm">
            {user.name} · {user.email} · {user.role.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
