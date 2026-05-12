/** Design tokens — Editorial-Calm teal palette */

export const THEMES = {
  dark: {
    bg: "#0d1b1a", card: "#142322", border: "#1e3332", inputBg: "#0d1b1a",
    text: "#e0edec", textMuted: "#a3bfbd", textDim: "#6b8886", textSub: "#a3bfbd",
    accent: "#3dbdad", accentDeep: "#1f7a6f",
    stickyBg: "rgba(13,27,26,0.92)",
    footerBg: "#142322",
    rowBg: "#0d1b1a", rowBgSel: "#1e3332",
    btnBg: "#142322", btnBorder: "#1e3332",
  },
  light: {
    bg: "#f0f4f4", card: "#ffffff", border: "#d4dfdf", inputBg: "#ffffff",
    text: "#1c2d2d", textMuted: "#3d5555", textDim: "#7a9191", textSub: "#3d5555",
    accent: "#1a7a7a", accentDeep: "#0e4a4a",
    stickyBg: "rgba(255,255,255,0.92)",
    footerBg: "#ffffff",
    rowBg: "#ffffff", rowBgSel: "rgba(26,122,122,0.06)",
    btnBg: "#ffffff", btnBorder: "#d4dfdf",
  },
};

// Viridis-inspired 12-stop palette for domain sections
export const SECTION_COLORS = {
  reg:      { dark: "#7ad5c5", light: "#440154" },  // D1
  orient:   { dark: "#6bc8b8", light: "#481567" },  // D2
  ja:       { dark: "#5cb4d0", light: "#482677" },  // D3
  learn:    { dark: "#4fa0d8", light: "#453781" },  // D4
  multi:    { dark: "#4888c0", light: "#3f4788" },  // D5
  flex:     { dark: "#43b08a", light: "#33568b" },  // D6
  shared:   { dark: "#5ec962", light: "#26828e" },  // D7
  interact: { dark: "#78d44b", light: "#1f9e89" },  // D8
  comm:     { dark: "#95d840", light: "#35b779" },  // D9
  ef:       { dark: "#b5de2b", light: "#6ccd5a" },  // D10
  dist:     { dark: "#d2e21b", light: "#b5de2b" },  // D11
  trans:    { dark: "#fde725", light: "#fde725" },  // D12
};

// Viridis domain colors for charts/icons (light mode primary)
export const DOMAIN_COLORS = [
  "#440154", "#481567", "#482677", "#453781", "#3f4788", "#33568b",
  "#26828e", "#1f9e89", "#35b779", "#6ccd5a", "#b5de2b", "#fde725",
];

/** Legacy color tokens (used by radar/bar charts) */
export const COLORS = {
  navy: "#1b3a4b",
  blue: "#2a6fa0",
  green: "#2a7a5a",
  purple: "#7a5aaa",
  teal: "#1a7a7a",
  orange: "#b87c4e",
  red: "#a84040",
  gold: "#b89446",
  bg: "#f0f4f4",
  card: "#ffffff",
};

/** Version metadata — 4 informant versions */
export const VERSION_META = {
  clinician: {
    label: "Clinician",
    color: "#1b3a4b",
    fill: "rgba(27,58,75,0.18)",
    icon: "📋",
    settingPrompt: "e.g., 1:1 therapy, small group, diagnostic evaluation",
    instructions: "Rate current functioning based on direct clinical observation. Consider Social Awareness (SA) — noticing cues without instruction — and Independent Use (IU) — acting on cues without prompts. Specify observation context (structured vs. naturalistic, session type, materials) in the notes field per domain.",
  },
  teacher: {
    label: "Teacher",
    color: "#1a7a7a",
    fill: "rgba(26,122,122,0.18)",
    icon: "🏫",
    settingPrompt: "e.g., general ed classroom, special ed, recess, lunch, specials",
    instructions: "Rate current functioning based on classroom and school observations. Consider how the student performs across school contexts — structured instruction, independent work, group activities, unstructured time (recess, hallways, lunch), and transitions between settings. Use notes to describe context per domain.",
  },
  parent: {
    label: "Parent / Caregiver",
    color: "#2a7a5a",
    fill: "rgba(42,122,90,0.18)",
    icon: "👨‍👩‍👧",
    instructions: "Rate your child's current functioning based on what you typically observe at home and in the community. Use the stress modifier if your child can do this but not when stressed, tired, hungry, or in unfamiliar settings. There are no right or wrong answers.",
  },
  self: {
    label: "Self-Report (14+)",
    color: "#7a5aaa",
    fill: "rgba(122,90,170,0.18)",
    icon: "🧑‍🎓",
    instructions: "This is about you — how you interact with people, handle changes, and communicate. There are no right or wrong answers. Being honest helps us understand how to support you best.",
  },
};

/** Maximum scale values per version (used for score normalization) */
export const MAX_VALUES = { clinician: 3, teacher: 3, parent: 3, self: 4 };

/** Ordered version keys */
export const VERSION_ORDER = ["clinician", "teacher", "parent", "self"];
