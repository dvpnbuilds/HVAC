import { prisma } from "@/lib/prisma";

export type CreateLeadInput = {
  name: string;
  phone: string | null;
  email: string | null;
  location: string;
  serviceType: string;
  rawInput: string;
  urgency: string;
  preferredSchedule: string | null;
};

export function createLead(input: CreateLeadInput) {
  return prisma.lead.create({ data: input });
}

export function getLeadById(id: string) {
  return prisma.lead.findUnique({ where: { id } });
}

export function getAllLeads() {
  return prisma.lead.findMany({
    include: { triageResult: true },
    orderBy: { createdAt: "desc" },
  });
}

export function updateLeadStatus(id: string, status: string) {
  return prisma.lead.update({ where: { id }, data: { status } });
}
