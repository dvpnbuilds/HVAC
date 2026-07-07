import { createLead } from "@/lib/repo/leads";
import { logAction } from "@/lib/repo/actionLog";
import { createTriageResult } from "@/lib/repo/triageResult";
import { createFollowUpDraft } from "@/lib/repo/followUpDraft";
import { runTriage } from "@/lib/ai/triage";
import { runFollowUpDraft } from "@/lib/ai/followUpDraft";
import { updateLeadStatus } from "@/lib/repo/leads";
import { clientConfig } from "@/client.config";
import type { LeadStatus } from "@/lib/leadStatus";
import type { DraftType } from "@/lib/followUpDraftType";

type SeedLead = {
  name: string;
  phone: string | null;
  email: string | null;
  location: string;
  serviceType: string;
  rawInput: string;
  urgency: string;
  preferredSchedule: string | null;
  status: LeadStatus;
  draft?: DraftType;
};

const seedLeads: SeedLead[] = [
  {
    name: "Maria Lopez",
    phone: "555-9876",
    email: null,
    location: "Lakewood",
    serviceType: "AC repair",
    rawInput: "ac stopped cooling this afternoon, house getting hot",
    urgency: "normal",
    preferredSchedule: null,
    status: "contacted",
    draft: "quote_followup",
  },
  {
    name: "David Chen",
    phone: null,
    email: "dchen@example.com",
    location: "Denver",
    serviceType: "Emergency service",
    rawInput: "I smell gas by the water heater, please send someone now",
    urgency: "urgent",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Priya Nair",
    phone: "555-1023",
    email: null,
    location: "Aurora",
    serviceType: "Furnace repair",
    rawInput: "it's 9pm and i just noticed a faint gas smell near the furnace, not sure if its urgent",
    urgency: "routine",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Tom Baxter",
    phone: "555-4471",
    email: null,
    location: "Denver",
    serviceType: "Emergency service",
    rawInput: "CO alarm just went off in the kitchen",
    urgency: "urgent",
    preferredSchedule: null,
    status: "contacted",
  },
  {
    name: "Angela Ruiz",
    phone: "555-2290",
    email: "angela.ruiz@example.com",
    location: "Lakewood",
    serviceType: "Emergency service",
    rawInput: "there's smoke coming out of the vents",
    urgency: "urgent",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Ken Watanabe",
    phone: "555-3388",
    email: null,
    location: "Denver",
    serviceType: "Emergency service",
    rawInput: "outlet near the thermostat is sparking",
    urgency: "urgent",
    preferredSchedule: null,
    status: "scheduled",
  },
  {
    name: "Lena Fischer",
    phone: null,
    email: "lena.f@example.com",
    location: "Aurora",
    serviceType: "Furnace repair",
    rawInput: "something is burning, smells awful, near the furnace",
    urgency: "urgent",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Marcus Webb",
    phone: "555-7712",
    email: null,
    location: "Denver",
    serviceType: "AC repair",
    rawInput: "AC not cooling well, would like an appointment next week",
    urgency: "routine",
    preferredSchedule: "next week, weekday afternoons",
    status: "scheduled",
    draft: "booking_confirmation",
  },
  {
    name: "Sophie Turner",
    phone: "555-6650",
    email: null,
    location: "Lakewood",
    serviceType: "Maintenance",
    rawInput: "need annual maintenance scheduled for the furnace",
    urgency: "routine",
    preferredSchedule: "any weekday morning",
    status: "closed",
    draft: "maintenance_reminder",
  },
  {
    name: "Isaac Morales",
    phone: "555-5541",
    email: null,
    location: "Aurora",
    serviceType: "AC repair",
    rawInput: "thermostat display is blank, otherwise everything seems fine",
    urgency: "routine",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Grace Kim",
    phone: null,
    email: "grace.kim@example.com",
    location: "Denver",
    serviceType: "Installation",
    rawInput: "want a quote for a new furnace installation",
    urgency: "routine",
    preferredSchedule: null,
    status: "contacted",
    draft: "quote_followup",
  },
  {
    name: "Robert Hays",
    phone: "555-9012",
    email: null,
    location: "Lakewood",
    serviceType: "AC repair",
    rawInput: "water is leaking slowly from the AC unit onto the floor",
    urgency: "routine",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Nadia Petrov",
    phone: "555-3345",
    email: null,
    location: "Aurora",
    serviceType: "Furnace repair",
    rawInput: "loud banging noise from the furnace, no smell noticed",
    urgency: "urgent",
    preferredSchedule: null,
    status: "contacted",
  },
  {
    name: "Owen Bright",
    phone: "555-8890",
    email: "owen.bright@example.com",
    location: "Denver",
    serviceType: "Maintenance",
    rawInput: "time for our fall maintenance check on the furnace",
    urgency: "routine",
    preferredSchedule: "weekend",
    status: "closed",
  },
  {
    name: "Carla Jimenez",
    phone: "555-4423",
    email: null,
    location: "Lakewood",
    serviceType: "Emergency service",
    rawInput: "sparking sound from the electrical panel near the AC unit",
    urgency: "urgent",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Felix Adams",
    phone: null,
    email: "felix.adams@example.com",
    location: "Aurora",
    serviceType: "AC repair",
    rawInput: "AC making a rattling noise, still cooling fine",
    urgency: "routine",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Yuki Tanaka",
    phone: "555-2201",
    email: null,
    location: "Denver",
    serviceType: "Installation",
    rawInput: "moving into a new house, need a full AC install quote",
    urgency: "routine",
    preferredSchedule: null,
    status: "contacted",
    draft: "more_details",
  },
  {
    name: "Brian O'Neill",
    phone: "555-6689",
    email: null,
    location: "Lakewood",
    serviceType: "Furnace repair",
    rawInput: "furnace pilot light keeps going out",
    urgency: "normal",
    preferredSchedule: null,
    status: "scheduled",
  },
  {
    name: "Hannah Ross",
    phone: "555-1187",
    email: "hannah.ross@example.com",
    location: "Aurora",
    serviceType: "Maintenance",
    rawInput: "want to set up a recurring maintenance plan",
    urgency: "routine",
    preferredSchedule: null,
    status: "new",
  },
  {
    name: "Victor Alan",
    phone: "555-9934",
    email: null,
    location: "Denver",
    serviceType: "Emergency service",
    rawInput: "burning smell coming from the vents, house filling with smoke",
    urgency: "urgent",
    preferredSchedule: null,
    status: "new",
  },
];

async function main() {
  for (const seed of seedLeads) {
    const lead = await createLead({
      name: seed.name,
      phone: seed.phone,
      email: seed.email,
      location: seed.location,
      serviceType: seed.serviceType,
      rawInput: seed.rawInput,
      urgency: seed.urgency,
      preferredSchedule: seed.preferredSchedule,
    });
    await logAction(lead.id, "submitted");

    try {
      const triage = await runTriage({
        rawInput: lead.rawInput,
        serviceType: lead.serviceType,
        urgency: lead.urgency,
      });
      await createTriageResult({ leadId: lead.id, ...triage });
      await logAction(lead.id, "triaged", triage.classification);
    } catch {
      await logAction(lead.id, "triage_failed");
    }

    if (seed.status !== "new") {
      await updateLeadStatus(lead.id, seed.status);
      await logAction(lead.id, "status_changed", seed.status);
    }

    if (seed.draft) {
      const draft = await runFollowUpDraft({
        type: seed.draft,
        leadName: lead.name,
        serviceType: lead.serviceType,
        location: lead.location,
        shopName: clientConfig.shopName,
        shopPhone: clientConfig.phone,
      });
      await createFollowUpDraft({ leadId: lead.id, type: seed.draft, variant: "email", content: draft.email });
      await logAction(lead.id, "draft_generated", `${seed.draft}:email`);
      await createFollowUpDraft({ leadId: lead.id, type: seed.draft, variant: "sms", content: draft.sms });
      await logAction(lead.id, "draft_generated", `${seed.draft}:sms`);
    }
  }

  console.log(`Seeded ${seedLeads.length} leads.`);
}

main();
