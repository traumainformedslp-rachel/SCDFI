/** Design tokens and color palette — RTN Dark Theme */
export const COLORS = {
  navy: "#7eb8e0",
  blue: "#3B7DD8",
  green: "#27ae60",
  purple: "#9b59b6",
  teal: "#27ae60",
  orange: "#e89b2d",
  red: "#e63946",
  gold: "#e89b2d",
  bg: "#0a0a0a",
  card: "#111111",
};

/** Version metadata — 4 informant versions */
export const VERSION_META = {
  clinician: {
    label: "Clinician",
    color: "#7eb8e0",
    fill: "rgba(126,184,224,0.15)",
    icon: "📋",
    settingPrompt: "e.g., 1:1 therapy, small group, diagnostic evaluation",
    instructions: "Rate current functioning based on direct clinical observation. Consider Social Awareness (SA) — noticing cues without instruction — and Independent Use (IU) — acting on cues without prompts. Specify observation context (structured vs. naturalistic, session type, materials) in the notes field per domain.",
  },
  teacher: {
    label: "Teacher",
    color: "#27ae60",
    fill: "rgba(39,174,96,0.15)",
    icon: "🏫",
    settingPrompt: "e.g., general ed classroom, special ed, recess, lunch, specials",
    instructions: "Rate current functioning based on classroom and school observations. Consider how the student performs across school contexts — structured instruction, independent work, group activities, unstructured time (recess, hallways, lunch), and transitions between settings. Use notes to describe context per domain.",
  },
  parent: {
    label: "Parent / Caregiver",
    color: "#e89b2d",
    fill: "rgba(232,155,45,0.15)",
    icon: "👨‍👩‍👧",
    instructions: "Select the response that best describes what you typically observe. Check the stress box if your child can do this but not when stressed, tired, hungry, or in unfamiliar settings. There are no right or wrong answers.",
  },
  self: {
    label: "Self-Report (14+)",
    color: "#9b59b6",
    fill: "rgba(155,89,182,0.15)",
    icon: "🧑‍🎓",
    instructions: "This is about you — how you interact with people, handle changes, and communicate. There are no right or wrong answers. Being honest helps us understand how to support you best.",
  },
};

/** Maximum scale values per version (used for score normalization) */
export const MAX_VALUES = { clinician: 4, teacher: 4, parent: 2, self: 4 };

/** Ordered version keys */
export const VERSION_ORDER = ["clinician", "teacher", "parent", "self"];
