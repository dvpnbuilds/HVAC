import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import { logAction, getActionLogsForLead } from "@/lib/repo/actionLog";

describe("actionLog repo", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("logs an action for a lead and reads it back", async () => {
    const lead = await createLead({
      name: "Bob Smith",
      phone: null,
      email: "bob@example.com",
      location: "Aurora",
      serviceType: "Furnace repair",
      rawInput: "furnace making a clicking noise",
      urgency: "normal",
      preferredSchedule: null,
    });

    await logAction(lead.id, "submitted");

    const logs = await getActionLogsForLead(lead.id);

    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe("submitted");
  });
});
