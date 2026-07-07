export const STATUS_OPTIONS = ["new", "contacted", "scheduled", "closed"] as const;

export type LeadStatus = (typeof STATUS_OPTIONS)[number];
