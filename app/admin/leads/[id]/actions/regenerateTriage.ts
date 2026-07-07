"use server";

import { revalidatePath } from "next/cache";
import { getLeadById } from "@/lib/repo/leads";
import { upsertTriageResult } from "@/lib/repo/triageResult";
import { logAction } from "@/lib/repo/actionLog";
import { runTriage } from "@/lib/ai/triage";

export async function regenerateTriage(leadId: string) {
  const lead = await getLeadById(leadId);
  if (!lead) throw new Error("Lead not found");

  const triage = await runTriage({
    rawInput: lead.rawInput,
    serviceType: lead.serviceType,
    urgency: lead.urgency,
  });

  await upsertTriageResult({ leadId, ...triage });
  await logAction(leadId, "triage_regenerated", triage.classification);

  revalidatePath(`/admin/leads/${leadId}`);
}
