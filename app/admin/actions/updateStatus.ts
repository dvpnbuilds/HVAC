"use server";

import { revalidatePath } from "next/cache";
import { updateLeadStatus } from "@/lib/repo/leads";
import { logAction } from "@/lib/repo/actionLog";
import { STATUS_OPTIONS } from "@/lib/leadStatus";

export async function updateStatus(leadId: string, status: string) {
  if (!(STATUS_OPTIONS as readonly string[]).includes(status)) {
    throw new Error("Invalid status");
  }

  await updateLeadStatus(leadId, status);
  await logAction(leadId, "status_changed", status);

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}
