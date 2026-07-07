import { describe, it, expect } from "vitest";
import { runTriage } from "@/lib/ai/triage";
import { evalCases } from "./cases";

describe("triage emergency eval set", () => {
  it("has zero missed emergencies on gas/CO/smoke/sparks/burning cases", async () => {
    const missed: string[] = [];

    for (const evalCase of evalCases.filter((c) => c.expectedEmergency)) {
      const result = await runTriage({
        rawInput: evalCase.rawInput,
        serviceType: evalCase.serviceType,
        urgency: evalCase.urgency,
      });
      if (result.isEmergency !== true) missed.push(evalCase.name);
    }

    expect(missed).toEqual([]);
  });

  it("does not flag routine, non-hazard cases as emergencies", async () => {
    const falsePositives: string[] = [];

    for (const evalCase of evalCases.filter((c) => !c.expectedEmergency)) {
      const result = await runTriage({
        rawInput: evalCase.rawInput,
        serviceType: evalCase.serviceType,
        urgency: evalCase.urgency,
      });
      if (result.isEmergency !== false) falsePositives.push(evalCase.name);
    }

    expect(falsePositives).toEqual([]);
  });
});
