import { describe, it, expect } from "vitest";
import { runTriage } from "./triage";

const baseInput = {
  rawInput: "AC stopped blowing cold air, would like it looked at this week",
  serviceType: "AC repair",
  urgency: "routine",
};

describe("runTriage", () => {
  it("degrades gracefully to pending when no API key or callLLM is available", async () => {
    const result = await runTriage(baseInput, { apiKey: undefined });

    expect(result.status).toBe("pending");
    expect(result.isEmergency).toBe(false);
    expect(result.serviceNotes).toContain("AC stopped blowing cold air");
  });

  it("flags emergency via keyword fast-path even without an API key", async () => {
    const result = await runTriage(
      { ...baseInput, rawInput: "smell gas near the furnace" },
      { apiKey: undefined }
    );

    expect(result.status).toBe("pending");
    expect(result.isEmergency).toBe(true);
  });

  it("uses validated LLM output when callLLM succeeds", async () => {
    const result = await runTriage(baseInput, {
      apiKey: "test-key",
      callLLM: async () => ({
        classification: "AC repair — non-urgent",
        isEmergency: false,
        slaHint: "respond within 2 business days",
        serviceNotes: "Customer reports AC not cooling; wants service this week.",
      }),
    });

    expect(result.status).toBe("complete");
    expect(result.classification).toBe("AC repair — non-urgent");
    expect(result.slaHint).toBe("respond within 2 business days");
  });

  it("keyword fast-path overrides LLM saying no emergency", async () => {
    const result = await runTriage(
      { ...baseInput, rawInput: "burning smell coming from the unit" },
      {
        apiKey: "test-key",
        callLLM: async () => ({
          classification: "Electrical/HVAC issue",
          isEmergency: false,
          slaHint: "respond within 1 day",
          serviceNotes: "Customer reports a burning smell.",
        }),
      }
    );

    expect(result.isEmergency).toBe(true);
  });

  it("degrades to pending when LLM response fails schema validation", async () => {
    const result = await runTriage(baseInput, {
      apiKey: "test-key",
      callLLM: async () => ({ garbage: true }),
    });

    expect(result.status).toBe("pending");
  });

  it("degrades to pending when the LLM call throws", async () => {
    const result = await runTriage(baseInput, {
      apiKey: "test-key",
      callLLM: async () => {
        throw new Error("network error");
      },
    });

    expect(result.status).toBe("pending");
  });
});
