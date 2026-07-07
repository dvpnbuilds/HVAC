import { z } from "zod";

export const triageOutputSchema = z.object({
  classification: z.string().min(1),
  isEmergency: z.boolean(),
  slaHint: z.string().min(1),
  serviceNotes: z.string().min(1),
});

export type TriageOutput = z.infer<typeof triageOutputSchema>;
