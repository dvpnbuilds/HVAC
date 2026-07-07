import { prisma } from "@/lib/prisma";

export function logAction(leadId: string, action: string, detail?: string) {
  return prisma.actionLog.create({ data: { leadId, action, detail } });
}

export function getActionLogsForLead(leadId: string) {
  return prisma.actionLog.findMany({
    where: { leadId },
    orderBy: { createdAt: "asc" },
  });
}
