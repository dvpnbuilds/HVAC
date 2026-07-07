import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createLead, getLeadById } from "@/lib/repo/leads";

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
});
