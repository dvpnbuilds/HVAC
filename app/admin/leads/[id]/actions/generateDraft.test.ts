import { describe, it, expect, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import { getActionLogsForLead } from "@/lib/repo/actionLog";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { generateDraft } = await import("./generateDraft");

describe("generateDraft action", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates an email + sms draft pair and logs each generation", async () => {
    const lead = await createLead({
      name: "Jordan Blake",
      phone: "555-1212",
      email: "jordan@example.com",
      location: "Denver",
      serviceType: "AC repair",
      rawInput: "wants a quote follow-up",
      urgency: "normal",
      preferredSchedule: null,
    });

    await generateDraft(lead.id, "quote_followup");

    const drafts = await prisma.followUpDraft.findMany({ where: { leadId: lead.id } });
    expect(drafts).toHaveLength(2);
    expect(drafts.map((d) => d.variant).sort()).toEqual(["email", "sms"]);
    for (const draft of drafts) {
      expect(draft.type).toBe("quote_followup");
      expect(draft.content.length).toBeGreaterThan(0);
    }

    const logs = await getActionLogsForLead(lead.id);
    const draftLogs = logs.filter((log) => log.action === "draft_generated");
    expect(draftLogs.map((log) => log.detail).sort()).toEqual([
      "quote_followup:email",
      "quote_followup:sms",
    ]);
  });
});
