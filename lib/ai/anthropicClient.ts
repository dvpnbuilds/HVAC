import Anthropic from "@anthropic-ai/sdk";
import type { TriageInput } from "./triage";

const TRIAGE_TOOL = {
  name: "record_triage",
  description: "Record structured triage output for an HVAC service lead.",
  input_schema: {
    type: "object" as const,
    properties: {
      classification: { type: "string" as const, description: "Short issue classification, e.g. 'AC repair — non-urgent'." },
      isEmergency: { type: "boolean" as const, description: "True if gas leak, CO, smoke, sparks, fire, or similar immediate hazard." },
      slaHint: { type: "string" as const, description: "Recommended response window, e.g. 'respond within 2 business days'." },
      serviceNotes: { type: "string" as const, description: "Clean, professional summary of the issue for the technician." },
    },
    required: ["classification", "isEmergency", "slaHint", "serviceNotes"],
  },
};

export async function callAnthropicTriage(input: TriageInput): Promise<unknown> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    tools: [TRIAGE_TOOL],
    tool_choice: { type: "tool", name: "record_triage" },
    messages: [
      {
        role: "user",
        content: `Triage this HVAC service request.\nService type: ${input.serviceType}\nCustomer-stated urgency: ${input.urgency}\nRaw customer message: ${input.rawInput}`,
      },
    ],
  });

  const toolUse = message.content.find((block) => block.type === "tool_use");
  return toolUse && "input" in toolUse ? toolUse.input : undefined;
}
