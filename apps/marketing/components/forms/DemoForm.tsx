"use client";

import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { T } from "@/components/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { site, whatsappHref } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { demoRequestSchema, type DemoRequestInput } from "@/lib/schemas";
import { zodResolver } from "@/lib/zod-resolver";
import { useSubmit } from "./useSubmit";

const typeOptions = site.businessTypes.map((b) => ({ value: b.id, label: b.label }));

export function DemoForm({ className, tone = "light" }: { className?: string; tone?: "light" | "card" }) {
  const {
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<DemoRequestInput>({
    resolver: zodResolver<DemoRequestInput>(demoRequestSchema),
    defaultValues: { name: "", phone: "", restaurant: "", city: "", businessType: "", website: "" },
    mode: "onTouched",
  });
  const { state, message, submit, reset } = useSubmit("/forms/demo");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "success" || state === "error") resultRef.current?.focus();
  }, [state]);

  const onSubmit = handleSubmit(async (values) => {
    const fieldErrors = await submit(values);
    if (fieldErrors) {
      for (const [name, msg] of Object.entries(fieldErrors)) {
        setError(name as keyof DemoRequestInput, { type: "server", message: msg });
      }
      return;
    }
    track("demo_request", { businessType: values.businessType });
  });

  if (state === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        data-demo-form
        className={cn("rounded-panel border border-herb/30 bg-herb-soft p-6 text-fg outline-none sm:p-8", className)}
      >
        <CheckCircle2 className="size-10 text-herb" aria-hidden />
        <h3 className="mt-4 text-2xl font-bold">Thanks! Your demo request is in.</h3>
        <p className="mt-2 text-fg-muted">
          Our team will call you within one working day to pick a time. Want to talk sooner? Message us on WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            className="inline-flex h-11 items-center rounded-full bg-[#128C4A] px-5 font-semibold text-white"
          >
            <T k="cta.whatsapp" />
          </a>
          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              reset();
            }}
          >
            Send another request
          </Button>
        </div>
      </div>
    );
  }

  const submitting = state === "submitting";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      data-demo-form
      aria-label="Book a free demo"
      className={cn(
        "rounded-panel border border-line bg-surface p-5 text-fg shadow-lift sm:p-7",
        tone === "card" && "shadow-soft",
        className,
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Your name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <TextField
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <TextField
          label="Restaurant name"
          autoComplete="organization"
          error={errors.restaurant?.message}
          {...register("restaurant")}
        />
        <TextField label="City" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
        <SelectField
          label="Business type"
          placeholder="Choose one"
          options={typeOptions}
          error={errors.businessType?.message}
          className="sm:col-span-2"
          {...register("businessType")}
        />
        {/* Honeypot: hidden from people and screen readers, bots fill it in. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>
      </div>

      {state === "error" && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="mt-4 flex gap-2 rounded-xl bg-[#FDE2E1] p-3 text-sm text-[#7A1D14] outline-none"
        >
          <AlertCircle className="size-5 shrink-0" aria-hidden />
          <span>
            {message} Please try again, or reach us on{" "}
            <a href={whatsappHref} target="_blank" rel="noopener" className="font-semibold underline">
              WhatsApp
            </a>
            .
          </span>
        </div>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          <>
            <T k="cta.demo" />
            <ArrowRight className="size-5" aria-hidden />
          </>
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-fg-muted">
        Free, no obligation. We&apos;ll only use your number to arrange the demo.
      </p>
    </form>
  );
}
