import type { ContactFieldErrors, LeadInput } from "./schema";

export type SubmitResult = { ok: true; demo?: boolean } | { ok: false; error: string; errors?: ContactFieldErrors };

/** Browser-side submit. Change the endpoint here to post to a different backend. */
export async function submitLead(input: LeadInput): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true, demo: data.demo };
    return { ok: false, error: data.error ?? "Something went wrong. Please try again.", errors: data.errors };
  } catch {
    return { ok: false, error: "Network error — please check your connection and try again." };
  }
}
