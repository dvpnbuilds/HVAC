const EMERGENCY_KEYWORD_PATTERNS = [
  /\bgas\b/,
  /\bsmoke\b/,
  /\bspark\w*/,
  /\bco\b/,
  /\bcarbon monoxide\b/,
  /\bburning\b/,
];

export function detectEmergencyKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORD_PATTERNS.some((pattern) => pattern.test(lower));
}
