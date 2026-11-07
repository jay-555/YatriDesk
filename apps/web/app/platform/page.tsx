"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/api";

interface RestaurantRow {
  id: string;
  name: string;
  status: string;
  plan: string;
  orders30d: number;
}

export default function PlatformHomePage() {
  const router = useRouter();
  const [rows, setRows] = useState<RestaurantRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    restaurantName: "",
    branchName: "Main",
    ownerName: "",
    ownerEmail: "",
  });
  const [created, setCreated] = useState<{ ownerEmail: string; temporaryPassword: string } | null>(null);

  const load = () =>
    api
      .get<RestaurantRow[]>("/platform/restaurants")
      .then(setRows)
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) router.replace("/platform/login");
        else setError(err instanceof ApiError ? err.message : "Could not load restaurants");
      });

  useEffect(() => {
    void load();
  }, []);

  const onboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await api.post<{ ownerEmail: string; temporaryPassword: string }>("/platform/restaurants", form);
      setCreated(result);
      setForm({ restaurantName: "", branchName: "Main", ownerName: "", ownerEmail: "" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create the restaurant");
    }
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Restaurants</h1>
        <Button variant="outline" onClick={() => api.post("/platform/logout").then(() => router.replace("/platform/login"))}>
          Sign out
        </Button>
      </div>
      {created && (
        <p className="rounded-lg border border-border p-4 text-sm">
          Owner {created.ownerEmail} can sign in with the one-time password <strong>{created.temporaryPassword}</strong>.
          It is shown only once.
        </p>
      )}
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={onboard}>
        <Input placeholder="Restaurant name" value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} required />
        <Input placeholder="Outlet name" value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })} required />
        <Input placeholder="Owner name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} required />
        <Input placeholder="Owner email" type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} required />
        <Button type="submit" className="sm:col-span-2">Create restaurant</Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={`/platform/${row.id}`} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 hover:bg-secondary">
              <span className="font-medium">{row.name}</span>
              <span className="text-sm text-muted-foreground">{row.status} · {row.plan} · {row.orders30d} orders / 30d</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
