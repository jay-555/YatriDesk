"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { site } from "@/config/site";
import { track } from "@/lib/analytics";
import { integrationRequestSchema, type IntegrationRequestInput } from "@/lib/schemas";
import { zodResolver } from "@/lib/zod-resolver";
import { useSubmit } from "./useSubmit";

const categories = site.integrations.map((i) => ({ value: i.title, label: i.title }));

export function IntegrationRequestForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<IntegrationRequestInput>({
    resolver: zodResolver<IntegrationRequestInput>(integrationRequestSchema),
    defaultValues: { name: "", contact: "", category: "", details: "", website: "" },
    mode: "onTouched",
  });
  const { state, message, submit, reset } = useSubmit("/forms/integration-request");

  const onSubmit = handleSubmit(async (values) => {
    const fieldErrors = await submit(values);
    if (fieldErrors) {
      for (const [name, msg] of Object.entries(fieldErrors)) {
        setError(name as keyof IntegrationRequestInput, { type: "server", message: msg });
      }
      return;
    }
    track("integration_request", { category: values.category });
  });

  if (state === "success") {
    return (
      <div role="status" className="rounded-panel border border-herb/30 bg-herb-soft p-6">
        <CheckCircle2 className="size-8 text-herb" aria-hidden />
        <p className="mt-3 text-lg font-bold text-fg">Request noted, thank you.</p>
        <p className="mt-1 text-fg-muted">We&apos;ll let you know as soon as this integration is ready.</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => {
            resetForm();
            reset();
          }}
        >
          Request another
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-label="Request an integration"
      className="rounded-panel border border-line bg-surface p-5 shadow-soft sm:p-6"
    >
      <h3 className="text-lg font-bold text-fg">Request an integration</h3>
      <p className="mt-1 text-sm text-fg-muted">Tell us what you use today. Requests shape what we build first.</p>
      <div className="mt-5 grid gap-4">
        <TextField label="Your name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <TextField
          label="Email or mobile"
          autoComplete="email"
          error={errors.contact?.message}
          {...register("contact")}
        />
        <SelectField
          label="Category"
          placeholder="Choose a category"
          options={categories}
          error={errors.category?.message}
          {...register("category")}
        />
        <TextAreaField
          label="Which tool or service?"
          optional
          placeholder="e.g. the accounting software or card machine you use"
          error={errors.details?.message}
          {...register("details")}
        />
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-4 flex gap-2 rounded-xl bg-[#FDE2E1] p-3 text-sm text-[#7A1D14]">
          <AlertCircle className="size-5 shrink-0" aria-hidden />
          {message} Please try again.
        </p>
      )}
      <Button type="submit" className="mt-5 w-full" disabled={state === "submitting"}>
        {state === "submitting" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
        {state === "submitting" ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}
