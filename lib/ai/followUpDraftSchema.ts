import { z } from "zod";

export const followUpDraftOutputSchema = z.object({
  email: z.string().min(1),
  sms: z.string().min(1).max(300),
});

export type FollowUpDraftOutput = z.infer<typeof followUpDraftOutputSchema>;
