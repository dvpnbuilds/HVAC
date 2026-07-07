import { describe, it, expect } from "vitest";
import { runFollowUpDraft } from "./followUpDraft";
import { DRAFT_TYPES } from "@/lib/followUpDraftType";

const baseInput = {
  leadName: "Maria Lopez",
  serviceType: "AC repair",
  location: "Denver",
  shopName: "Summit HVAC Co.",
  shopPhone: "(555) 010-2200",
};

describe("runFollowUpDraft", () => {
  it("falls back to a template for every draft type when no API key is available", async () => {
    for (const { key } of DRAFT_TYPES) {
      const result = await runFollowUpDraft(
        { ...baseInput, type: key },
        { apiKey: undefined }
      );
      expect(result.email.length).toBeGreaterThan(0);
      expect(result.sms.length).toBeGreaterThan(0);
      expect(result.sms.length).toBeLessThan(300);
    }
  });

  it("uses validated LLM output when callLLM succeeds", async () => {
    const result = await runFollowUpDraft(
      { ...baseInput, type: "quote_followup" },
      {
        apiKey: "test-key",
        callLLM: async () => ({
          email: "Hi Maria, following up on your quote.",
          sms: "Hi Maria, ready to move forward on your quote?",
        }),
      }
    );

    expect(result.email).toBe("Hi Maria, following up on your quote.");
    expect(result.sms).toBe("Hi Maria, ready to move forward on your quote?");
  });

  it("falls back to template when LLM response fails schema validation", async () => {
    const result = await runFollowUpDraft(
      { ...baseInput, type: "booking_confirmation" },
      { apiKey: "test-key", callLLM: async () => ({ garbage: true }) }
    );

    expect(result.email).toContain("Maria Lopez");
  });

  it("falls back to template when the SMS variant exceeds 300 characters", async () => {
    const result = await runFollowUpDraft(
      { ...baseInput, type: "more_details" },
      {
        apiKey: "test-key",
        callLLM: async () => ({
          email: "Hi Maria, can you share more details?",
          sms: "x".repeat(301),
        }),
      }
    );

    expect(result.sms.length).toBeLessThan(300);
  });

  it("falls back to template when the LLM call throws", async () => {
    const result = await runFollowUpDraft(
      { ...baseInput, type: "maintenance_reminder" },
      {
        apiKey: "test-key",
        callLLM: async () => {
          throw new Error("network error");
        },
      }
    );

    expect(result.email).toContain("Maria Lopez");
  });
});
