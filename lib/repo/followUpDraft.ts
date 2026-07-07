import { prisma } from "@/lib/prisma";
import type { DraftType, DraftVariant } from "@/lib/followUpDraftType";

export type CreateFollowUpDraftInput = {
  leadId: string;
  type: DraftType;
  variant: DraftVariant;
  content: string;
};

export function createFollowUpDraft(input: CreateFollowUpDraftInput) {
  return prisma.followUpDraft.create({ data: input });
}

export function getFollowUpDraftsForLead(leadId: string) {
  return prisma.followUpDraft.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
}

export function updateFollowUpDraftContent(id: string, content: string) {
  return prisma.followUpDraft.update({ where: { id }, data: { content } });
}
