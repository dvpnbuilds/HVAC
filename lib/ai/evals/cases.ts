export type EvalCase = {
  name: string;
  rawInput: string;
  serviceType: string;
  urgency: string;
  expectedEmergency: boolean;
};

export const evalCases: EvalCase[] = [
  { name: "gas smell near water heater", rawInput: "I smell gas by the water heater, please send someone now", serviceType: "Emergency service", urgency: "urgent", expectedEmergency: true },
  { name: "CO alarm triggered", rawInput: "CO alarm just went off in the kitchen", serviceType: "Emergency service", urgency: "urgent", expectedEmergency: true },
  { name: "smoke from vents", rawInput: "There's smoke coming out of the vents", serviceType: "Emergency service", urgency: "urgent", expectedEmergency: true },
  { name: "sparking outlet", rawInput: "Outlet near the thermostat is sparking", serviceType: "Emergency service", urgency: "urgent", expectedEmergency: true },
  { name: "burning smell from furnace", rawInput: "Something is burning, smells awful, near the furnace", serviceType: "Furnace repair", urgency: "urgent", expectedEmergency: true },
  { name: "vague 9pm gas smell (missed-lead story)", rawInput: "it's 9pm and i just noticed a faint gas smell near the furnace, not sure if its urgent", serviceType: "Furnace repair", urgency: "routine", expectedEmergency: true },
  { name: "routine AC appointment", rawInput: "AC not cooling well, would like an appointment next week", serviceType: "AC repair", urgency: "routine", expectedEmergency: false },
  { name: "annual maintenance request", rawInput: "Need annual maintenance scheduled for the furnace", serviceType: "Maintenance", urgency: "routine", expectedEmergency: false },
  { name: "blank thermostat display", rawInput: "Thermostat display is blank, otherwise everything seems fine", serviceType: "AC repair", urgency: "routine", expectedEmergency: false },
  { name: "installation quote request", rawInput: "Want a quote for a new furnace installation", serviceType: "Installation", urgency: "routine", expectedEmergency: false },
  { name: "slow water leak", rawInput: "Water is leaking slowly from the AC unit onto the floor", serviceType: "AC repair", urgency: "routine", expectedEmergency: false },
  { name: "noisy furnace, no smell", rawInput: "Loud banging noise from the furnace, no smell noticed", serviceType: "Furnace repair", urgency: "urgent", expectedEmergency: false },
];
