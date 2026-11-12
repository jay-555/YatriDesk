"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterDto } from "@yatrideesk/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { StatusNote, useNoteToast } from "@/components/ui/status-note";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const register = useRegister();
  const { note, clear, toast } = useNoteToast();
  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (dto: RegisterDto) => {
    register.mutate(dto, {
      onSuccess: () => router.push("/dashboard"),
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Something went wrong");
      },
    });
  };

  return (
    <AuthCard
      title="Set up your restaurant"
      description="Create your owner account and add your first branch."
      className="max-w-lg"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="restaurantName" className="font-medium text-foreground">Restaurant name</Label>
          <Input
            id="restaurantName"
            autoComplete="organization"
            placeholder="e.g. Spice Route"
            className="h-12 rounded-xl bg-background px-3"
            {...field("restaurantName")}
          />
          {errors.restaurantName && (
            <p className="text-xs text-destructive">{errors.restaurantName.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="branchName" className="font-medium text-foreground">First branch name</Label>
            <Input
              id="branchName"
              placeholder="Main Branch"
              defaultValue="Main Branch"
              className="h-12 rounded-xl bg-background px-3"
              {...field("branchName")}
            />
            {errors.branchName && (
              <p className="text-xs text-destructive">{errors.branchName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ownerName" className="font-medium text-foreground">Your name</Label>
            <Input
              id="ownerName"
              autoComplete="name"
              placeholder="e.g. Priya Sharma"
              className="h-12 rounded-xl bg-background px-3"
              {...field("ownerName")}
            />
            {errors.ownerName && (
              <p className="text-xs text-destructive">{errors.ownerName.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-medium text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@restaurant.com"
            className="h-12 rounded-xl bg-background px-3"
            {...field("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="h-12 rounded-xl bg-background px-3"
            {...field("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <StatusNote note={note} onClear={clear} />
        <Button type="submit" className="mt-1 h-12 w-full rounded-xl text-base" disabled={register.isPending}>
          {register.isPending ? "Creating your account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
