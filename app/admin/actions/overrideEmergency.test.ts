import { describe, it, expect, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import { createTriageResult } from "@/lib/repo/triageResult";
import { getActionLogsForLead } from "@/lib/repo/actionLog";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { overrideEmergency } = await import("./overrideEmergency");

describe("overrideEmergency action", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("sets and clears the override, logging each change", async () => {
    const lead = await createLead({
      name: "Override Test",
      phone: "555-6666",
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

    await overrideEmergency(lead.id, true);
    let triage = await prisma.triageResult.findUnique({ where: { leadId: lead.id } });
    expect(triage?.emergencyOverride).toBe(true);

    await overrideEmergency(lead.id, null);
    triage = await prisma.triageResult.findUnique({ where: { leadId: lead.id } });
    expect(triage?.emergencyOverride).toBeNull();

    const logs = await getActionLogsForLead(lead.id);
    const overrideLogs = logs.filter((log) => log.action === "emergency_override");
    expect(overrideLogs.map((log) => log.detail)).toEqual(["set_emergency", "cleared"]);
  });
});
