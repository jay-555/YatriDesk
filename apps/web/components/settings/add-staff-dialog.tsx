"use client";

import { useState } from "react";
import { toast as sonner } from "sonner";
import { createStaffSchema } from "@yatrideesk/types";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranch } from "@/hooks/use-branch";
import { useCreateStaff, useDepartments, useStaffRoles } from "@/hooks/use-staff";
import { ApiError } from "@/lib/api";

type FieldKey = "name" | "email" | "phone" | "password" | "roleId" | "branchIds";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function AddStaffDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const { branches } = useBranch();
  const [branchIds, setBranchIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const { data: roles } = useStaffRoles();
  const { data: departments } = useDepartments();
  const createStaff = useCreateStaff();

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRoleId("");
    setDepartmentId("");
    setBranchIds([]);
    setErrors({});
  };

  const clearError = (key: FieldKey) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleBranch = (id: string) => {
    setBranchIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
    clearError("branchIds");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createStaffSchema.safeParse({
      name,
      email,
      phone,
      password,
      roleId,
      branchIds,
      departmentId,
    });
    if (!parsed.success) {
      const next: Partial<Record<FieldKey, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "") as FieldKey;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const summary = [...new Set(parsed.error.issues.map((issue) => issue.message))];
      toast.error(summary.join(". "));
      return;
    }
    setErrors({});
    createStaff.mutate(parsed.data, {
      onSuccess: () => {
        sonner.success(`${parsed.data.name} added`);
        setOpen(false);
        reset();
      },
      onError: (err) =>
        toast.error(err instanceof ApiError ? err.message : "Could not add staff account"),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setErrors({});
      }}
    >
      <DialogTrigger render={<Button size="sm">Add staff</Button>} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New staff account</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="s-name">Name</Label>
            <Input
              id="s-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              aria-invalid={Boolean(errors.name)}
              autoFocus
            />
            <FieldError message={errors.name} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-email">Email</Label>
              <Input
                id="s-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                aria-invalid={Boolean(errors.email)}
                placeholder="name@example.com"
              />
              <FieldError message={errors.email} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-phone">Phone</Label>
              <Input
                id="s-phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError("phone");
                }}
                aria-invalid={Boolean(errors.phone)}
                placeholder="98765 43210"
              />
              <FieldError message={errors.phone} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="s-password">Password</Label>
            <PasswordInput
              id="s-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password ? (
              <FieldError message={errors.password} />
            ) : (
              <p className="text-xs text-muted-foreground">At least 8 characters.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <Select
              value={roleId}
              onValueChange={(v) => {
                setRoleId(v ?? "");
                clearError("roleId");
              }}
            >
              <SelectTrigger className="w-full" aria-invalid={Boolean(errors.roleId)}>
                <SelectValue placeholder="Select role">
                  {(value: string | null) =>
                    roles?.find((role) => role.id === value)?.label ?? "Select role"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {roles?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.roleId} />
          </div>

          {departments && departments.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Department (optional)</Label>
              <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No department">
                    {(value: string | null) =>
                      departments.find((department) => department.id === value)?.name ??
                      "No department"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Branches</Label>
            <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
              {branches.map((b) => (
                <label key={b.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={branchIds.includes(b.id)}
                    onCheckedChange={() => toggleBranch(b.id)}
                  />
                  {b.name}
                </label>
              ))}
            </div>
            <FieldError message={errors.branchIds} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createStaff.isPending} className="w-full sm:w-auto">
              {createStaff.isPending ? "Adding…" : "Add staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
