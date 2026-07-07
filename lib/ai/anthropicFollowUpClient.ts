import Anthropic from "@anthropic-ai/sdk";
import type { FollowUpDraftInput } from "./followUpDraft";
import { DRAFT_TYPE_PROMPTS } from "./followUpDraftPrompts";

const DRAFT_TOOL = {
  name: "record_followup_draft",
  description: "Record an email and SMS/WhatsApp follow-up draft for an HVAC service lead.",
  input_schema: {
    type: "object" as const,
    properties: {
      email: { type: "string" as const, description: "Semi-formal follow-up email, addressed to the customer by name." },
      sms: { type: "string" as const, description: "Short, casual SMS/WhatsApp message, under 300 characters." },
    },
    required: ["email", "sms"],
  },
};

export async function callAnthropicFollowUpDraft(input: FollowUpDraftInput): Promise<unknown> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    tools: [DRAFT_TOOL],
    tool_choice: { type: "tool", name: "record_followup_draft" },
    messages: [
      {
        role: "user",
        content: `Write a ${DRAFT_TYPE_PROMPTS[input.type]} follow-up for an HVAC service lead.
Shop: ${input.shopName}, phone ${input.shopPhone}
Customer: ${input.leadName}
Service type: ${input.serviceType}
Location: ${input.location}
${input.classification ? `Classification: ${input.classification}\n` : ""}${input.serviceNotes ? `Notes: ${input.serviceNotes}\n` : ""}Write one email variant (semi-formal, signed from ${input.shopName}) and one SMS/WhatsApp variant (short, casual, under 300 characters).`,
      },
    ],
  });

  const toolUse = message.content.find((block) => block.type === "tool_use");
  return toolUse && "input" in toolUse ? toolUse.input : undefined;
}
