import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import {
  createTriageResult,
  getTriageResultForLead,
  setEmergencyOverride,
  upsertTriageResult,
} from "@/lib/repo/triageResult";

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

  it("sets and clears an operator emergency override", async () => {
    const lead = await createLead({
      name: "Nina Patel",
      phone: "555-4321",
      email: null,
      location: "Denver",
      serviceType: "AC repair",
      rawInput: "ac blowing warm air",
      urgency: "normal",
      preferredSchedule: null,
    });

    await createTriageResult({
      leadId: lead.id,
      classification: "AC — routine",
      isEmergency: false,
      slaHint: "standard — respond within SLA window",
      serviceNotes: "AC blowing warm air.",
      status: "complete",
    });

    await setEmergencyOverride(lead.id, true);
    let found = await getTriageResultForLead(lead.id);
    expect(found?.emergencyOverride).toBe(true);

    await setEmergencyOverride(lead.id, null);
    found = await getTriageResultForLead(lead.id);
    expect(found?.emergencyOverride).toBeNull();
  });

  it("upsert creates a triage result when none exists yet", async () => {
    const lead = await createLead({
      name: "Upsert Create Test",
      phone: "555-1111",
      email: null,
      location: "Denver",
      serviceType: "AC repair",
      rawInput: "ac not cooling",
      urgency: "normal",
      preferredSchedule: null,
    });

    await upsertTriageResult({
      leadId: lead.id,
      classification: "AC — routine",
      isEmergency: false,
      slaHint: "standard — respond within SLA window",
      serviceNotes: "AC not cooling.",
      status: "complete",
    });

    const found = await getTriageResultForLead(lead.id);
    expect(found?.classification).toBe("AC — routine");
  });

  it("upsert replaces an existing triage result for the same lead", async () => {
    const lead = await createLead({
      name: "Upsert Replace Test",
      phone: "555-2222",
      email: null,
      location: "Denver",
      serviceType: "Furnace repair",
      rawInput: "furnace smells like gas",
      urgency: "urgent",
      preferredSchedule: null,
    });

    await createTriageResult({
      leadId: lead.id,
      classification: "pending",
      isEmergency: false,
      slaHint: "standard — respond within SLA window",
      serviceNotes: "furnace smells like gas",
      status: "pending",
    });

    await upsertTriageResult({
      leadId: lead.id,
      classification: "Furnace — gas smell emergency",
      isEmergency: true,
      slaHint: "immediate — same-day emergency response",
      serviceNotes: "Customer reports gas smell near furnace.",
      status: "complete",
    });

    const found = await getTriageResultForLead(lead.id);
    expect(found?.classification).toBe("Furnace — gas smell emergency");
    expect(found?.isEmergency).toBe(true);
    expect(found?.status).toBe("complete");
  });
});
