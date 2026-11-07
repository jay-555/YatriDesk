import { z } from "zod";

function blankToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

export const createStaffSchema = z.object({
  name: z.string().trim().min(1, "Enter the staff member's name"),
  email: z.preprocess(
    blankToUndefined,
    z
      .string()
      .trim()
      .email("Enter a valid email address like name@example.com")
      .optional(),
  ),
  phone: z.preprocess(
    blankToUndefined,
    z
      .string()
      .trim()
      .refine(
        (value) => value.replace(/\D/g, "").length >= 6,
        "Enter a phone number with at least 6 digits",
      )
      .optional(),
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleId: z.string().min(1, "Choose a role"),
  branchIds: z.array(z.string()).min(1, "Select at least one branch"),
  departmentId: z.preprocess(
    blankToUndefined,
    z.string().min(1).nullable().optional(),
  ),
});
export type CreateStaffDto = z.infer<typeof createStaffSchema>;

export const updateStaffSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  roleId: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  branchIds: z.array(z.string()).optional(),
  password: z.string().min(8).optional(),
  departmentId: z.string().min(1).nullable().optional(),
});
export type UpdateStaffDto = z.infer<typeof updateStaffSchema>;

// --- Departments & per-user permission overrides -----------------------------

export const departmentSchema = z.object({
  name: z.string().trim().min(1).max(60),
});
export type DepartmentDto = z.infer<typeof departmentSchema>;

export const setPermissionOverridesSchema = z.object({
  overrides: z
    .array(
      z.object({
        permissionKey: z.string().min(1).max(80),
        effect: z.enum(["GRANT", "DENY"]),
        reason: z.string().trim().max(200).optional(),
        // ISO timestamp; omitted = never expires.
        expiresAt: z.string().datetime().optional(),
      }),
    )
    .max(100),
});
export type SetPermissionOverridesDto = z.infer<typeof setPermissionOverridesSchema>;
