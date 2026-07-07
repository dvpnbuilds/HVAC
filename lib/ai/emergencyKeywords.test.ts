import { describe, it, expect } from "vitest";
import { detectEmergencyKeywords } from "./emergencyKeywords";

describe("detectEmergencyKeywords", () => {
  it("flags gas smell", () => {
    expect(detectEmergencyKeywords("I smell gas near the furnace")).toBe(true);
  });

  it("flags carbon monoxide mention", () => {
    expect(detectEmergencyKeywords("CO detector went off")).toBe(true);
  });

  it("flags smoke", () => {
    expect(detectEmergencyKeywords("there is smoke coming from the vent")).toBe(true);
  });

  it("flags sparks", () => {
    expect(detectEmergencyKeywords("outlet is throwing sparks")).toBe(true);
  });

  it("flags burning smell", () => {
    expect(detectEmergencyKeywords("burning smell from the unit")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(detectEmergencyKeywords("GAS leak reported")).toBe(true);
  });

  it("does not flag routine maintenance text", () => {
    expect(detectEmergencyKeywords("would like to schedule annual maintenance")).toBe(false);
  });

  it("does not flag empty string", () => {
    expect(detectEmergencyKeywords("")).toBe(false);
  });
});
