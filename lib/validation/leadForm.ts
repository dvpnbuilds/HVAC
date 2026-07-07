import { clientConfig } from "@/client.config";
import type { CreateLeadInput } from "@/lib/repo/leads";

export const URGENCY_OPTIONS = ["Routine", "Soon", "Emergency"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFormValues = {
  name: string;
  phone: string;
  email: string;
  location: string;
  serviceType: string;
  rawInput: string;
  urgency: string;
  preferredSchedule: string;
};

export type LeadFormResult =
  | { valid: true; data: CreateLeadInput }
  | { valid: false; errors: Partial<Record<keyof LeadFormValues, string>> };

export function validateLeadForm(values: LeadFormValues): LeadFormResult {
  const errors: Partial<Record<keyof LeadFormValues, string>> = {};

  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.location.trim()) errors.location = "Location is required.";

  if (!values.serviceType || !(clientConfig.serviceTypes as readonly string[]).includes(values.serviceType)) {
    errors.serviceType = "Select a valid service type.";
  }

  if (!values.rawInput.trim() || values.rawInput.trim().length < 10) {
    errors.rawInput = "Please describe the issue in a bit more detail.";
  }

  if (!values.urgency || !(URGENCY_OPTIONS as readonly string[]).includes(values.urgency)) {
    errors.urgency = "Select an urgency level.";
  }

  const phone = values.phone.trim();
  const email = values.email.trim();
  if (!phone && !email) {
    errors.phone = "Provide a phone number or email.";
    errors.email = "Provide a phone number or email.";
  } else if (email && !EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: values.name.trim(),
      phone: phone || null,
      email: email || null,
      location: values.location.trim(),
      serviceType: values.serviceType,
      rawInput: values.rawInput.trim(),
      urgency: values.urgency,
      preferredSchedule: values.preferredSchedule.trim() || null,
    },
  };
}
