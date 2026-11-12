"use client";

import { useState } from "react";

export type SubmitState = "idle" | "submitting" | "success" | "error";

/** POSTs JSON; returns field errors from a 400 so the form can show them inline. */
export function useSubmit(endpoint: string) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(body: unknown): Promise<Record<string, string> | null> {
    setState("submitting");
    setMessage("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { errors?: Record<string, string>; message?: string };
      if (res.status === 400 && data.errors) {
        setState("idle");
        return data.errors;
      }
      if (!res.ok) throw new Error(data.message ?? "Something went wrong.");
      setState("success");
      return null;
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      return null;
    }
  }

  return { state, message, submit, reset: () => setState("idle") };
}
