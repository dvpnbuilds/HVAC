import { describe, it, expect } from "vitest";
import { validateLeadForm, type LeadFormValues } from "@/lib/validation/leadForm";

function baseValues(overrides: Partial<LeadFormValues> = {}): LeadFormValues {
  return {
    name: "Jane Doe",
    phone: "555-1234",
    email: "",
    location: "Denver",
    serviceType: "AC repair",
    rawInput: "ac not blowing cold air for two days",
    urgency: "Routine",
    preferredSchedule: "",
    ...overrides,
  };
}

describe("validateLeadForm", () => {
  it("accepts valid input", () => {
    const result = validateLeadForm(baseValues());
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.name).toBe("Jane Doe");
      expect(result.data.email).toBeNull();
    }
  });

  it("rejects missing name", () => {
    const result = validateLeadForm(baseValues({ name: "  " }));
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.name).toBeDefined();
  });

  it("rejects missing contact info", () => {
    const result = validateLeadForm(baseValues({ phone: "", email: "" }));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.phone).toBeDefined();
      expect(result.errors.email).toBeDefined();
    }
  });

  it("rejects invalid email", () => {
    const result = validateLeadForm(baseValues({ phone: "", email: "not-an-email" }));
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.email).toBeDefined();
  });

  it("rejects unknown service type", () => {
    const result = validateLeadForm(baseValues({ serviceType: "Bogus service" }));
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.serviceType).toBeDefined();
  });

  it("rejects unknown urgency", () => {
    const result = validateLeadForm(baseValues({ urgency: "Whenever" }));
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.urgency).toBeDefined();
  });

  it("rejects too-short issue description", () => {
    const result = validateLeadForm(baseValues({ rawInput: "help" }));
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.rawInput).toBeDefined();
  });
});
