export const clientConfig = {
  shopName: "Summit HVAC Co.",
  tagline: "Fast, honest heating & cooling service.",
  phone: "(555) 010-2200",
  serviceArea: ["Denver", "Aurora", "Lakewood"],
  serviceTypes: [
    "AC repair",
    "Furnace repair",
    "Installation",
    "Maintenance",
    "Emergency service",
  ],
  brandColor: "#1d4ed8",
  faq: [
    {
      question: "What areas do you serve?",
      answer: "We serve Denver, Aurora, and Lakewood and surrounding suburbs.",
    },
    {
      question: "Do you offer emergency service?",
      answer:
        "Yes — if you smell gas, see smoke, or notice sparking, tell us in your message and we'll treat it as same-night emergency.",
    },
    {
      question: "How fast will someone respond?",
      answer: "Routine requests get a response within our standard SLA window; urgent and emergency requests are prioritized immediately.",
    },
    {
      question: "Do you offer free quotes?",
      answer: "Yes, submit the form with your service type and we'll follow up with pricing.",
    },
  ],
} as const;

export type ClientConfig = typeof clientConfig;
