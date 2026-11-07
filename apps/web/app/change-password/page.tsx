"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-auth";
import { ApiError, api } from "@/lib/api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const me = useCurrentUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not change the password");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-2xl font-semibold">Choose a password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {me.data?.user.mustChangePassword
            ? "The one-time password from your invitation has to be replaced before you can use the register."
            : "Update the password on this account."}
        </p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="current">Current password</Label>
          <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="next">New password</Label>
          <Input id="next" type="password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save password"}</Button>
      </form>
    </main>
  );
}
