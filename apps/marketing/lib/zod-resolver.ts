import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";
import { fieldErrors } from "./schemas.ts";

/** Minimal react-hook-form resolver for Zod 4 schemas. */
export function zodResolver<T extends FieldValues>(schema: z.ZodType): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) return { values: values as T, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const [key, message] of Object.entries(fieldErrors(result.error))) {
      errors[key] = { type: "validation", message };
    }
    return { values: {}, errors: errors as FieldErrors<T> };
  };
}
