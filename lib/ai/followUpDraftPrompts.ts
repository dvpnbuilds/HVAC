import type { DraftType } from "@/lib/followUpDraftType";

export const DRAFT_TYPE_PROMPTS: Record<DraftType, string> = {
  quote_followup: "quote follow-up, checking if the customer wants to move forward",
  booking_confirmation: "booking confirmation for the scheduled appointment",
  more_details: "request for more details needed to schedule the job",
  maintenance_reminder: "seasonal maintenance reminder",
};
