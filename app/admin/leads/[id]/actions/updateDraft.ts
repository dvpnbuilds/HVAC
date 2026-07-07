"use server";

import { revalidatePath } from "next/cache";
import { updateFollowUpDraftContent } from "@/lib/repo/followUpDraft";
import { logAction } from "@/lib/repo/actionLog";

export async function updateDraftContent(leadId: string, draftId: string, content: string) {
  await updateFollowUpDraftContent(draftId, content);
  await logAction(leadId, "draft_edited", draftId);

  revalidatePath(`/admin/leads/${leadId}`);
}
