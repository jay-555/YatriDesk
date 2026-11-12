import { ChevronDown } from "lucide-react";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full min-h-12 rounded-xl border bg-surface px-4 text-base text-fg placeholder:text-fg-muted/70 transition-[border-color,box-shadow] outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 aria-invalid:border-[#D93025] aria-invalid:focus:ring-[#D93025]/15";

interface FieldShellProps {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (ids: { id: string; describedBy?: string }) => React.ReactNode;
}

function FieldShell({ label, error, hint, optional, className, children }: FieldShellProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-fg">
        {label}
        {optional && <span className="font-normal text-fg-muted"> (optional)</span>}
      </label>
      {children({ id, describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-[#B42318] dark:text-[#FF8A80]">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { label, error, hint, optional, className, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} hint={hint} optional={optional} className={className}>
      {({ id, describedBy }) => (
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(control, "border-line-strong")}
          {...rest}
        />
      )}
    </FieldShell>
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(function SelectField(
  { label, error, options, placeholder, className, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} className={className}>
      {({ id, describedBy }) => (
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={cn(control, "cursor-pointer appearance-none border-line-strong pe-11")}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fg-muted"
            aria-hidden
          />
        </div>
      )}
    </FieldShell>
  );
});

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  optional?: boolean;
};

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextAreaField(
  { label, error, optional, className, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} optional={optional} className={className}>
      {({ id, describedBy }) => (
        <textarea
          ref={ref}
          id={id}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(control, "min-h-24 border-line-strong py-3")}
          {...rest}
        />
      )}
    </FieldShell>
  );
});
