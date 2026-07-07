import { describe, it, expect, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import { getTriageResultForLead } from "@/lib/repo/triageResult";
import { getActionLogsForLead } from "@/lib/repo/actionLog";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { regenerateTriage } = await import("./regenerateTriage");

describe("regenerateTriage action", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("overwrites the existing triage result and logs it", async () => {
    const lead = await createLead({
      name: "Regenerate Test",
      phone: "555-3333",
      email: null,
      location: "Denver",
      serviceType: "Furnace repair",
      rawInput: "i smell gas near the furnace",
      urgency: "urgent",
      preferredSchedule: null,
    });

    await regenerateTriage(lead.id);

    const triage = await getTriageResultForLead(lead.id);
    expect(triage?.isEmergency).toBe(true);

    const logs = await getActionLogsForLead(lead.id);
    const regenLog = logs.find((log) => log.action === "triage_regenerated");
    expect(regenLog).toBeDefined();
  });

  it("throws when the lead does not exist", async () => {
    await expect(regenerateTriage("nonexistent-id")).rejects.toThrow();
  });
});
