"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginDto } from "@yatrideesk/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  // Set once the server says this account uses two-factor authentication.
  const [needsCode, setNeedsCode] = useState(false);
  // Shown inline under the form (a toast vanishes before it can be read).
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (dto: LoginDto) => {
    setError(null);
    login.mutate(dto, {
      onSuccess: (data) => {
        const session = data as { user?: { mustChangePassword?: boolean; roleName?: string; permissions?: string[] } };
        if (session.user?.mustChangePassword) {
          router.push("/change-password");
          return;
        }
        // A delivery rider has no back-office screens: open their deliveries.
        const user = session.user;
        const rider = user?.roleName === "DELIVERY_STAFF" && user.permissions?.includes("delivery.rider");
        router.push(rider ? "/my-deliveries" : "/dashboard");
      },
      onError: (err) => {
        if (err instanceof ApiError && err.message === "TWO_FACTOR_REQUIRED") {
          setNeedsCode(true);
          return;
        }
        if (err instanceof ApiError && err.status >= 500) {
          setError("The server is having a problem right now. Please try again in a minute.");
        } else if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Can't reach the server. Check your internet connection and try again.");
        }
      },
    });
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage your restaurant."
      footer={
        <>
          New restaurant?{" "}
          <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-medium text-foreground">Email or phone number</Label>
          <Input
            id="email"
            type="text"
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            autoFocus
            className="h-12 rounded-xl bg-background px-3"
            placeholder="you@restaurant.com or phone number"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            enterKeyHint="go"
            className="h-12 rounded-xl bg-background px-3"
            placeholder="Your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {needsCode && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="totp" className="font-medium text-foreground">Verification code</Label>
            <Input
              id="totp"
              inputMode="text"
              autoComplete="one-time-code"
              autoFocus
              placeholder="6-digit code or recovery code"
              className="h-12 rounded-xl bg-background px-3"
              {...register("totp")}
            />
            <p className="text-xs text-muted-foreground">
              Open your authenticator app, or use one of your recovery codes.
            </p>
            {errors.totp && <p className="text-xs text-destructive">{errors.totp.message}</p>}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="mt-1 h-12 w-full rounded-xl text-base" disabled={login.isPending}>
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
