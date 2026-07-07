import { followUpDraftOutputSchema } from "./followUpDraftSchema";
import { callAnthropicFollowUpDraft } from "./anthropicFollowUpClient";
import type { DraftType } from "@/lib/followUpDraftType";

export type FollowUpDraftInput = {
  type: DraftType;
  leadName: string;
  serviceType: string;
  location: string;
  classification?: string;
  serviceNotes?: string;
  shopName: string;
  shopPhone: string;
};

export type FollowUpDraftResult = {
  email: string;
  sms: string;
};

export type FollowUpDraftDeps = {
  apiKey?: string;
  callLLM?: (input: FollowUpDraftInput) => Promise<unknown>;
};

const TEMPLATES: Record<DraftType, (input: FollowUpDraftInput) => FollowUpDraftResult> = {
  quote_followup: (input) => ({
    email: `Hi ${input.leadName},\n\nJust checking in on the ${input.serviceType.toLowerCase()} quote we discussed for your ${input.location} property. Let us know if you'd like to move forward or have any questions.\n\nThanks,\n${input.shopName} — ${input.shopPhone}`,
    sms: `Hi ${input.leadName}, this is ${input.shopName} following up on your ${input.serviceType.toLowerCase()} quote. Ready to move forward? Reply anytime!`,
  }),
  booking_confirmation: (input) => ({
    email: `Hi ${input.leadName},\n\nThis confirms your ${input.serviceType.toLowerCase()} appointment at your ${input.location} property. If you need to reschedule, just reply or call us.\n\nThanks,\n${input.shopName} — ${input.shopPhone}`,
    sms: `Hi ${input.leadName}, ${input.shopName} here — you're booked for ${input.serviceType.toLowerCase()}. Text us if you need to change anything!`,
  }),
  more_details: (input) => ({
    email: `Hi ${input.leadName},\n\nThanks for reaching out about your ${input.serviceType.toLowerCase()} issue. Could you share a few more details (e.g. when it started, any noises or smells) so we can prep the right parts and technician?\n\nThanks,\n${input.shopName} — ${input.shopPhone}`,
    sms: `Hi ${input.leadName}, ${input.shopName} here! Can you tell us a bit more about the ${input.serviceType.toLowerCase()} issue so we can get you scheduled right?`,
  }),
  maintenance_reminder: (input) => ({
    email: `Hi ${input.leadName},\n\nIt's about time for seasonal maintenance on your system at ${input.location}. Want us to get you on the schedule?\n\nThanks,\n${input.shopName} — ${input.shopPhone}`,
    sms: `Hi ${input.leadName}, ${input.shopName} here — time for a seasonal tune-up! Want us to schedule you in?`,
  }),
};

function templateFallback(input: FollowUpDraftInput): FollowUpDraftResult {
  return TEMPLATES[input.type](input);
}

export async function runFollowUpDraft(
  input: FollowUpDraftInput,
  deps: FollowUpDraftDeps = {}
): Promise<FollowUpDraftResult> {
  const apiKey = deps.apiKey ?? process.env.ANTHROPIC_API_KEY;
  const callLLM = deps.callLLM ?? callAnthropicFollowUpDraft;

  if (!apiKey) {
    return templateFallback(input);
  }

  let raw: unknown;
  try {
    raw = await callLLM(input);
  } catch {
    return templateFallback(input);
  }

  const parsed = followUpDraftOutputSchema.safeParse(raw);
  if (!parsed.success) {
    return templateFallback(input);
  }

  return { email: parsed.data.email, sms: parsed.data.sms };
}
