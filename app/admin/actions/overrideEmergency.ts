"use server";

import { revalidatePath } from "next/cache";
import { setEmergencyOverride } from "@/lib/repo/triageResult";
import { logAction } from "@/lib/repo/actionLog";

export async function overrideEmergency(leadId: string, override: boolean | null) {
  await setEmergencyOverride(leadId, override);
  await logAction(
    leadId,
    "emergency_override",
    override === null ? "cleared" : override ? "set_emergency" : "set_not_emergency"
  );

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}
