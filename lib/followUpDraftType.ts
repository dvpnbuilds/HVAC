export const DRAFT_TYPES = [
  { key: "quote_followup", label: "Quote follow-up" },
  { key: "booking_confirmation", label: "Booking confirmation" },
  { key: "more_details", label: "Need more details" },
  { key: "maintenance_reminder", label: "Maintenance reminder" },
] as const;

export type DraftType = (typeof DRAFT_TYPES)[number]["key"];

export const DRAFT_VARIANTS = ["email", "sms"] as const;

export type DraftVariant = (typeof DRAFT_VARIANTS)[number];
