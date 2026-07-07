import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { submitLead } from "@/app/actions/submitLead";
import { getActionLogsForLead } from "@/lib/repo/actionLog";

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

const validFields = {
  name: "Alice Chen",
  phone: "555-9999",
  email: "",
  location: "Aurora",
  serviceType: "AC repair",
  rawInput: "ac unit leaking water onto the floor",
  urgency: "Routine",
  preferredSchedule: "",
};

describe("submitLead action", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a Lead and a submitted ActionLog row on valid input", async () => {
    const uniqueName = `Alice Chen ${Date.now()}`;

    const result = await submitLead(
      { errors: {}, success: false },
      formDataFrom({ ...validFields, name: uniqueName })
    );

    expect(result.success).toBe(true);

    const lead = await prisma.lead.findFirst({ where: { name: uniqueName } });
    expect(lead).not.toBeNull();

    const logs = await getActionLogsForLead(lead!.id);
    expect(logs.map((l) => l.action)).toContain("submitted");
    expect(logs.map((l) => l.action)).toContain("triaged");

    const triageResult = await prisma.triageResult.findUnique({ where: { leadId: lead!.id } });
    expect(triageResult).not.toBeNull();
    expect(triageResult?.status).toBe("pending");
  });

  it("creates nothing and returns field errors on invalid input", async () => {
    const rawInput = `invalid submission probe ${Date.now()}`;

    const result = await submitLead(
      { errors: {}, success: false },
      formDataFrom({ ...validFields, name: "", phone: "", email: "", rawInput })
    );

    expect(result.success).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.phone).toBeDefined();

    const lead = await prisma.lead.findFirst({ where: { rawInput } });
    expect(lead).toBeNull();
  });
});
