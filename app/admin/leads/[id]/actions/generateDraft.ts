"use server";

import { revalidatePath } from "next/cache";
import { getLeadById } from "@/lib/repo/leads";
import { getTriageResultForLead } from "@/lib/repo/triageResult";
import { createFollowUpDraft } from "@/lib/repo/followUpDraft";
import { logAction } from "@/lib/repo/actionLog";
import { runFollowUpDraft } from "@/lib/ai/followUpDraft";
import { clientConfig } from "@/client.config";
import type { DraftType } from "@/lib/followUpDraftType";

export async function generateDraft(leadId: string, type: DraftType) {
  const lead = await getLeadById(leadId);
  if (!lead) throw new Error("Lead not found");

  const triage = await getTriageResultForLead(leadId);

  const result = await runFollowUpDraft({
    type,
    leadName: lead.name,
    serviceType: lead.serviceType,
    location: lead.location,
    classification: triage?.classification,
    serviceNotes: triage?.serviceNotes,
    shopName: clientConfig.shopName,
    shopPhone: clientConfig.phone,
  });

  await createFollowUpDraft({ leadId, type, variant: "email", content: result.email });
  await logAction(leadId, "draft_generated", `${type}:email`);

  await createFollowUpDraft({ leadId, type, variant: "sms", content: result.sms });
  await logAction(leadId, "draft_generated", `${type}:sms`);

  revalidatePath(`/admin/leads/${leadId}`);
}
