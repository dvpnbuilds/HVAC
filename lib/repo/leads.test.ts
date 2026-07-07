import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead, getAllLeads, getLeadById, updateLeadStatus } from "@/lib/repo/leads";

describe("leads repo", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a lead and reads it back", async () => {
    const created = await createLead({
      name: "Jane Doe",
      phone: "555-1234",
      email: null,
      location: "Denver",
      serviceType: "AC repair",
      rawInput: "ac not blowing cold air, its been two days",
      urgency: "normal",
      preferredSchedule: null,
    });

    const found = await getLeadById(created.id);

    expect(found?.name).toBe("Jane Doe");
    expect(found?.rawInput).toBe("ac not blowing cold air, its been two days");
    expect(found?.status).toBe("new");
  });

  it("updates a lead's status", async () => {
    const created = await createLead({
      name: "Priya Nair",
      phone: "555-2222",
      email: null,
      location: "Denver",
      serviceType: "Maintenance",
      rawInput: "annual furnace tune-up requested",
      urgency: "normal",
      preferredSchedule: null,
    });

    const updated = await updateLeadStatus(created.id, "contacted");
    expect(updated.status).toBe("contacted");
  });

  it("lists all leads including their triage result", async () => {
    const uniqueName = `List Test ${Date.now()}`;
    await createLead({
      name: uniqueName,
      phone: "555-3333",
      email: null,
      location: "Lakewood",
      serviceType: "AC repair",
      rawInput: "ac not cooling",
      urgency: "normal",
      preferredSchedule: null,
    });

    const leads = await getAllLeads();
    const found = leads.find((lead) => lead.name === uniqueName);
    expect(found).toBeDefined();
    expect(found).toHaveProperty("triageResult");
  });
});
