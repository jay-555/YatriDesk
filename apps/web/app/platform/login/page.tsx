"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, api } from "@/lib/api";

export default function PlatformLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await api.post<{ enrollmentRequired: boolean }>("/platform/login", {
        email,
        password,
        ...(code ? { totp: code } : {}),
      });
      if (result.enrollmentRequired) {
        const setup = await api.post<{ secret: string }>("/platform/totp/setup");
        setSecret(setup.secret);
        setEnrolling(true);
        return;
      }
      router.replace("/platform");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign-in failed");
    }
  };

  const enable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/platform/totp/enable", { code });
      router.replace("/platform");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That code did not match");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-2xl font-semibold">Platform</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to create and suspend restaurants.</p>
      </div>
      {!enrolling ? (
        <form className="flex flex-col gap-4" onSubmit={login}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Authenticator code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit">Sign in</Button>
        </form>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={enable}>
          <p className="text-sm">Add this secret to an authenticator app, then enter the 6-digit code.</p>
          <p className="break-all rounded-lg bg-muted p-3 font-mono text-sm">{secret}</p>
          <Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" required />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit">Enable authenticator</Button>
        </form>
      )}
    </main>
  );
}
