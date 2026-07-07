import { detectEmergencyKeywords } from "./emergencyKeywords";
import { triageOutputSchema } from "./schema";
import { callAnthropicTriage } from "./anthropicClient";

export type TriageInput = {
  rawInput: string;
  serviceType: string;
  urgency: string;
};

export type TriageResultData = {
  classification: string;
  isEmergency: boolean;
  slaHint: string;
  serviceNotes: string;
  status: "complete" | "pending";
};

export type TriageDeps = {
  apiKey?: string;
  callLLM?: (input: TriageInput) => Promise<unknown>;
};

function pendingFallback(input: TriageInput, keywordFlag: boolean): TriageResultData {
  return {
    classification: "pending",
    isEmergency: keywordFlag,
    slaHint: keywordFlag
      ? "immediate — same-day emergency response"
      : "standard — respond within SLA window",
    serviceNotes: input.rawInput.trim(),
    status: "pending",
  };
}

export async function runTriage(
  input: TriageInput,
  deps: TriageDeps = {}
): Promise<TriageResultData> {
  const keywordFlag = detectEmergencyKeywords(input.rawInput);
  const apiKey = deps.apiKey ?? process.env.ANTHROPIC_API_KEY;
  const callLLM = deps.callLLM ?? callAnthropicTriage;

  if (!apiKey) {
    return pendingFallback(input, keywordFlag);
  }

  let raw: unknown;
  try {
    raw = await callLLM(input);
  } catch {
    return pendingFallback(input, keywordFlag);
  }

  const parsed = triageOutputSchema.safeParse(raw);
  if (!parsed.success) {
    return pendingFallback(input, keywordFlag);
  }

  return {
    classification: parsed.data.classification,
    isEmergency: keywordFlag || parsed.data.isEmergency,
    slaHint: parsed.data.slaHint,
    serviceNotes: parsed.data.serviceNotes,
    status: "complete",
  };
}
