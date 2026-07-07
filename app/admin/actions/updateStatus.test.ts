import { describe, it, expect, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import { getActionLogsForLead } from "@/lib/repo/actionLog";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { updateStatus } = await import("./updateStatus");

describe("updateStatus action", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("persists the new status and logs it", async () => {
    const lead = await createLead({
      name: "Update Status Test",
      phone: "555-7777",
      email: null,
      location: "Denver",
      serviceType: "AC repair",
      rawInput: "ac tripping breaker",
      urgency: "normal",
      preferredSchedule: null,
    });

    await updateStatus(lead.id, "contacted");

    const found = await prisma.lead.findUnique({ where: { id: lead.id } });
    expect(found?.status).toBe("contacted");

    const logs = await getActionLogsForLead(lead.id);
    const statusLog = logs.find((log) => log.action === "status_changed");
    expect(statusLog?.detail).toBe("contacted");
  });

  it("rejects a status not in STATUS_OPTIONS", async () => {
    const lead = await createLead({
      name: "Invalid Status Test",
      phone: "555-8888",
      email: null,
      location: "Denver",
      serviceType: "AC repair",
      rawInput: "ac tripping breaker",
      urgency: "normal",
      preferredSchedule: null,
    });

    await expect(updateStatus(lead.id, "bogus")).rejects.toThrow();
  });
});
