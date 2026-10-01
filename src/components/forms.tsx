"use client";

import { useState } from "react";
import { formatPhoneInput, validateContact, type ContactFieldErrors } from "@/lib/leads/schema";

export type ContactValues = { name: string; phone: string; email: string; zip: string; message: string; company: string };
type FieldName = keyof ContactFieldErrors;

const EMPTY: ContactValues = { name: "", phone: "", email: "", zip: "", message: "", company: "" };

/** Shared state + validation for the contact details used by both lead forms. */
export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});

  const set = (name: keyof ContactValues, raw: string) => {
    let value = raw;
    if (name === "phone") value = formatPhoneInput(raw);
    if (name === "zip") value = raw.replace(/\D/g, "").slice(0, 5);
    const next = { ...values, [name]: value };
    setValues(next);
    if (name !== "company" && touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateContact(next)[name] }));
    }
  };

  const blur = (name: FieldName) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateContact(values)[name] }));
  };

  /** Validates everything; returns true when valid. Focuses the first invalid field. */
  const validateAll = (form: HTMLFormElement | null): boolean => {
    const all = validateContact(values);
    setErrors(all);
    setTouched({ name: true, phone: true, email: true, zip: true, message: true });
    const first = (Object.keys(all) as FieldName[])[0];
    if (first) form?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    return !first;
  };

  const field = (name: FieldName) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(name, e.target.value),
    onBlur: () => blur(name),
  });

  return { values, set, errors, setErrors, field, validateAll, reset: () => setValues(EMPTY) };
}

type FieldProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  error?: string;
  optional?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  multiline?: boolean;
  tone?: "light" | "dark";
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur" | "value" | "name" | "id">;

export function Field({ id, label, error, optional, multiline, tone = "light", className = "", ...props }: FieldProps) {
  const errorId = `${id}-error`;
  const base = `block w-full rounded-xl border bg-white px-4 text-base text-navy-950 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-4 ${
    error ? "border-red-500 focus:ring-red-100" : "border-line focus:border-teal-500 focus:ring-teal-100"
  }`;
  const shared = {
    id,
    name: props.name,
    value: props.value,
    onChange: props.onChange,
    onBlur: props.onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };
  return (
    <div className={className}>
      <label htmlFor={id} className={`mb-1.5 block text-sm font-semibold ${tone === "dark" ? "text-white" : "text-navy-900"}`}>
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} maxLength={1000} placeholder={props.placeholder} className={`${base} min-h-24 resize-y py-3`} />
      ) : (
        <input
          {...shared}
          type={props.type ?? "text"}
          inputMode={props.inputMode}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          required={!optional}
          aria-required={!optional}
          className={`${base} h-12`}
        />
      )}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Hidden honeypot input — humans never see or fill it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company
        <input tabIndex={-1} autoComplete="off" name="company" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
