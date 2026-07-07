import { createLead, getLeadById } from "@/lib/repo/leads";
import { logAction } from "@/lib/repo/actionLog";

async function main() {
  const lead = await createLead({
    name: "Maria Lopez",
    phone: "555-9876",
    email: null,
    location: "Lakewood",
    serviceType: "AC repair",
    rawInput: "ac stopped cooling this afternoon, house getting hot",
    urgency: "normal",
    preferredSchedule: null,
  });

  await logAction(lead.id, "submitted");

  const readBack = await getLeadById(lead.id);
  console.log(`Seeded and read back lead ${readBack?.id}: ${readBack?.name}`);
}

main();
