/** Design tokens and color palette */
export const COLORS = {
  navy: "#1B3A5C",
  blue: "#3B7DD8",
  green: "#5AA867",
  purple: "#9B72CF",
  teal: "#1B8A9E",
  orange: "#E8A838",
  red: "#E06B50",
  gold: "#D4A843",
  bg: "#F0F4FA",
  card: "#ffffff",
};

/** Version metadata — 4 informant versions */
export const VERSION_META = {
  clinician: {
    label: "Clinician",
    color: COLORS.navy,
    fill: "rgba(27,58,92,0.18)",
    icon: "📋",
    settingPrompt: "e.g., 1:1 therapy, small group, diagnostic evaluation",
    instructions: "Rate current functioning based on direct clinical observation. Consider Social Awareness (SA) — noticing cues without instruction — and Independent Use (IU) — acting on cues without prompts. Specify observation context (structured vs. naturalistic, session type, materials) in the notes field per domain.",
  },
  teacher: {
    label: "Teacher",
    color: COLORS.teal,
    fill: "rgba(27,138,158,0.18)",
    icon: "🏫",
    settingPrompt: "e.g., general ed classroom, special ed, recess, lunch, specials",
    instructions: "Rate current functioning based on classroom and school observations. Consider how the student performs across school contexts — structured instruction, independent work, group activities, unstructured time (recess, hallways, lunch), and transitions between settings. Use notes to describe context per domain.",
  },
  parent: {
    label: "Parent / Caregiver",
    color: COLORS.green,
    fill: "rgba(90,168,103,0.18)",
    icon: "👨‍👩‍👧",
    instructions: "Select the response that best describes what you typically observe. Check the stress box if your child can do this but not when stressed, tired, hungry, or in unfamiliar settings. There are no right or wrong answers.",
  },
  self: {
    label: "Self-Report (14+)",
    color: COLORS.purple,
    fill: "rgba(155,114,207,0.18)",
    icon: "🧑‍🎓",
    instructions: "This is about you — how you interact with people, handle changes, and communicate. There are no right or wrong answers. Being honest helps us understand how to support you best.",
  },
};

/** Maximum scale values per version (used for score normalization) */
export const MAX_VALUES = { clinician: 4, teacher: 4, parent: 2, self: 4 };

/** Ordered version keys */
export const VERSION_ORDER = ["clinician", "teacher", "parent", "self"];
