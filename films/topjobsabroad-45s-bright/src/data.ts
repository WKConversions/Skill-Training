// Everything here is from topjobsabroad.com (read 30 Sep 2026): destinations and their taglines, the six
// open positions in Europe, the six steps, the FAQ and a verified review.

export const CITIES = [
  { id: "barcelona", name: "Barcelona", country: "Spain", tag: "Mediterranean energy" },
  { id: "madrid", name: "Madrid", country: "Spain", tag: "Capital ambitions" },
  { id: "lisbon", name: "Lisbon", country: "Portugal", tag: "Sunshine & startups" },
  { id: "athens", name: "Athens", country: "Greece", tag: "Coast meets career" },
  { id: "stockholm", name: "Stockholm", country: "Sweden", tag: "Nordic innovation" },
  { id: "porto", name: "Porto", country: "Portugal", tag: "River, wine, work" },
  { id: "sliema", name: "Sliema", country: "Malta", tag: "" },
  { id: "benalmadena", name: "Benalmádena", country: "Spain", tag: "" },
] as const;
export type CityId = (typeof CITIES)[number]["id"];

export const JOBS = [
  { title: "Czech Speaking Sales Representative", city: "Madrid", country: "Spain", flag: "es", code: "CZ", photo: "photos/madrid", pills: ["Sales", "Czech"] },
  { title: "Dutch Customer Support", city: "Sliema", country: "Malta", flag: "mt", code: "NL", photo: "photos/sliema", pills: ["Customer Service", "Dutch"] },
  { title: "Danish Speaking Customer Support", city: "Athens", country: "Greece", flag: "gr", code: "DK", photo: "photos/athens", pills: ["Customer Service", "Danish"] },
  { title: "Danish Speaking Cloud Sales Specialist", city: "Benalmádena", country: "Spain", flag: "es", code: "DK", photo: "photos/benalmadena", pills: ["Sales", "Danish"] },
  { title: "Czech Speaking Customer Support", city: "Athens", country: "Greece", flag: "gr", code: "CZ", photo: "photos/athens2", pills: ["Customer Service", "Czech"] },
];
// the thread through the film: this role is matched, interviewed for, signed and settled into
export const MATCH = 2;

export const STEPS = ["Share Your Story", "Meet Your Recruiter", "Access Hidden Roles", "Prepare to Impress", "Negotiate with Confidence", "Settle In"];
export const BRIEFING = ["The company culture", "The hiring manager", "What sets strong candidates apart"];
export const FAQ_Q = "Do I need to speak the local language?";
export const FAQ_A = "Almost never. Only the language in the job title is required.";
// "Guidance on finding apartments, registering for ID/tax numbers (NIE, AFM, personnummer), opening bank
// accounts, setting up health insurance"
export const DOCS = ["Tax number (AFM)", "Bank account", "Health insurance"];
// "You will never be charged for interviews, relocation guidance, or contract negotiation."
export const NEVER_CHARGED = ["Interviews", "Relocation guidance", "Contract negotiation"];
export const REVIEW = { quote: "I felt well taken care of from start to finish.", name: "Øyvind Kato Olsen", initials: "ØO" };
