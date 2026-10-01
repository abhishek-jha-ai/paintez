import { NextResponse } from "next/server";
import { optionLabel } from "@/config/quote";
import { siteConfig } from "@/config/site";
import { deliverLead } from "@/lib/leads/deliver";
import { normalizePhone, validateContact, type Lead, type LeadInput } from "@/lib/leads/schema";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const input: LeadInput = {
    source: body.source === "contact_form" ? "contact_form" : "quote_wizard",
    name: str(body.name, 120),
    phone: str(body.phone, 40),
    email: str(body.email, 200),
    zip: str(body.zip, 10),
    message: str(body.message, 1000) || undefined,
    timeline: str(body.timeline, 40) || undefined,
    service: str(body.service, 40) || undefined,
    propertyType: str(body.propertyType, 40) || undefined,
    projectSize: str(body.projectSize, 40) || undefined,
    company: str(body.company, 200),
  };

  // Bots fill the hidden honeypot field — pretend success, deliver nothing.
  if (input.company) return NextResponse.json({ ok: true });

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  const { company: _honeypot, ...rest } = input;
  void _honeypot;
  const lead: Lead = {
    ...rest,
    phone: normalizePhone(input.phone),
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    business: siteConfig.businessName,
    summary: Object.fromEntries(
      Object.entries({
        Name: input.name,
        Phone: input.phone,
        Email: input.email,
        ZIP: input.zip,
        Timeline: optionLabel("timeline", input.timeline),
        "Needs painted": optionLabel("service", input.service),
        "Property type": optionLabel("propertyType", input.propertyType),
        "Project size": optionLabel("projectSize", input.projectSize),
        Message: input.message,
      }).filter((entry): entry is [string, string] => Boolean(entry[1])),
    ),
  };

  try {
    const result = await deliverLead(lead);
    return NextResponse.json({ ok: true, id: lead.id, demo: result.demo });
  } catch (error) {
    console.error("[api/quote]", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request just now. Please try again in a moment." },
      { status: 502 },
    );
  }
}
