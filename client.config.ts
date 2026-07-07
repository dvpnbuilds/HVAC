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
  ],
} as const;

export type ClientConfig = typeof clientConfig;
