import { prisma } from "@/lib/prisma";

export type CreateTriageResultInput = {
  leadId: string;
  classification: string;
  isEmergency: boolean;
  slaHint: string;
  serviceNotes: string;
  status: string;
};

export function createTriageResult(input: CreateTriageResultInput) {
  return prisma.triageResult.create({ data: input });
}

export function getTriageResultForLead(leadId: string) {
  return prisma.triageResult.findUnique({ where: { leadId } });
}

export function setEmergencyOverride(leadId: string, override: boolean | null) {
  return prisma.triageResult.update({
    where: { leadId },
    data: { emergencyOverride: override },
  });
}

export function upsertTriageResult(input: CreateTriageResultInput) {
  const { leadId, ...data } = input;
  return prisma.triageResult.upsert({
    where: { leadId },
    create: input,
    update: data,
  });
}
