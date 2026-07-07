import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import { createTriageResult, getTriageResultForLead } from "@/lib/repo/triageResult";

describe("triageResult repo", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a triage result and reads it back by lead id", async () => {
    const lead = await createLead({
      name: "Sam Rivera",
      phone: "555-9999",
      email: null,
      location: "Lakewood",
      serviceType: "Furnace repair",
      rawInput: "furnace making a loud bang and smells like burning",
      urgency: "urgent",
      preferredSchedule: null,
    });

    await createTriageResult({
      leadId: lead.id,
      classification: "Furnace — possible emergency",
      isEmergency: true,
      slaHint: "immediate — same-day emergency response",
      serviceNotes: "Customer reports loud bang and burning smell from furnace.",
      status: "complete",
    });

    const found = await getTriageResultForLead(lead.id);

    expect(found?.classification).toBe("Furnace — possible emergency");
    expect(found?.isEmergency).toBe(true);
    expect(found?.status).toBe("complete");
  });
});
