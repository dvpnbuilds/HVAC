"use server";

import { createLead } from "@/lib/repo/leads";
import { logAction } from "@/lib/repo/actionLog";
import { createTriageResult } from "@/lib/repo/triageResult";
import { runTriage } from "@/lib/ai/triage";
import { validateLeadForm, type LeadFormValues } from "@/lib/validation/leadForm";

export type SubmitLeadState = {
  errors: Partial<Record<keyof LeadFormValues, string>>;
  success: boolean;
  values: LeadFormValues;
};

export async function submitLead(
  _prevState: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  const values: LeadFormValues = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    location: String(formData.get("location") ?? ""),
    serviceType: String(formData.get("serviceType") ?? ""),
    rawInput: String(formData.get("rawInput") ?? ""),
    urgency: String(formData.get("urgency") ?? ""),
    preferredSchedule: String(formData.get("preferredSchedule") ?? ""),
  };

  const result = validateLeadForm(values);
  if (!result.valid) {
    return { errors: result.errors, success: false, values };
  }

  const lead = await createLead(result.data);
  await logAction(lead.id, "submitted");

  try {
    const triage = await runTriage({
      rawInput: lead.rawInput,
      serviceType: lead.serviceType,
      urgency: lead.urgency,
    });
    await createTriageResult({ leadId: lead.id, ...triage });
    await logAction(lead.id, "triaged", triage.classification);
  } catch {
    await logAction(lead.id, "triage_failed");
  }

  return { errors: {}, success: true, values };
}
