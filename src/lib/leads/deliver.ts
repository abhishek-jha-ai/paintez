/**
 * Lead delivery. Server-only.
 *
 * Each destination is a small adapter. Enable one by setting its env var —
 * see .env.example. With nothing configured (demo mode) leads are logged and
 * the visitor still sees the success screen.
 *
 *  ▸ QUOTE_WEBHOOK_URL   Generic JSON webhook. Works with Zapier ("Catch Hook"),
 *                        Make, GoHighLevel inbound webhooks, HubSpot workflow
 *                        webhooks, n8n, etc. Fan out to email / SMS / CRM /
 *                        calendar scheduling from there.
 *  ▸ Add direct adapters (e.g. HubSpot Forms API, Twilio SMS, Resend email)
 *    to the `adapters` list below.
 */
import "server-only";
import type { Lead } from "./schema";

type Adapter = {
  name: string;
  enabled: () => boolean;
  send: (lead: Lead) => Promise<void>;
};

const webhookAdapter: Adapter = {
  name: "webhook",
  enabled: () => Boolean(process.env.QUOTE_WEBHOOK_URL),
  async send(lead) {
    const res = await fetch(process.env.QUOTE_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.QUOTE_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.QUOTE_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  },
};

const adapters: Adapter[] = [webhookAdapter];

export async function deliverLead(lead: Lead): Promise<{ delivered: string[]; demo: boolean }> {
  const active = adapters.filter((a) => a.enabled());
  if (active.length === 0) {
    console.info("[lead:demo]", JSON.stringify({ id: lead.id, source: lead.source, summary: lead.summary }));
    return { delivered: [], demo: true };
  }
  const results = await Promise.allSettled(active.map((a) => a.send(lead)));
  const delivered = active.filter((_, i) => results[i].status === "fulfilled").map((a) => a.name);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[lead:${active[i].name}]`, r.reason);
  });
  if (delivered.length === 0) throw new Error("No lead destination accepted the submission");
  return { delivered, demo: false };
}
