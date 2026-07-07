import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead } from "@/lib/repo/leads";
import {
  createFollowUpDraft,
  getFollowUpDraftsForLead,
  updateFollowUpDraftContent,
} from "@/lib/repo/followUpDraft";

describe("followUpDraft repo", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates drafts and reads them back by lead id", async () => {
    const lead = await createLead({
      name: "Chris Diaz",
      phone: "555-7777",
      email: "chris@example.com",
      location: "Denver",
      serviceType: "AC repair",
      rawInput: "want a quote follow-up",
      urgency: "normal",
      preferredSchedule: null,
    });

    await createFollowUpDraft({
      leadId: lead.id,
      type: "quote_followup",
      variant: "email",
      content: "Hi Chris, following up on your quote.",
    });
    await createFollowUpDraft({
      leadId: lead.id,
      type: "quote_followup",
      variant: "sms",
      content: "Hi Chris, ready to move forward?",
    });

    const drafts = await getFollowUpDraftsForLead(lead.id);
    expect(drafts).toHaveLength(2);
    expect(drafts.map((d) => d.variant).sort()).toEqual(["email", "sms"]);
  });

  it("updates a draft's content", async () => {
    const lead = await createLead({
      name: "Pat Kim",
      phone: "555-8888",
      email: null,
      location: "Aurora",
      serviceType: "Furnace repair",
      rawInput: "need booking confirmation",
      urgency: "normal",
      preferredSchedule: null,
    });

    const draft = await createFollowUpDraft({
      leadId: lead.id,
      type: "booking_confirmation",
      variant: "email",
      content: "original content",
    });

    await updateFollowUpDraftContent(draft.id, "edited content");
    const drafts = await getFollowUpDraftsForLead(lead.id);
    expect(drafts[0].content).toBe("edited content");
  });
});
