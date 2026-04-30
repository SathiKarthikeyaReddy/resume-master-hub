// Curated list of strong action verbs grouped by category.
// Used by ActionVerbsHelper to suggest replacements for weak openers.
export const ACTION_VERBS = {
  Leadership: ["Led", "Directed", "Spearheaded", "Orchestrated", "Mentored", "Coached", "Championed", "Mobilized"],
  Achievement: ["Achieved", "Delivered", "Exceeded", "Surpassed", "Won", "Secured", "Generated", "Drove"],
  Improvement: ["Optimized", "Streamlined", "Improved", "Enhanced", "Reduced", "Accelerated", "Transformed", "Modernized"],
  Creation: ["Built", "Designed", "Developed", "Architected", "Launched", "Created", "Engineered", "Pioneered"],
  Analysis: ["Analyzed", "Researched", "Evaluated", "Diagnosed", "Investigated", "Assessed", "Forecasted"],
  Communication: ["Presented", "Negotiated", "Influenced", "Collaborated", "Authored", "Facilitated", "Advocated"],
} as const;

// Weak openers we recommend replacing
export const WEAK_OPENERS = [
  "responsible for",
  "worked on",
  "helped",
  "assisted",
  "duties included",
  "tasked with",
  "involved in",
  "in charge of",
  "did",
  "made",
];

export const detectWeakOpener = (text: string): string | null => {
  const lower = text.trim().toLowerCase();
  return WEAK_OPENERS.find((w) => lower.startsWith(w)) || null;
};
