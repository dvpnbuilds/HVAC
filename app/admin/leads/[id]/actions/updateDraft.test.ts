import { describe, it, expect, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import { createFollowUpDraft } from "@/lib/repo/followUpDraft";
import { getActionLogsForLead } from "@/lib/repo/actionLog";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { updateDraftContent } = await import("./updateDraft");

describe("updateDraftContent action", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("persists edited content and logs a draft_edited action", async () => {
    const lead = await createLead({
      name: "Robin Cruz",
      phone: "555-3434",
      email: null,
      location: "Lakewood",
      serviceType: "Maintenance",
      rawInput: "wants a reminder",
      urgency: "normal",
      preferredSchedule: null,
    });

    const draft = await createFollowUpDraft({
      leadId: lead.id,
      type: "maintenance_reminder",
      variant: "email",
      content: "original draft",
    });

    await updateDraftContent(lead.id, draft.id, "edited draft content");

    const updated = await prisma.followUpDraft.findUnique({ where: { id: draft.id } });
    expect(updated?.content).toBe("edited draft content");

    const logs = await getActionLogsForLead(lead.id);
    expect(logs.some((log) => log.action === "draft_edited" && log.detail === draft.id)).toBe(
      true
    );
  });
});
