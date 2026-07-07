import { describe, it, expect, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { getActionLogsForLead } from "@/lib/repo/actionLog";

vi.mock("@/lib/repo/triageResult", () => ({
  createTriageResult: () => {
    throw new Error("DB write failed");
  },
  getTriageResultForLead: () => null,
}));

const { submitLead } = await import("@/app/actions/submitLead");

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

const validFields = {
  name: "Triage Failure Probe",
  phone: "555-8888",
  email: "",
  location: "Aurora",
  serviceType: "AC repair",
  rawInput: "ac unit leaking water onto the floor",
  urgency: "Routine",
  preferredSchedule: "",
};

describe("submitLead action — triage storage failure", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("still creates the Lead and reports success when triage storage throws", async () => {
    const uniqueName = `${validFields.name} ${Date.now()}`;

    const result = await submitLead(
      { errors: {}, success: false },
      formDataFrom({ ...validFields, name: uniqueName })
    );

    expect(result.success).toBe(true);

    const lead = await prisma.lead.findFirst({ where: { name: uniqueName } });
    expect(lead).not.toBeNull();

    const logs = await getActionLogsForLead(lead!.id);
    expect(logs.map((l) => l.action)).toContain("submitted");
    expect(logs.map((l) => l.action)).toContain("triage_failed");
  });
});
